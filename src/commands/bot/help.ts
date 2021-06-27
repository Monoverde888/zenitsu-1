import BaseCommand from '../../Utils/Classes/Command.js';
import json from '../../Utils/Lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import URLButton from '../../Utils/Buttons/URL.js';
import Button from '../../Utils/Buttons/Normal.js';
import Components from '../../Utils/Buttons/Component.js';
import getGuild from '../../Utils/Functions/getGuild.js';
import { Color } from '../../Utils/Const.js'

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [`${prefix}help`]
    },
    category: 'bot'
  },
  name: 'help',
  aliases: ['h'],
  async run(ctx) {

    const langjson = json[(await getGuild(ctx.guildId)).lang]
    const categories: string[] = langjson.commands.help.categories;

    const embedHelp = new MessageEmbed()
      .setColor(Color)
      .setTimestamp()
      .addField(categories[0], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'util').map(a => `\`${a.name}\``).join(', ') || 'weird')
      .addField(categories[1], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'fun').map(a => `\`${a.name}\``).join(', ') || 'weird')
      .addField(categories[2], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'mod').map(a => `\`${a.name}\``).join(', ') || 'weird')
      .addField(categories[3], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'bot').map(a => `\`${a.name}\``).join(', ') || 'weird')
      .addField(categories[4], ctx.client.commandClient.commands.filter(a => a.metadata.category === 'admin').map(a => `\`${a.name}\``).join(', ') || 'weird');

    const BUTTONS =
      [
        new URLButton()
          .setLabel(langjson.commands.help.support)
          .setURL('https://discord.gg/4Yzc7Hk'),
        new URLButton()
          .setLabel(langjson.commands.help.invite)
          .setURL('https://discord.com/oauth2/authorize?client_id=721080193678311554&scope=bot&permissions=8'),
        new URLButton()
          .setLabel('GitHub')
          .setURL('https://github.com/marcrock22/zenitsu')
          .setEmoji({ name: '🐙', id: undefined })
      ];

    const componente = new Components(...BUTTONS)

    return ctx.reply({
      embed: embedHelp, components: [componente]
    })

  },
});
