import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import light from 'discord.js-light';
const { MessageEmbed } = light;
class Comando extends Command {

    constructor() {
        super();
        this.name = "guilds"
        this.category = 'bot'
        this.botPermissions = { guild: [], channel: ['EMBED_LINKS'] }
        this.memberPermissions = { guild: [], channel: [] }
    }

    async run({ client, message, langjson }: commandinterface): Promise<light.Message> {

        const embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.guilds.message(client.guilds.cache.size))
            .setTimestamp()
            .setFooter(`Shard #${message.guild.shardID}`)

        return message.channel.send({ embed })

    }

}

export default Comando;