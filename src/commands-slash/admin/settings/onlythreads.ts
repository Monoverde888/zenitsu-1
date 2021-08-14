import detritus            from "detritus-client";
import {BaseCommandOption} from "../../../utils/classes/slash.js";
import guild               from "../../../database/models/guild.js";
import redis               from "../../../utils/managers/redis.js";
import getGuild            from "../../../utils/functions/getguild.js";
import json                from '../../../utils/lang/langs.js';

const {Constants : {ApplicationCommandOptionTypes}} = detritus;
const {Constants : {Permissions : Flags}} = detritus;

export function onlythreads() {

    class OnlyThreads extends BaseCommandOption {
        constructor() {
            super({
                options : [{
                    name : 'value',
                    description : '.',
                    required : true,
                    type : ApplicationCommandOptionTypes.BOOLEAN
                }]
            });
            this.name = "onlythreads";
            this.disableDm = true;
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [
                        prefix + "settings onlythreads false",
                        prefix + "settings onlythreads true",
                    ];
                },
                category : "admin",
            };
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
            this.permissionsClient = [];
        };

        async run(
            ctx : detritus.Interaction.InteractionContext,
            args : { value : boolean }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const data = await getGuild(ctx.guildId);
            const langjson = json[data.lang];
            const temp = await guild.findOneAndUpdate({id : ctx.guildId}, {onlythreads : !args.value}, {new : true}).lean();
            await redis.set(ctx.guildId, JSON.stringify(temp));
            return ctx.editOrRespond(temp.onlythreads ? langjson.commands.settings.onlythreads.true : langjson.commands.settings.onlythreads.false);

        }
    }

    return new OnlyThreads();
}
