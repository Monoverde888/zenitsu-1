import light from 'discord.js-light'
const { MessageEmbed } = light;
import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'

class Comando extends Command {

    constructor() {
        super();
        this.name = "suggest"
        this.category = 'bot'
        this.cooldown = 120
    };

    async run({ client, message, embedResponse, args, langjson, lang }: commandinterface) {
        if (!args[0]) return embedResponse(langjson.commands.suggest.need)
        let embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(`[<:reason2:804368699887845376>] | ${args.join(' ')}`)
            .setTimestamp()
            .setAuthor(`${message.author.tag}(${message.author.id})`)
            .setFooter('Enviado desde ' + message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
        return (client.channels.cache.get('727948582556270682') as light.TextChannel).send({ embed: embed }).then(() => {
            return embedResponse(langjson.commands.suggest.send);
        })

    }

}

export default Comando;