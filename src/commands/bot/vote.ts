import { MessageEmbed } from 'discord.js-light'
import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'
import { join } from 'path'
import { promisify } from 'util'

class Comando extends Command {

    constructor() {
        super();
        this.name = "vote"
        this.category = 'bot'
        this.alias = ['topgg']
    };

    async run({ client, message }: commandinterface) {

        let embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setDescription(`https://top.gg/bot/721080193678311554`)
            .attachFiles([client.rutaImagen('topgg.png')])
            .setImage(`attachment://topgg.png`)
            .setColor(client.color)
            .setFooter(message.author.tag, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
            .setTimestamp()
        return message.channel.send({ embed: embed })
    }

}

export default Comando;