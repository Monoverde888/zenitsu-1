import Command from '../../Utils/Classes/command'
import run from '../../Utils/Interfaces/run';
import { MessageEmbed } from 'discord.js-light'
export default class Comando extends Command {
    constructor() {
        super()
        this.name = "afk"
        this.category = 'utiles'
    }
    async run({ client, message, args, lang, langjson }: run) {

        if (args.join(' ').length >= 250)
            return message.channel.send({
                embed: new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(langjson.commands.afk[lang + '_reason'])
                    .setTimestamp()
            })

        await client.afk.set(message.author.id, args.join(' '), Date.now());

        return message.channel.send({
            embed: new MessageEmbed()
                .setColor(client.color)
                .setAuthor(`🛌 | AFK.`)
                .setDescription(args.join(' '))
                .setTimestamp()
                .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
        }).catch(() => { });
    }
};