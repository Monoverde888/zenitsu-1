import detritus from 'detritus-client';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';

import { BaseSlash } from '../../utils/classes/slash.js';
import json from '../../utils/lang/langs.js';
import getGuild from '../../utils/functions/getguild.js';

export default function () {

    class Invite extends BaseSlash {
        constructor() {
            super();
            this.name = 'invite';
            this.description = 'Invite the bot';
            this.metadata = {
                usage(prefix: string) {
                    return [`${prefix}invite`];
                },
                category: 'bot',
            };
        }

        async run(ctx: detritus.Interaction.InteractionContext) {

            const langjson = ctx.guildId ? json[(await getGuild(ctx.guildId).then(x => x.lang))] : json.en;
            const link = 'https://discord.com/api/oauth2/authorize?client_id=721080193678311554&scope=bot+applications.commands&permissions=8';
            const invitacionLink = 'https://discord.gg/4Yzc7Hk';
            const embed = new MessageEmbed()
                .setThumbnail(ctx.client.user.avatarUrl)
                .setDescription(langjson.commands.invite.message(link, invitacionLink))
                .setColor(14720566)
                .setTimestamp();
            return ctx.respond(detritus.Constants.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                embed,
                flags: detritus.Constants.MessageFlags.EPHEMERAL
            });

        }
    }

    return new Invite();

}