import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import * as light from '@lil_marcrock22/eris-light';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import prefix from '../../models/prefix.js';


class Comando extends Command {

  constructor() {
    super();
    this.name = "setprefix"
    this.alias = []
    this.category = 'admin'
    this.memberPermissions = { guild: ['manageGuild'], channel: [] }
  }

  async run({ message, args, langjson }: command): Promise<light.Message> {

    const embedErr = new MessageEmbed()
      .setColor(this.client.color)
      .setDescription(langjson.commands.setprefix.no_prefix)
      .setTimestamp()

    if (!args[0])
      return message.channel.createMessage({ embed: embedErr })

    const embedE = new MessageEmbed()
      .setColor(this.client.color)
      .setDescription(langjson.commands.setprefix.prefix_length)
      .setTimestamp()

    if (args[0].length >= 4)
      return message.channel.createMessage({ embed: embedE })

    return prefix.findOneAndUpdate({ id: message.guildID }, { prefix: args[0] }, { new: true, upsert: true }).lean().then(async data => {

      await this.client.redis.set(message.guildID, JSON.stringify(data), 'prefix_')

      const embed = new MessageEmbed()
        .setColor(this.client.color)
        .setDescription(langjson.commands.setprefix.prefix_nice(message.author.username, data.prefix))
        .setTimestamp()
      return message.channel.createMessage({ embed: embed })

    }).catch(err => {

      const embed = new MessageEmbed()
        .setColor(this.client.color)
        .setDescription(langjson.commands.setprefix.prefix_error)
        .setTimestamp()
        .setFooter(err.message || err)

      return message.channel.createMessage({ embed: embed })

    })

  }

}

export default Comando;
