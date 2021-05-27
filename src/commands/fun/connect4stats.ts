import run from "../../Utils/Interfaces/run.js";
import light from '@lil_marcrock22/eris-light-pluris';
import Command from '../../Utils/Classes/command.js';
import c4top from '../../models/c4top.js'
import MessageEmbed from "../../Utils/Classes/Embed.js";

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "conecta4stats"
        this.alias = [`conecta4stats`, 'fourinrowstats', '4enlineastats', 'c4stats']
        this.category = 'fun'
    }
    async run({ message, client, langjson }: run): Promise<light.Message> {

        const member = message.mentions[0] || message.author

        const data = await c4top.find({ id: member.id });

        if (!data || !data.length) {
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4stats.no_data(member.mention))
                .setColor(client.color)
            return message.channel.createMessage({ embed });
        }

        const easy = data.find(item => item.difficulty == 'easy'),
            medium = data.find(item => item.difficulty == 'medium'),
            hard = data.find(item => item.difficulty == 'hard')

        const json = langjson.commands.connect4stats,
            difi: string[] = json.difficulties,
            states: string[] = json.states

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor(member.username, member.dynamicAvatarURL())
        if (easy) embed.addField(difi[0], `${states[0]}: ${easy.ganadas} ${states[1]}: ${easy.perdidas} ${states[2]}: ${easy.empates}`)
        if (medium) embed.addField(difi[1], `${states[0]}: ${medium.ganadas} ${states[1]}: ${medium.perdidas} ${states[2]}: ${medium.empates}`)
        if (hard) embed.addField(difi[2], `${states[0]}: ${hard.ganadas} ${states[1]}: ${hard.perdidas} ${states[2]}: ${hard.empates}`)

        return message.channel.createMessage({ embed: embed });
    }
}