import detritus from 'detritus-client';

import { BaseSlash } from '../../utils/classes/slash.js';
import json from '../../utils/lang/langs.js';
import getGuild from '../../utils/functions/getguild.js';

export default function () {

    class Help extends BaseSlash {
        constructor() {
            super();
            this.name = 'help';
            this.description = 'List of commands';
            this.metadata = {
                usage(prefix: string) {
                    return [`${prefix}help`];
                },
                category: 'bot',
            };
        }

        async run(ctx: detritus.Interaction.InteractionContext) {

            const langjson = ctx.guildId ? json[(await getGuild(ctx.guildId).then(x => x.lang))] : json.en;
            const { categories } = langjson.commands.help;

            const embedHelp = new detritus.Utils.Embed()
                .setColor(14720566)
                .setTimestamp()
                .addField(categories[0], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'util').map(a => `\`${a.name}\``).join(', ') || 'weird')
                .addField(categories[1], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'fun').map(a => `\`${a.name}\``).join(', ') || 'weird')
                .addField(categories[2], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'mod').map(a => `\`${a.name}\``).join(', ') || 'weird')
                .addField(categories[3], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'bot').map(a => `\`${a.name}\``).join(', ') || 'weird')
                .addField(categories[4], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'admin').map(a => `\`${a.name}\``).join(', ') || 'weird');

            const BUTTONS = [
                new detritus.Utils.ComponentButton()
                    .setLabel(langjson.commands.help.support)
                    .setUrl('https://discord.gg/4Yzc7Hk')
                    .setEmoji({ name: '🤖', id: undefined }),
                new detritus.Utils.ComponentButton()
                    .setLabel(langjson.commands.help.invite)
                    .setUrl('https://discord.com/api/oauth2/authorize?client_id=721080193678311554&scope=bot+applications.commands&permissions=8')
                    .setEmoji({ name: '🤖', id: undefined }),
                new detritus.Utils.ComponentButton()
                    .setLabel('GitHub')
                    .setUrl('https://github.com/marcrock22/zenitsu')
                    .setEmoji({ name: '🐙', id: undefined }),
                new detritus.Utils.ComponentButton()
                    .setUrl('https://zenitsu.eastus.cloudapp.azure.com/runcode')
                    .setLabel('Run code')
                    .setEmoji({ name: '💻', id: undefined }),
            ];

            return ctx.respond(detritus.Constants.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE, {
                embed: embedHelp,
                components: [new detritus.Utils.ComponentActionRow({ components: BUTTONS })],
                flags: detritus.Constants.MessageFlags.EPHEMERAL
            });

        }
    }

    return new Help();

}