import run from "../../Utils/Interfaces/run.js";
import light from 'discord.js-light';
const { MessageEmbed } = light;
import Command from '../../Utils/Classes/command.js';
import c4top from '../../models/c4top.js'

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "conecta4stats"
        this.alias = [`connect4stats`, 'fourinrowstats', '4enlineastats', 'c4stats']
        this.category = 'fun'
    }
    async run({ message, args, client, lang, langjson }: run) {

        let member = message.guild.members.cache.find(a => a.user.username === args.join(' ')) || message.guild.members.cache.find(a => a.user.tag === args.join(' ')) || message.guild.members.cache.find(a => a.displayName === args.join(' ')) || message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member

        let data = await c4top.find({ id: member.user.id });

        if (!data || !data.length)
            return client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.connect4stats[lang + '_no_data'].replace('{USER}', member.user.toString())
            });

        const easy = data.find(item => item.difficulty == 'easy'),
            medium = data.find(item => item.difficulty == 'medium'),
            hard = data.find(item => item.difficulty == 'hard')

        const json = langjson.commands.connect4stats,
            difi: string[] = json[lang + '_difficulties'],
            states: string[] = json[lang + '_states']

        let embed = new MessageEmbed()
            .setColor(client.color)
            .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 2048, dynamic: true }))
        if (easy) embed.addField(difi[0], `${states[0]}: ${easy.ganadas} ${states[1]}: ${easy.perdidas} ${states[2]}: ${easy.empates}`)
        if (medium) embed.addField(difi[1], `${states[0]}: ${medium.ganadas} ${states[1]}: ${medium.perdidas} ${states[2]}: ${medium.empates}`)
        if (hard) embed.addField(difi[2], `${states[0]}: ${hard.ganadas} ${states[1]}: ${hard.perdidas} ${states[2]}: ${hard.empates}`)

        return message.channel.send({ embed: embed });
    }
}