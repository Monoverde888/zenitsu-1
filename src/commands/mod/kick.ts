import run from "../../Utils/Interfaces/run.js";
import Command from '../../Utils/Classes/command.js';
import * as light from '@lil_marcrock22/eris-light';
import canMod from "../../Utils/Functions/canMod.js";
import MessageEmbed from "../../Utils/Classes/Embed.js";
import getHighest from '../../Utils/Functions/getHighest.js';

export default class Comando extends Command {
  constructor() {
    super()
    this.name = "kick"
    this.category = 'mod';
    this.botPermissions.guild = ['kickMembers'];
    this.cooldown = 6;
    this.memberPermissions.guild = ['kickMembers'];
  }

  async run({ args, message, langjson, embedResponse }: run): Promise<light.Message> {

    const user = message.mentions.filter(user => user.id != message.author.id)[0];
    const member = user ? user.member : null;
    if (!member) return embedResponse(langjson.commands.kick.mention, message.channel, this.client.color);
    if (!canMod(member, this.client, 'kick')) return embedResponse(langjson.commands.kick.cannt_kick(`**${this.client.unMarkdown(user.username)}**`), message.channel, this.client.color)
    if (message.author.id !== message.guild.ownerID) {
      if (getHighest(message.member).position <= getHighest(member).position) return embedResponse(langjson.commands.kick.user_cannt_kick(`**${this.client.unMarkdown(user.username)}**`), message.channel, this.client.color)
    }

    const reason = (args.join(' ') || '').replace(member.mention, '').slice(0, 500) || null;

    return member.kick(reason).then(() => {

      const embed = new MessageEmbed()
        .setColor(0x2ecc71)
        .setDescription(langjson.commands.kick.kick(`**${this.client.unMarkdown(user.username)}**`, reason))
        .setFooter(message.author.username, message.author.dynamicAvatarURL())

      return message.channel.createMessage({ embed })

    }).catch((error) => {

      const embed = new MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`Error: ${error ? (error.message || error) : error}`)
        .setFooter(message.author.username, message.author.dynamicAvatarURL())

      return message.channel.createMessage({ embed })

    })
  }
}
