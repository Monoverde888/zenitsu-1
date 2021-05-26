import Command from '../../Utils/Classes/command.js'
import run from '../../Utils/Interfaces/run.js';
import eris from '@lil_macrock22/eris-light-pluris';
import MessageEmbed from '../../Utils/Classes/Embed.js'
export default class Comando extends Command {
    constructor() {
        super()
        this.name = "afk"
        this.category = 'utils'
    }
    async run({ client, message, args, langjson }: run): Promise<eris.Message> {

        if (args.join(' ').length >= 250)
            return message.channel.createMessage({
                embed: new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(langjson.commands.afk.reason)
                    .setTimestamp()
            })

        await client.afk.set(message.author.id, args.join(' '), Date.now());

        return message.channel.createMessage({
            embed: new MessageEmbed()
                .setColor(client.color)
                .setAuthor(`🛌 | AFK.`)
                .setDescription(args.join(' '))
                .setTimestamp()
                .setFooter(message.author.username, message.author.dynamicAvatarURL())
        })
    }
}