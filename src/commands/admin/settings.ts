const cooldown: Set<string> = new Set();
import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import eris from '@lil_marcrock22/eris-light-pluris';
import FLAGS from '../../Utils/Const/FLAGS.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import Zenitsu from '../../Utils/Classes/client.js';
import getHighest from '../../Utils/Functions/getHighest.js';

class Comando extends Command {

    constructor() {
        super();
        this.cooldown = 20;
        this.name = "settings"
        this.alias = []
        this.category = 'admin'
        this.botPermissions = { guild: ['manageGuild', 'manageRoles', 'manageChannels'], channel: [] }
        this.memberPermissions = { guild: ['manageGuild'], channel: [] }
    }

    async run({ client, message, args, embedResponse, langjson }: command): Promise<eris.Message> {

        const { muterole, cooldown: cooldownMessage } = langjson.commands.settings;
        const pre_prefix = await client.prefix.cacheOrFetch(message.guildID);
        const prefix = pre_prefix.prefix;
        const data = await client.settings.cacheOrFetch(message.guildID);
        const GUILDME = message.guild.members.get(client.user.id)

        if (cooldown.has(message.guildID))
            return embedResponse(cooldownMessage, message.channel, client.color);

        switch (args[0]) {

            case 'muterole': {

                switch (args[1]) {

                    case 'init': {

                        if (message.guild.roles.get(data.muterole)) return embedResponse(
                            muterole.init.use_refresh(prefix), message.channel, client.color
                        );

                        cooldown.add(message.guildID);

                        const canales = message.guild.channels.filter(item => item.type == 0 || item.type == 4 || item.type == 5 || item.type == 2 || item.type == 13);
                        const role = message.guild.roles.get(args[2]) || message.guild.roles.get(message.roleMentions[0]) || await message.guild.createRole({ name: 'Muted', color: 0x6e5b56, permissions: 0 });

                        if ((getHighest(GUILDME).position < role.position) || role.managed) {
                            cooldown.delete(message.guildID);
                            return embedResponse(muterole.init.cannt_edit(role.mention), message.channel, client.color);
                        }

                        await embedResponse(muterole.init.editando, message.channel, client.color);
                        const { success, error } = await Edit({ canales, id: role.id, message, client })

                        if (success) {
                            //Todo bien, todo correcto...
                            cooldown.delete(message.guildID);
                            await client.settings.set(message.guildID, 'muterole', role.id)
                            return embedResponse(muterole.init.success, message.channel, client.color);
                        }
                        else if (error) {
                            //Error al editar un canal...
                            cooldown.delete(message.guildID);
                            return embedResponse(`Error: ${error.name || error?.toString() || error}`, message.channel, client.color);
                        }
                        else {
                            //El usuario le quito permisos al bot...
                            cooldown.delete(message.guildID);
                            return embedResponse(muterole.init.else, message.channel, client.color);
                        }
                    }
                        break;

                    case 'refresh': {

                        const role = message.guild.roles.get(data.muterole);

                        if (!role) return embedResponse(
                            muterole.refresh.use_init(prefix), message.channel, client.color
                        );

                        if ((getHighest(GUILDME).position < role.position) || role.managed) {
                            cooldown.delete(message.guildID);
                            return embedResponse(muterole.refresh.cannt_edit(role.mention), message.channel, client.color);
                        }//ya(role: string)

                        const canales = message.guild.channels.filter(item => filter(item, role.id))

                        if (!canales.length)
                            return embedResponse(muterole.refresh.already, message.channel, client.color);

                        cooldown.add(message.guildID);

                        await embedResponse(muterole.refresh.editando, message.channel, client.color);

                        const { success, error } = await Edit({ canales, message, client, id: role.id })

                        if (success) {
                            //Todo bien, todo correcto...
                            cooldown.delete(message.guildID);
                            await client.settings.set(message.guildID, 'muterole', role.id)
                            return embedResponse(muterole.refresh.success, message.channel, client.color);
                        }
                        else if (error) {
                            //Error al editar un canal...
                            cooldown.delete(message.guildID);
                            return embedResponse(`Error: ${error.name || error?.toString() || error}`, message.channel, client.color);
                        }
                        else {
                            //El usuario le quito permisos al bot...
                            cooldown.delete(message.guildID);
                            return embedResponse(muterole.refresh.else, message.channel, client.color);
                        }
                    }
                        break;
                    default: {
                        return embedResponse(
                            `
                            ${prefix}settings (view|muterole|reset)
                            ${prefix}settings view
                            ${prefix}settings muterole init [role]
                            ${prefix}settings muterole refresh
                            ${prefix}settings reset
                            `, message.channel, client.color
                        )
                    }
                        break;
                }
            }
                break;

            case 'view': {
                const rol = message.guild.roles.get(data.muterole);
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .addField('Muterole', rol ? `${rol.mention}  \`[${rol.id}]\`` : '❌')
                    .setTimestamp();
                return message.channel.createMessage({ embed });
            }
                break;

            case 'reset': {

                await client.settings.delete(message.guildID);
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(langjson.commands.settings.reset.message)
                    .setTimestamp();
                return message.channel.createMessage({ embed });


            }
                break;

            default: {

                return embedResponse(
                    `
                    ${prefix}settings (view|muterole|reset)
                    ${prefix}settings view
                    ${prefix}settings muterole init [role]
                    ${prefix}settings muterole refresh
                    ${prefix}settings reset
                    `, message.channel, client.color
                )

            }
                break;
        }
    }
}

export default Comando;

type el_canal = eris.AnyGuildChannel

async function Edit(all: { canales: el_canal[], id: string, message: eris.Message, client: Zenitsu }): Promise<{ error: Error, success: boolean }> {

    const { canales, id, message, client } = all;
    let success = true;
    let error: Error = null;
    const GUILDME = message.guild.members.get(client.user.id);

    type permisitos = 'manageGuild' | 'manageRoles' | 'manageChannels';
    const permisos: permisitos[] = ['manageGuild', 'manageRoles', 'manageChannels'];

    for (const canal of canales) {

        const permisosBit = FLAGS.SEND_MESSAGES + FLAGS.ADD_REACTIONS;
        const permisosVoice = FLAGS.CONNECT + FLAGS.SPEAK + FLAGS.STREAM;
        const check = permisos.every(item => GUILDME.permissions.has(item)) && message.guild.roles.get(id);

        if (check && success) {
            await canal.editPermission(id, 0, (canal.type == 2 || canal.type == 13) ? permisosVoice : permisosBit, 'role')
                .then(() => {
                    success = true;
                })
                .catch((e) => {
                    error = e;
                    success = false;
                });
        }
        else {
            success = false;
        }

    }

    return { success, error };

}

function filter(item: eris.AnyGuildChannel, id: string) {

    const TEXT = FLAGS.SEND_MESSAGES + FLAGS.ADD_REACTIONS;
    const VOICE = FLAGS.CONNECT + FLAGS.SPEAK + FLAGS.STREAM;

    if ([13, 2].includes(item.type)) {
        if (!item.permissionOverwrites.has(id)) return true;
        if ((Number(item.permissionOverwrites.get(id).deny) & VOICE) == VOICE) return false;
        else return true;
    }

    else if ([4, 0, 5].includes(item.type)) {
        if (!item.permissionOverwrites.has(id)) return true;
        if (((Number(item.permissionOverwrites.get(id).deny) & TEXT) == TEXT)) return false;
        else return true;
    }

    return false;

}