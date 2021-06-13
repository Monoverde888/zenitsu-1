const cooldown: Set<string> = new Set();
import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import * as  eris from '@lil_marcrock22/eris-light';
import FLAGS from '../../Utils/Const/FLAGS.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import getHighest from '../../Utils/Functions/getHighest.js';
import settingsMODEL, { Settings as SETTINGS } from '../../models/settings.js';


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

    async run({ client, message, args, embedResponse, langjson, prefix }: command): Promise<eris.Message> {

        const settings = langjson.commands.settings;
        const { muterole, cooldown: cooldownMessage } = settings;
        const data: SETTINGS = await client.redis.get(message.guildID, 'settings_').then(x => typeof x == 'string' ? JSON.parse(x) : null) || await settingsMODEL.findOne({ id: message.guildID }).lean() || await settingsMODEL.create({ id: message.guildID });
        const GUILDME = message.guild.me;

        if (cooldown.has(message.guildID))
            return embedResponse(cooldownMessage, message.channel, client.color);

        switch (args[0]) {

            case 'muterole': {

                switch (args[1]) {

                    case 'init': {

                        if (message.guild.roles.get(data.muterole)) return embedResponse(
                            muterole.init.use_refresh(prefix), message.channel, client.color
                        );

                        const role = message.guild.roles.get(args[2]) || message.guild.roles.find(item => item.name == args.slice(2).join(' ')) || message.guild.roles.get(message.roleMentions[0]);

                        if (!role)
                            return embedResponse(
                                muterole.refresh.use_init(prefix), message.channel, client.color
                            );

                        const canales = message.guild.channels.filter(item => item.type == 0 || item.type == 4 || item.type == 5 || item.type == 2 || item.type == 13).filter(canal => filter(canal, role.id));

                        if (!canales.length) {
                            if (data.muterole != role.id) {
                                const temp = await settingsMODEL.findOneAndUpdate({ id: message.guildID }, { muterole: role.id }, { new: true }).lean();
                                await client.redis.set(message.guildID, JSON.stringify(temp), 'settings_');
                            }
                            return embedResponse(muterole.refresh.already, message.channel, client.color);
                        }

                        if ((getHighest(GUILDME).position < role.position) || role.managed)
                            return embedResponse(muterole.init.cannt_edit(role.mention), message.channel, client.color);

                        await embedResponse(muterole.init.editando, message.channel, client.color);
                        cooldown.add(message.guildID);
                        const { success, error } = await Edit({ canales, id: role.id, message })

                        if (success) {
                            //Todo bien, todo correcto...
                            cooldown.delete(message.guildID);
                            const temp = await settingsMODEL.findOneAndUpdate({ id: message.guildID }, { muterole: role.id }, { new: true }).lean();
                            await client.redis.set(message.guildID, JSON.stringify(temp), 'settings_');
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

                        const { success, error } = await Edit({ canales, message, id: role.id })

                        if (success) {
                            //Todo bien, todo correcto...
                            cooldown.delete(message.guildID);
                            const temp = await settingsMODEL.findOneAndUpdate({ id: message.guildID }, { muterole: role.id }, { new: true }).lean();
                            await client.redis.set(message.guildID, JSON.stringify(temp), 'settings_');
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

                await settingsMODEL.deleteOne({ id: message.guildID });
                await client.redis.del(message.guildID, 'settings_');
                
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

async function Edit(all: { canales: el_canal[], id: string, message: eris.Message }): Promise<{ error: Error, success: boolean }> {

    const { canales, id, message } = all;
    let success = true;
    let error: Error = null;
    const GUILDME = message.guild.me;

    type permisitos = 'manageGuild' | 'manageRoles' | 'manageChannels';
    const permisos: permisitos[] = ['manageGuild', 'manageRoles', 'manageChannels'];

    for (const canal of canales) {

        const permisosBit = FLAGS.SEND_MESSAGES + FLAGS.ADD_REACTIONS;
        const permisosVoice = FLAGS.CONNECT + FLAGS.SPEAK + FLAGS.STREAM;
        const role = message.guild.roles.get(id);
        const check = permisos.every(item => GUILDME.permissions.has(item)) && role && !((getHighest(GUILDME).position < role.position) || role.managed);

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