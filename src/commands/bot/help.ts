import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import * as light from '@lil_marcrock22/eris-light';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import URLButton from '../../Utils/Buttons/URL.js';
import Components from '../../Utils/Buttons/Component.js';

class Comando extends Command {

  constructor() {
    super()
    this.name = "help"
    this.alias = ['h']
    this.category = 'bot'

  }
  run({ message, langjson }: command): Promise<light.Message> {

    const categories: string[] = langjson.commands.help.categories;

    const embedHelp = new MessageEmbed()
      .setColor(this.client.color)
      .setTimestamp()
      .addField(categories[0], this.client.commands.filter(a => a.category === 'utils').map(a => `\`${a.name}\``).join(', '))
      .addField(categories[1], this.client.commands.filter(a => a.category === 'fun').map(a => `\`${a.name}\``).join(', '))
      .addField(categories[2], this.client.commands.filter(a => a.category === 'mod').map(a => `\`${a.name}\``).join(', '))
      .addField(categories[3], this.client.commands.filter(a => a.category === 'bot').map(a => `\`${a.name}\``).join(', '))
      .addField(categories[4], this.client.commands.filter(a => a.category === 'admin').map(a => `\`${a.name}\``).join(', '));

    if (message.guild.me.permissions.has('attachFiles'))
      embedHelp.setImage(`attachment://topgg.png`);

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

    return message.channel.createMessage({
      embed: embedHelp, components: [componente]
    }, message.guild.me.permissions.has('attachFiles') ? [{ file: this.client.fileTOPGG, name: 'topgg.png' }] : undefined);

  }
}

export default Comando;
