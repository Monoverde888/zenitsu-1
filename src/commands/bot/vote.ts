import * as light from '@lil_marcrock22/eris-light';
import Command from '../../Utils/Classes/command.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import command from '../../Utils/Interfaces/run.js';

class Comando extends Command {

  constructor() {
    super();
    this.name = "vote"
    this.category = 'bot'
    this.alias = ['topgg'];
  }

  async run({ message }: command): Promise<light.Message> {

    const embed = new MessageEmbed()
      .setThumbnail(this.client.user.dynamicAvatarURL())
      .setDescription(`https://top.gg/bot/721080193678311554`)
      .setColor(this.client.color)
      .setFooter(message.author.username, message.author.dynamicAvatarURL())
      .setTimestamp();

    if (message.guild.me.permissions.has('attachFiles'))
      embed.setImage(`attachment://topgg.png`);

    return message.channel.createMessage({ embed: embed }, message.guild.me.permissions.has('attachFiles') ? [{ file: this.client.fileTOPGG, name: 'topgg.png' }] : undefined)

  }
}

export default Comando;
