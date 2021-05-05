import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import light from 'discord.js-light';
const { MessageEmbed } = light;

class Comando extends Command {

    constructor() {
        super();
        this.name = "invite"
        this.category = 'bot'
        this.botPermissions = { guild: [], channel: ['EMBED_LINKS'] }
        this.memberPermissions = { guild: [], channel: [] }
    }

    async run({ client, message, langjson }: commandinterface): Promise<light.Message> {

        const link = 'https://discordapp.com/oauth2/authorize?client_id=721080193678311554&scope=bot&permissions=2146958847';
        const invitacionLink = 'https://discord.gg/hbSahh8';
        const embed = new MessageEmbed()
            .setThumbnail(client.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setDescription(langjson.commands.invite.message(link, invitacionLink))
            .setColor(client.color)
            .setTimestamp()
        return message.channel.send({ embed: embed })

    }
}

export default Comando;