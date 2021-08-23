import detritus            from "detritus-client";
import {BaseCommandOption} from "../../../utils/classes/slash.js";
import guild               from "../../../database/models/guild.js";
import redis               from "../../../utils/managers/redis.js";
import getGuild            from "../../../utils/functions/getguild.js";
import json                from '../../../utils/lang/langs.js';

const {Constants : {Permissions : Flags}} = detritus;
const {Constants : {ApplicationCommandOptionTypes}} = detritus;

export function ignorechannels() {

    class IgnoreChannels extends BaseCommandOption {
        constructor() {
            super({
                options : [{
                    name : 'channel',
                    description : 'Channel to ignore or remove',
                    required : true,
                    type : ApplicationCommandOptionTypes.CHANNEL
                }]
            });
            this.name = "ignorechannels";
            this.disableDm = true;
            this.description = "Add or remove channels to ignore";
            this.metadata = {
                usage(prefix : string) {
                    return [
                        prefix + "settings ignorechannels #Channel",
                    ];
                },
                category : "admin",
            };
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
            this.permissionsClient = [];
        };

        async run(
            ctx : detritus.Interaction.InteractionContext,
            args : { channel : detritus.Structures.Channel }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const data = await getGuild(ctx.guildId);
            const langjson = json[data.lang];
            const channelMention = args.channel;

            if (channelMention.isText && !channelMention.isGuildThread) {

                if (!data.ignorechannels || !data.ignorechannels.includes(channelMention.id)) {
                    const temp = await guild.findOneAndUpdate({id : ctx.guildId}, {$addToSet : {ignorechannels : channelMention.id}}, {new : true}).lean();
                    await redis.set(ctx.guildId, JSON.stringify(temp));
                    return ctx.editOrRespond(langjson.commands.settings.ignorechannels.add(channelMention.mention + ' ' + channelMention.name));
                }

                const temp = await guild.findOneAndUpdate({id : ctx.guildId}, {$pull : {ignorechannels : channelMention.id}}, {new : true}).lean();
                await redis.set(ctx.guildId, JSON.stringify(temp));
                return ctx.editOrRespond(langjson.commands.settings.ignorechannels.remove(channelMention.mention + ' ' + channelMention.name));

            }

            return this.onCancelRun(ctx, args);

        }
    }

    return new IgnoreChannels();
}
