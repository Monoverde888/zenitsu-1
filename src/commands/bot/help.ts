import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import light from 'eris-pluris';
import MessageEmbed from '../../Utils/Classes/Embed.js';

class Comando extends Command {

    constructor() {
        super()
        this.name = "help"
        this.alias = ['h']
        this.category = 'bot'
        this.botPermissions.channel = ['attachFiles'];

    }
    run({ client, message, langjson }: commandinterface): Promise<light.Message> {

        const categories: string[] = langjson.commands.help.categories;

        const embedHelp = new MessageEmbed()
            .setColor(client.color)
            .setTimestamp()
            .addField(categories[0], client.commands.filter(a => a.category === 'utils').map(a => `\`${a.name}\``).join(', '))
            .addField(categories[1], client.commands.filter(a => a.category === 'fun').map(a => `\`${a.name}\``).join(', '))
            .addField(categories[2], client.commands.filter(a => a.category === 'mod').map(a => `\`${a.name}\``).join(', '))
            .addField(categories[3], client.commands.filter(a => a.category === 'bot').map(a => `\`${a.name}\``).join(', '))
            .addField(categories[4], client.commands.filter(a => a.category === 'admin').map(a => `\`${a.name}\``).join(', '))
            .setImage(`attachment://topgg.png`);

        return message.channel.createMessage({ embed: embedHelp }, [{ file: client.fileTOPGG, name: 'topgg.png' }]);
    }
}

export default Comando;