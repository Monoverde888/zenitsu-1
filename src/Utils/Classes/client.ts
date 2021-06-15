//Functions
import common from '../Functions/commons.js';

//Interfaces
import imagenesC from '../Interfaces/imagenes.js';
import Flag from '../Interfaces/profile/flag.js';
import Achievement from '../Interfaces/profile/achievement.js';

//Values
import path from 'path';
const { join } = path;
import fs from 'fs/promises';
const { readdir, writeFile } = fs;
const res = common(import.meta.url);
const __dirname: string = res.__dirname;
import * as eris from '@lil_marcrock22/eris-light';
import dbla from 'dblapi.js';
import mongoose from 'mongoose';
const { connect, set, connection } = mongoose;
import CANVAS from 'canvas';
const { loadImage, registerFont } = CANVAS;
import svg from 'node-svg2img';
import util from 'util';
const { promisify } = util;

//Classes
import Collection from './Collection.js';
import Buttons from './ListernerButtons.js';
import Listener from './Listener.js';
import Comando from './command.js';

//Managers
import Redis from './Managers/RedisManager.js'

class Zenitsu extends eris.Client {

    buttons: Buttons;
    flags: Flag;
    listener: Listener;
    fileTOPGG: Buffer;
    dbl: dbla;
    color: number;
    imagenes: imagenesC;
    commands: Collection<string, Comando>;
    devs: string[];
    achievements: Achievement;
    redis: Redis;

    constructor(token: string, options: eris.ClientOptions) {
        super(token, options);
    }

    async connect(): Promise<void> {
        this.redis = new Redis();
        await this.init();
        await super.connect();
        return;
    }

    async init(): Promise<this> {
        registerFont(join(__dirname, '..', '..', '..', 'Assets', 'bettersans.ttf'), { family: 'Comic Sans' })
        const file = await fs.readFile(this.rutaImagen('topgg.png'));
        this.fileTOPGG = file;
        this.devs = ['507367752391196682', '577000793094488085', '390726024536653865']
        this.commands = new Collection();
        this.dbl = new dbla(process.env.DBLTOKEN, this);
        this.color = 14720566;
        this.buttons = new Buttons();
        this.listener = new Listener();
        set('useFindAndModify', false);
        await connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log(`Connected to MONGODB.`));
        await this.loadImages();
        await this.loadCommands();
        await this.loadEvents();
        return this;
    }

    async loadImages(): Promise<imagenesC> {
        this.imagenes = {
            porquelloras: {
                chica: await loadImage(this.rutaImagen(`chica.png`)),
                chico: await loadImage(this.rutaImagen('chico.jpg'))
            },
            nicememe: {
                background: await loadImage(this.rutaImagen('nicememe.png'))
            },
            tictactoe: {
                background: await loadImage(this.rutaImagen(`inicio_tictactoe.gif`)),
                equis: await loadImage(this.rutaImagen(`x_tic.png`)),
                circulo: await loadImage(this.rutaImagen(`o_tic.png`))
            },
            connect4: {
                background: await loadImage(this.rutaImagen('4enraya.png')),
                win: await loadImage(this.rutaImagen('morado_de_4.png')),
                verde: await loadImage(this.rutaImagen('rojo_de_cuatro.png')),
                amarillo: await loadImage(this.rutaImagen('amarillo_de_cuatro.png'))
            },
            empty: await loadImage(this.rutaImagen('empty.png'))
        };

        this.flags = {
            booster: await loadImage(this.rutaProfile('booster.png', 'Flags')),
            bug1: await loadImage(this.rutaProfile('bug1.png', 'Flags')),
            bug2: await loadImage(this.rutaProfile('bug2.png', 'Flags')),
            bug3: await loadImage(this.rutaProfile('bug3.png', 'Flags')),
            staff: await loadImage(this.rutaProfile('staff.png', 'Flags')),
            vip: await loadImage(this.rutaProfile('vip.png', 'Flags')),
            hamburger: await loadImage(this.rutaProfile('hamburger.png', 'Flags')),
            helper: await loadImage(this.rutaProfile('helper.png', 'Flags')),
        };

        this.achievements = {
            c4level1: await loadImage(this.rutaProfile('c4level1.png', 'Achievements')),
            c4level2: await loadImage(this.rutaProfile('c4level2.png', 'Achievements')),
            c4level3: await loadImage(this.rutaProfile('c4level3.png', 'Achievements')),
            c4top: await loadImage(this.rutaProfile('c4top.png', 'Achievements')),
        };

        const buffer = (await promisify(svg)(`https://top.gg/api/widget/721080193678311554.svg`, {}));

        this.fileTOPGG = buffer;

        await writeFile(this.rutaImagen('topgg.png'), this.fileTOPGG)

        return this.imagenes;

    }

    async postStats(update = false): Promise<boolean> {
        await this.dbl.postStats(this.guilds.size);

        if (update) {
            const buffer = (await promisify(svg)(`https://top.gg/api/widget/721080193678311554.svg`, {}));
            this.fileTOPGG = buffer;
            await writeFile(this.rutaImagen('topgg.png'), this.fileTOPGG)
        }

        return true;
    }

    async loadCommands(): Promise<Zenitsu> {

        const ruta = (...str: string[]) => join(__dirname, '..', '..', ...str)
        const load = async (dirs: string) => {
            const commands = (await readdir(ruta('commands', dirs))).filter(d => {
                return d.endsWith('.ts') || d.endsWith('.js');
            });
            for (const file of commands) {
                try {
                    const { default: archivo } = await import(`file:///` + ruta('commands', dirs, file));
                    const instance = new archivo();
                    if (this.commands.has(instance.name)) {
                        console.log(instance)
                        console.warn(`${instance.name} ya existe.`)

                        continue;
                    }
                    instance.init(this);
                    this.commands.set(instance.name, instance);
                } catch (e) {
                    console.log(e, file);
                    break;
                }
            }
        };

        const categorys = await readdir(ruta('commands'))

        for (const i of categorys) {

            await load(i);

        }

        return this;

    }

    rutaImagen(str: string): string {
        return join(__dirname, '..', '..', '..', 'Images', str)
    }

    rutaProfile(str: string, type: 'Flags' | 'Achievements'): string {
        return join(__dirname, '..', '..', '..', 'Profile', type, str)
    }

    async loadEvents(): Promise<Zenitsu> {

        const ruta = (...str: string[]) => join(__dirname, '..', '..', ...str)
        const load = async (event: string) => {

            const { default: a } = await import(`file:///` + ruta('events', event))

            try {

                this[a.name as 'on' | 'once'](event.split('.')[0], a.bind(null, this));

            }
            catch (e) {
                console.log(event, e.message || e);
            }

        };

        const eventos = await readdir(ruta('events'))

        for (const i of eventos) {

            await load(i);

        }

        return this;

    }


    get private(): string[] {
        return [
            process.env.DISCORD_TOKEN,
            process.env.DBLTOKEN,
            process.env.MONGODB,
            process.env.PASSWORD,
            process.env.PASSWORDDBL,
            process.env.WEBHOOKID,
            process.env.WEBHOOKTOKEN,
            process.env.SHARD_ID,
            process.env.SHARD_TOKEN,
            connection.pass,
            connection.user,
            connection.host,
            process.env.APIKEY,
        ].filter(item => item);
    }

    unMarkdown(texto: string): string {

        return texto.split('*').join(`\\*`).split('`').join("\\`").split('~').join(`\\~`).split('_').join(`\\_`).split('|').join(`\\|`);

    }

}

export default Zenitsu;
