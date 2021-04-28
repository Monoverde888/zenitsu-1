import light from 'discord.js-light';
const { MessageEmbed } = light;
import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'

class Comando extends Command {

    constructor() {
        super();
        this.name = "reportbug"
        this.category = 'bot'
        this.cooldown = 120
    };

    async run({ client, message, embedResponse, args, langjson, lang }: commandinterface) {
        if (!args[0]) return embedResponse(langjson.commands.reportbug.need)
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(`[📢] | ${args.join(' ')}`)
            .setTimestamp()
            .setAuthor(`${message.author.tag}(${message.author.id})`)
            .setFooter('Enviado desde ' + message.guild.name, message.guild.iconURL({ dynamic: true, size: 2048 }))
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
        return (client.channels.cache.get('725053091522805787') as light.TextChannel).send({ embed: embed }).then(() => {
            return embedResponse(langjson.commands.reportbug.send);
        })

    }

}

export default Comando;