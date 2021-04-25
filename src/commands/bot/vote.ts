import light from 'discord.js-light';
const { MessageEmbed } = light;
import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js';

class Comando extends Command {

    constructor() {
        super();
        this.name = "vote"
        this.category = 'bot'
        this.alias = ['topgg']
        this.botPermissions.channel = ['ATTACH_FILES']
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