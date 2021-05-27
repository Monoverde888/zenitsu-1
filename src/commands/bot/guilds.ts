import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import light from '@lil_marcrock22/eris-light-pluris';
import MessageEmbed from '../../Utils/Classes/Embed.js';

class Comando extends Command {

    constructor() {
        super();
        this.name = "guilds"
        this.category = 'bot'
    }

    async run({ client, message, langjson }: command): Promise<light.Message> {

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.guilds.message(client.guilds.size))
            .setTimestamp()
            .setAuthor(`${client.shards.size} shards`)
            .setFooter(`Shard #${message.guild.shard.id}`)

        return message.channel.createMessage({ embed })

    }

}

export default Comando;