import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import * as  light from '@lil_marcrock22/eris-light';
import MessageEmbed from '../../Utils/Classes/Embed.js';

class Comando extends Command {

    constructor() {
        super();
        this.name = "setprefix"
        this.alias = []
        this.category = 'admin'
        this.memberPermissions = { guild: ['manageGuild'], channel: [] }
    }

    run({ client, message, args, langjson }: command): Promise<light.Message> {

        const embedErr = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.setprefix.no_prefix)
            .setTimestamp()

        if (!args[0])
            return message.channel.createMessage({ embed: embedErr })

        const embedE = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.setprefix.prefix_length)
            .setTimestamp()

        if (args[0].length >= 4)
            return message.channel.createMessage({ embed: embedE })

        return client.prefix.set(message.guild.id, args[0]).then(data => {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.setprefix.prefix_nice(message.author.username, data.prefix))
                .setTimestamp()
            return message.channel.createMessage({ embed: embed })

        }).catch(err => {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.setprefix.prefix_error)
                .setTimestamp()
                .setFooter(err.message || err)

            return message.channel.createMessage({ embed: embed })

        })

    }

}

export default Comando;