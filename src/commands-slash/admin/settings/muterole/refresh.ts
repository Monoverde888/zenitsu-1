import detritus            from "detritus-client";
import {Edit, filter}      from "../../../../utils/functions/edit.js";
import json                from "../../../../utils/lang/langs.js";
import getGuild            from "../../../../utils/functions/getguild.js";
import {BaseCommandOption} from "../../../../utils/classes/slash.js";
import guild               from "../../../../database/models/guild.js";
import redis               from "../../../../utils/managers/redis.js";
import getHighest          from "../../../../utils/functions/gethighest.js";
import {cooldown}          from '../../../../utils/maps.js';

const {Constants : {Permissions : Flags}} = detritus;
const {Constants : {ApplicationCommandOptionTypes}} = detritus;

export function refresh() {

    class Refresh extends BaseCommandOption {
        constructor() {
            super();
            this.name = "refresh";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [prefix + "settings muterole refresh"];
                },
                category : "util",
            };
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
            this.permissionsClient = [Flags.MANAGE_GUILD, Flags.MANAGE_ROLES, Flags.MANAGE_CHANNELS].map(BigInt);
        }

        async run(
            ctx : detritus.Slash.SlashContext,
            args : { muterole : detritus.Structures.Role }
        ) {
            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const data = await getGuild(ctx.guildId)
            const langjson = json[data.lang]

            const role = ctx.guild.roles.get(data.muterole);

            if (!role) return ctx.editOrRespond(
                langjson.commands.settings.muterole.refresh.use_init('/'),
            );

            if ((getHighest(ctx.guild.me).position < role.position) || role.managed) {
                cooldown.delete(ctx.guildId);
                return ctx.editOrRespond(langjson.commands.settings.muterole.refresh.cannt_edit(role.mention));
            }
            ;

            const canales = ctx.guild.channels.filter(item => filter(item, role.id))

            if (!canales.length)
                return ctx.editOrRespond(langjson.commands.settings.muterole.refresh.already);

            cooldown.add(ctx.guildId);

            //await ctx.editOrRespond(langjson.commands.settings.muterole.refresh.editando);

            const {success, error} = await Edit({canales, guild : ctx.guild, id : role.id})

            if (success) {
                //Todo bien, todo correcto...
                cooldown.delete(ctx.guildId);
                const temp = await guild.findOneAndUpdate({id : ctx.guildId}, {muterole : role.id}, {new : true}).lean();
                await redis.set(ctx.guildId, JSON.stringify(temp));
                return ctx.editOrRespond(langjson.commands.settings.muterole.refresh.success);
            }
            else if (error) {
                //Error al editar un canal...
                cooldown.delete(ctx.guildId);
                return ctx.editOrRespond(`Error: ${error.name || error}`);
            }
            else {
                //El usuario le quito permisos al bot...
                cooldown.delete(ctx.guildId);
                return ctx.editOrRespond(langjson.commands.settings.muterole.refresh.else);
            }

        }
    }

    return new Refresh();
}
