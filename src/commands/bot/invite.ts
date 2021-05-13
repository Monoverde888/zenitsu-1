import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import eris from 'eris-pluris';
import MessageEmbed from '../../Utils/Classes/Embed.js';

class Comando extends Command {

    constructor() {
        super();
        this.name = "invite"
        this.category = 'bot'
        this.botPermissions = { guild: [], channel: ['embedLinks'] }
        this.memberPermissions = { guild: [], channel: [] }
    }

    async run({ client, message, langjson }: commandinterface): Promise<eris.Message> {

        const link = 'https://discordapp.com/oauth2/authorize?client_id=721080193678311554&scope=bot&permissions=2146958847';
        const invitacionLink = 'https://discord.gg/hbSahh8';
        const embed = new MessageEmbed()
            .setThumbnail(client.user.dynamicAvatarURL())
            .setDescription(langjson.commands.invite.message(link, invitacionLink))
            .setColor(client.color)
            .setTimestamp()
        return message.channel.createMessage({ embed: embed })

    }
}

export default Comando;