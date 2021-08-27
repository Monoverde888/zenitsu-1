import fs from 'fs/promises';
import path from 'path';
import commons from './functions/commons.js';
import detritus from 'detritus-client';
import CommandClient from './classes/commandclient.js';
import connect from '../database/connect.js';
import kufa from 'kufa';

console = new kufa.KufaConsole({
    format: '[§a%time%§r] [%prefix%§r] %message% %trace% %memory%',
    log_prefix: '§2LOG',
    warn_prefix: '§6WARN',
    error_prefix: '§4ERROR',
    traceFun: true,
    save: true,
    dir: path.join(process.cwd(), 'logs'),
    parser(ctx) {
        switch (ctx.type) {
            case 'error':
                ctx.format = '[§4%time%§r] [%prefix%§r] %message% %trace% %memory%';
                break;

            case 'warn':
                ctx.format = '[§6%time%§r] [%prefix%§r] %message% %trace% %memory%';
                break;

            case 'log':
            default:
                ctx.format = '[§a%time%§r] [%prefix%§r] %message% %trace% %memory%';
                break;
        }
    },
    //depth : 10,
});

const cache: detritus.ShardClientCacheOptions = {
    messages: { expire: 60 * 60 * 1000 },
    emojis: false,
    applications: false,
    connectedAccounts: false,
    interactions: false,
    members: false,
    notes: false,
    presences: false,
    relationships: false,
    roles: true,
    sessions: false,
    stageInstances: false,
    typings: false,
    users: false,
    voiceCalls: false,
    voiceConnections: false,
    voiceStates: false,
    channels: true,
};

export default async function Load(options: {
    token: string;
    mongo: string;
}) {

    const { token, mongo } = options;

    await connect(mongo);

    const shardClient = new detritus.ShardClient(token, {
        cache,
    });

    await shardClient.run();

    const commandClient = new CommandClient(shardClient, {
        cache,
        ratelimits: [
            { duration: 120000, limit: 40, type: 'guild' },
            { duration: 10000, limit: 5, type: 'channel' },
        ],
        mentionsEnabled: false,
        activateOnEdits: false,
        prefixes: ['z!'],
    });

    await commandClient.run();

    const slashClient = new detritus.InteractionCommandClient(shardClient, {
        cache,
        checkCommands: true,
        ratelimits: [
            { duration: 120000, limit: 40, type: 'guild' },
            { duration: 10000, limit: 5, type: 'channel' },
        ],
    });
    await addMultipleIn(slashClient, './dist/commands-slash');
    await slashClient.run();

    console.log(
        `[DETRITUS] ${shardClient.user.username} dice hola al mundo :):):):)`
    );

    await loadCommands(commandClient);
    await loadEvents(shardClient, commandClient, slashClient);

    return { commandClient, shardClient };
}

async function loadEvents(
    client: detritus.ShardClient,
    commandClient: CommandClient,
    slashClient: detritus.InteractionCommandClient
) {
    const { __dirname } = commons(import.meta.url);

    const ruta = (...str: string[]) => path.join(__dirname, '..', ...str);
    const load = async (
        file: string,
        listener: detritus.ShardClient | CommandClient | detritus.InteractionCommandClient
    ) => {
        try {
            const { default: RES } = await import(
                'file:///' +
                ruta('events', listener.constructor.name.toLowerCase(), file)
            );
            listener.on(RES.name, RES.bind(null, client).bind(null, slashClient));
        } catch (e) {
            console.error(e, file);
        }
    };

    const eventos = await fs.readdir(ruta('events', 'shardclient'));

    for (const i of eventos) await load(i, client);

    const eventosC = await fs.readdir(ruta('events', 'commandclient'));

    for (const i of eventosC) await load(i, commandClient);

    const eventosI = await fs.readdir(ruta('events', 'interactioncommandclient'));

    for (const i of eventosI) await load(i, slashClient);
}

async function loadCommands(commandClient: CommandClient) {
    const { __dirname } = commons(import.meta.url);

    const ruta = (...str: string[]) => path.join(__dirname, '..', ...str);
    const load = async (dirs: string) => {
        const commands = (await fs.readdir(ruta('commands', dirs))).filter((d) => {
            return d.endsWith('.ts') || d.endsWith('.js');
        });
        for (const file of commands) {
            try {
                const { default: archivo } = await import(
                    'file:///' + ruta('commands', dirs, file)
                );
                commandClient.add(archivo);
            } catch (e) {
                console.error(e, file);
                break;
            }
        }
    };

    const categorys = await fs.readdir(ruta('commands'));

    for (const i of categorys) {
        await load(i);
    }
}

//EDITED FROM detritus-client
async function addMultipleIn(
    slashClient: detritus.InteractionCommandClient,
    directory: string,
    options: { isAbsolute?: boolean; subdirectories?: boolean } = {}
) {
    options = Object.assign({ subdirectories: true }, options);
    if (!options.isAbsolute) {
        directory = path.join(process.cwd(), directory);
    }
    slashClient.directories.set(directory, {
        subdirectories: !!options.subdirectories,
    });

    const files: string[] = await getFiles(
        directory,
        options.subdirectories
    );
    const errors: Record<string, Error> = {};

    const addCommand = (imported: any, filepath: string): void => {
        if (!imported) {
            return;
        }
        if (typeof imported === 'function') {
            slashClient.add({ _file: filepath, _class: imported, name: '' });
        } else if (imported instanceof detritus.Interaction.InteractionCommand) {
            Object.defineProperty(imported, '_file', { value: filepath });
            slashClient.add(imported);
        } else if (typeof imported === 'object' && Object.keys(imported).length) {
            if (Array.isArray(imported)) {
                for (const child of imported) {
                    addCommand(child, filepath);
                }
            } else {
                if ('name' in imported) {
                    slashClient.add({ ...imported, _file: filepath });
                }
            }
        }
    };
    for (const file of files) {
        if (!file.endsWith('.js')) {
            continue;
        }
        const filepath = path.resolve(directory, file);
        try {
            let importedCommand: any = await import('file:///' + filepath);
            if (typeof importedCommand === 'object' && importedCommand.default) {
                importedCommand = await importedCommand.default();
            }
            addCommand(importedCommand, filepath);
        } catch (error) {
            errors[filepath] = error;
        }
    }

    if (Object.keys(errors).length) {
        throw errors;
    }

    return slashClient;
}

async function getFiles(
    directory: string,
    subdirectories?: boolean
): Promise<string[]> {
    if (subdirectories) {
        const dirents = await fs.readdir(directory, { withFileTypes: true });
        const names: string[] = [];
        for (const folder of dirents.filter((dirent) => dirent.isDirectory())) {
            const files = await getFiles(
                `${directory}/${folder.name}`,
                subdirectories
            );
            for (const name of files) {
                names.push(`${folder.name}/${name}`);
            }
        }
        for (const file of dirents.filter((dirent) => dirent.isFile())) {
            names.push(file.name);
        }
        return names;
    } else {
        return await fs.readdir(directory);
    }
}