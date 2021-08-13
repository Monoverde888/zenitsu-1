import detritus                from 'detritus-client';
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import {Color}                 from '../../utils/const.js'
import {BaseSlash}             from '../../utils/classes/slash.js';
import json                    from '../../utils/lang/langs.js';
import getGuild                from '../../utils/functions/getguild.js';
import URLButton               from "../../utils/buttons/url.js";
import Components              from "../../utils/buttons/component.js";

export default function () {

    class Help extends BaseSlash {
        constructor() {
            super();
            this.name = 'help'
            this.description = '.'
            this.metadata = {
                usage(prefix : string) {
                    return [`${prefix}help`];
                },
                category : "bot",
            };
        }

        async run(ctx : detritus.Interaction.InteractionContext) {

            const {lang} = await getGuild(ctx.guildId);
            const langjson = json[lang]
            const categories = langjson.commands.help.categories;

            const embedHelp = new MessageEmbed()
                .setColor(Color)
                .setTimestamp()
                .addField(categories[0], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'util').map(a => `\`${a.name}\``).join(', ') || 'weird')
                .addField(categories[1], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'fun').map(a => `\`${a.name}\``).join(', ') || 'weird')
                .addField(categories[2], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'mod').map(a => `\`${a.name}\``).join(', ') || 'weird')
                .addField(categories[3], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'bot').map(a => `\`${a.name}\``).join(', ') || 'weird')
                .addField(categories[4], ctx.client.interactionCommandClient.commands.filter(a => a.metadata.category === 'admin').map(a => `\`${a.name}\``).join(', ') || 'weird');

            const BUTTONS =
                      [
                          new URLButton()
                              .setLabel(langjson.commands.help.support)
                              .setURL('https://discord.gg/4Yzc7Hk'),
                          new URLButton()
                              .setLabel(langjson.commands.help.invite)
                              .setURL('https://discord.com/api/oauth2/authorize?client_id=721080193678311554&scope=bot+applications.commands&permissions=8'),
                          new URLButton()
                              .setLabel('GitHub')
                              .setURL('https://github.com/marcrock22/zenitsu')
                              .setEmoji({name : '🐙', id : undefined})
                      ];

            const componente = new Components(...BUTTONS)

            return ctx.editOrRespond({
                embed : embedHelp, components : [componente]
            });

        }
    }

    return new Help();

};