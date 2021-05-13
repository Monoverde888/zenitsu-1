import light from 'eris-pluris';
import Command from '../../Utils/Classes/command.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import commandinterface from '../../Utils/Interfaces/run.js';

class Comando extends Command {

    constructor() {
        super();
        this.name = "vote"
        this.category = 'bot'
        this.alias = ['topgg']
        this.botPermissions.channel = ['attachFiles']
    }

    async run({ client, message }: commandinterface): Promise<light.Message> {

        const embed = new MessageEmbed()
            .setThumbnail(client.user.dynamicAvatarURL())
            .setDescription(`https://top.gg/bot/721080193678311554`)
            .attachFiles([client.rutaImagen('topgg.png')])
            .setImage(`attachment://topgg.png`)
            .setColor(client.color)
            .setFooter(message.author.username, message.author.dynamicAvatarURL())
            .setTimestamp()
        return message.channel.createMessage({ embed: embed })
    }

}

export default Comando;