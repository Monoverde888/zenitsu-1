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

export function init() {

    class Init extends BaseCommandOption {
        constructor() {
            super({
                options : [
                    {
                        name : "muterole",
                        required : true,
                        description : ".",
                        type : ApplicationCommandOptionTypes.ROLE,
                    }
                ],
            });
            this.name = "init";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [prefix + "settings muterole init [role]"];
                },
                category : "util",
            };
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
            this.permissionsClient = [Flags.MANAGE_GUILD, Flags.MANAGE_ROLES, Flags.MANAGE_CHANNELS].map(BigInt);
        }

        async run(
            ctx : detritus.Interaction.InteractionContext,
            args : { muterole : detritus.Structures.Role }
        ) {
            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const data = await getGuild(ctx.guildId)
            const langjson = json[data.lang]

            if (ctx.guild.roles.get(data.muterole)) return ctx.editOrRespond(
                langjson.commands.settings.muterole.init.use_refresh('/')
            );

            const role = args.muterole;

            if (!role || !(role.guildId == ctx.guildId))
                return ctx.editOrRespond(
                    langjson.commands.settings.muterole.refresh.use_init('/')
                );

            const canales = ctx.guild.channels.filter(item => item.type == 0 || item.type == 4 || item.type == 5 || item.type == 2 || item.type == 13).filter(canal => filter(canal, role.id));

            if (!canales.length) {
                if (data.muterole != role.id) {
                    const temp = await guild.findOneAndUpdate({id : ctx.guildId}, {muterole : role.id}, {new : true}).lean();
                    await redis.set(ctx.guildId, JSON.stringify(temp));
                }
                return ctx.editOrRespond(langjson.commands.settings.muterole.refresh.already);
            }

            if ((getHighest(ctx.guild.me).position < role.position) || role.managed)
                return ctx.editOrRespond(langjson.commands.settings.muterole.init.cannt_edit(role.mention));

            //await ctx.editOrRespond(langjson.commands.settings.muterole.init.editando);
            cooldown.add(ctx.guildId);
            const {success, error} = await Edit({canales, id : role.id, guild : ctx.guild})

            if (success) {
                //Todo bien, todo correcto...
                cooldown.delete(ctx.guildId);
                const temp = await guild.findOneAndUpdate({id : ctx.guildId}, {muterole : role.id}, {new : true}).lean();
                await redis.set(ctx.guildId, JSON.stringify(temp));
                return ctx.editOrRespond(langjson.commands.settings.muterole.init.success);
            }
            else if (error) {
                //Error al editar un canal...
                cooldown.delete(ctx.guildId);
                return ctx.editOrRespond(`Error: ${error.name || error}`);
            }
            else {
                //El usuario le quito permisos al bot...
                cooldown.delete(ctx.guildId);
                return ctx.editOrRespond(langjson.commands.settings.muterole.init.else);
            }

        }
    }

    return new Init();
}
