import run from "../../Utils/Interfaces/run.js";
import Command from '../../Utils/Classes/command.js';
import c4top from '../../models/c4top.js'
import * as  light from '@lil_marcrock22/eris-light';
import MessageEmbed from "../../Utils/Classes/Embed.js";

export default class Comando extends Command {
  constructor() {
    super()
    this.name = "connect4top"
    this.alias = [`conecta4top`, 'fourinrowtop', '4enlineatop', 'c4top']
    this.category = 'fun'
  }

  async run({ args, message, langjson }: run): Promise<light.Message> {

    const difficulty = ['easy', 'medium', 'hard'].includes(args[0] ? args[0].toLowerCase() : '') ? args[0].toLowerCase() : 'medium'

    const data = await c4top.find({ difficulty }).sort({ ganadas: -1 }).limit(10);

    const embed = new MessageEmbed()
      .setDescription(langjson.commands.connect4top.no_data(difficulty))
      .setColor(this.client.color)

    if (!data.length)
      return message.channel.createMessage({ embed })

    const states: string[] = langjson.commands.connect4top.states

    const description = data.map(item => {

      return `${item.id == message.author.id ? `➡️ ` : ''}${item.cacheName}\n${states[0]}: ${item.ganadas} ${states[1]}: ${item.perdidas} ${states[2]}: ${item.empates}`

    }).join('\n\n')

    const embed2 = new MessageEmbed()
      .setFooter(difficulty)
      .setDescription(description)
      .setColor(this.client.color);

    return message.channel.createMessage({ embed: embed2 })

  }
}
