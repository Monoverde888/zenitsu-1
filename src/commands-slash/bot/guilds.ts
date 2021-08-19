import detritus                from 'detritus-client';
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import {Color}                 from '../../utils/const.js'
import {BaseSlash}             from '../../utils/classes/slash.js';
import json                    from '../../utils/lang/langs.js';
import getGuild                from '../../utils/functions/getguild.js';

export default function () {

    class Guilds extends BaseSlash {
        constructor() {
            super();
            this.name = 'guilds'
            this.description = '.'
            this.metadata = {
                usage(prefix : string) {
                    return [`${prefix}guilds`];
                },
                category : "bot",
            };
        }

        async run(ctx : detritus.Interaction.InteractionContext) {

            const langjson = ctx.guildId ? json[(await getGuild(ctx.guildId).then(x => x.lang))] : json.en;

            const embed = new MessageEmbed()
                .setColor(Color)
                .setDescription(langjson.commands.guilds.message(ctx.client.guilds.size))
                .setTimestamp()
                .setAuthor(`${ctx.shardCount} shards`)
                .setFooter(`Shard #${ctx.shardId}`);

            return ctx.respond(detritus.Constants.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                embed,
                flags : detritus.Constants.MessageFlags.EPHEMERAL
            });
            
        }
    }

    return new Guilds();

};