import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import * as  light from '@lil_marcrock22/eris-light';
import MessageEmbed from '../../Utils/Classes/Embed.js';

class Comando extends Command {

    constructor() {
        super();
        this.name = "guilds"
        this.category = 'bot'
    }

    async run({ message, langjson }: command): Promise<light.Message> {

        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setDescription(langjson.commands.guilds.message(this.client.guilds.size))
            .setTimestamp()
            .setAuthor(`${this.client.shards.size} shards`)
            .setFooter(`Shard #${message.guild.shard.id}`)

        return message.channel.createMessage({ embed })

    }

}

export default Comando;
