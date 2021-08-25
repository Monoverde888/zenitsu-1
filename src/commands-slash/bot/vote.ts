import detritus from 'detritus-client';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../utils/const.js'
import { BaseSlash } from '../../utils/classes/slash.js';

export default function () {

    class Vote extends BaseSlash {
        constructor() {
            super();
            this.name = 'vote'
            this.description = 'Vote for Zenitsu.'
            this.metadata = {
                usage(prefix: string) {
                    return [`${prefix}vote`];
                },
                category: "bot",
            };
        }

        async run(ctx: detritus.Interaction.InteractionContext) {

            const embed = new MessageEmbed()
                .setThumbnail(ctx.client.user.avatarUrl)
                .setDescription(`https://top.gg/bot/721080193678311554`)
                .setColor(Color)
                .setFooter(ctx.user.username, ctx.user.avatarUrl)
                .setTimestamp();

            return ctx.respond(detritus.Constants.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                embed,
                flags: detritus.Constants.MessageFlags.EPHEMERAL
            });
        }
    }

    return new Vote();

}