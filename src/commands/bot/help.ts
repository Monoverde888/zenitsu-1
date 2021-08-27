import BaseCommand from '../../utils/classes/command.js';
import json from '../../utils/lang/langs.js';
import detritus from 'detritus-client';
import getGuild from '../../utils/functions/getguild.js';


export default new BaseCommand({
    metadata: {
        usage(prefix: string) {
            return [`${prefix}help`];
        },
        category: 'bot'
    },
    name: 'help',
    aliases: ['h'],
    async run(ctx) {
        const { lang } = await getGuild(ctx.guildId);
        const langjson = json[lang];
        const categories = langjson.commands.help.categories;

        const embedHelp = new detritus.Utils.Embed()
            .setColor(14720566)
            .setTimestamp()
            .setTitle(json[lang].messages.use_slash)
            .setUrl('https://discord.com/api/oauth2/authorize?client_id=721080193678311554&scope=bot+applications.commands&permissions=8')
            .addField(categories[0], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'util').map(a => `\`${a.name}\``).join(', ') || 'on slash commands.')
            .addField(categories[1], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'fun').map(a => `\`${a.name}\``).join(', ') || 'on slash commands.')
            .addField(categories[2], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'mod').map(a => `\`${a.name}\``).join(', ') || 'on slash commands.')
            .addField(categories[3], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'bot').map(a => `\`${a.name}\``).join(', ') || 'on slash commands.')
            .addField(categories[4], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'admin').map(a => `\`${a.name}\``).join(', ') || 'on slash commands.');

        const BUTTONS =
            [
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
                    .setLabel('Run code')
                    .setUrl('https://zenitsu.eastus.cloudapp.azure.com/runcode')
                    .setEmoji({ name: '💻', id: undefined }),
            ];

        const componente = new detritus.Utils.ComponentActionRow();
        for (const i of BUTTONS)
            componente.addButton(i);

        return ctx.reply({
            embed: embedHelp, components: [componente]
        });

    },
});
