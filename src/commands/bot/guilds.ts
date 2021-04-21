import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'
import { MessageEmbed } from 'discord.js-light';

class Comando extends Command {

    constructor() {
        super();
        this.name = "guilds"
        this.category = 'bot'
        this.botPermissions = { guild: [], channel: ['EMBED_LINKS'] }
        this.memberPermissions = { guild: [], channel: [] }
    };

    async run({ client, message, langjson, lang }: commandinterface) {

        let embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.guilds[lang].replace('{GUILDS}', '**' + client.guilds.cache.size.toString() + '**'))
            .setTimestamp()
            .setFooter(`Shard #${message.guild.shardID}`)

        return message.channel.send({ embed })

    }

}

export default Comando;