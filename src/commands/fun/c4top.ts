import run from "../../Utils/Interfaces/run.js";
import Command from '../../Utils/Classes/command.js';
import c4top from '../../models/c4top.js'
import light from 'discord.js-light';

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "conecta4top"
        this.alias = [`connect4top`, 'fourinrowtop', '4enlineatop', 'c4top']
        this.category = 'fun'
    }

    async run({ args, client, message, langjson }: run): Promise<light.Message> {


        const difficulty = ['easy', 'medium', 'hard'].includes(args[0]?.toLowerCase()) ? args[0]?.toLowerCase() : 'medium'

        const data = await c4top.find({ difficulty }).sort({ ganadas: -1 }).limit(10);

        if (!data.length)
            return client.sendEmbed({
                description: langjson.commands.connect4top.no_data(difficulty),
                channel: message.channel
            });

        const states: string[] = langjson.commands.connect4top.states

        const description = data.map(item => {

            return `${item.id == message.author.id ? `➡️ ` : ''}${item.cacheName}\n${states[0]}: ${item.ganadas} ${states[1]}: ${item.perdidas} ${states[2]}: ${item.empates}`

        }).join('\n\n')

        return client.sendEmbed({
            description,
            channel: message.channel,
            footerText: difficulty
        });

    }
}