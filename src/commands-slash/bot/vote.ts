import detritus                from 'detritus-client';
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import {Color}                 from '../../utils/const.js'
import {BaseSlash}             from '../../utils/classes/slash.js';

export default function () {

    class Vote extends BaseSlash {
        constructor() {
            super();
            this.name = 'vote'
            this.description = '.'
            this.metadata = {
                usage(prefix : string) {
                    return [`${prefix}vote`];
                },
                category : "bot",
            };
        }

        async run(ctx : detritus.Slash.SlashContext) {

            const embed = new MessageEmbed()
                .setThumbnail(ctx.client.user.avatarUrl)
                .setDescription(`https://top.gg/bot/721080193678311554`)
                .setColor(Color)
                .setFooter(ctx.user.username, ctx.user.avatarUrl)
                .setTimestamp();

            return ctx.editOrRespond({embed : embed})
        }
    }

    return new Vote();

};