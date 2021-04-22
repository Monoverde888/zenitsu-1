import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'
import { MessageEmbed } from 'discord.js-light';

class Comando extends Command {

    constructor() {
        super()
        this.name = "help"
        this.alias = ['h']
        this.category = 'bot'

    }
    run({ client, message, langjson, lang }: commandinterface) {

        const categories: string[] = langjson.commands.help[lang + '_categories']

        let embedHelp = new MessageEmbed()
            .setColor(client.color)
            .setTimestamp()
            //.addField(categories[0], client.commands.filter(a => a.category === 'utiles').map(a => `\`${a.name}\``).join(', '))
            .addField(categories[1], client.commands.filter(a => a.category === 'fun').map(a => `\`${a.name}\``).join(', '))
            //.addField(categories[2], client.commands.filter(a => a.category === 'mod').map(a => `\`${a.name}\``).join(', '))
            .addField(categories[3], client.commands.filter(a => a.category === 'bot').map(a => `\`${a.name}\``).join(', '))
            .addField(categories[4], client.commands.filter(a => a.category === 'admin').map(a => `\`${a.name}\``).join(', '))
            .attachFiles([client.rutaImagen('topgg.png')])
            .setImage(`attachment://topgg.png`)

        return message.channel.send({ embed: embedHelp });
    }
}

export default Comando;