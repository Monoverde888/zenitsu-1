import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import light from 'discord.js-light';
const { MessageEmbed } = light;

class Comando extends Command {

    constructor() {
        super();
        this.name = "setprefix"
        this.alias = []
        this.category = 'admin'
        this.botPermissions = { guild: [], channel: ['EMBED_LINKS'] }
        this.memberPermissions = { guild: ['MANAGE_GUILD'], channel: [] }
    }

    run({ client, message, args, langjson }: commandinterface): Promise<light.Message> {

        const embedErr = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.setprefix.no_prefix)
            .setTimestamp()

        if (!args[0])
            return message.channel.send({ embed: embedErr })

        const embedE = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.setprefix.prefix_length)
            .setTimestamp()

        if (args[0].length >= 4)
            return message.channel.send({ embed: embedE })

        return client.prefix.set(message.guild.id, args[0]).then(data => {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.setprefix.prefix_nice(message.author.tag, data.prefix))
                .setTimestamp()
            return message.channel.send({ embed: embed })

        }).catch(err => {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.setprefix.prefix_error)
                .setTimestamp()
                .setFooter(err.message || err)

            return message.channel.send({ embed: embed })

        })

    }

}

export default Comando;