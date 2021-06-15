import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import * as  eris from '@lil_marcrock22/eris-light';
import MessageEmbed from '../../Utils/Classes/Embed.js';

class Comando extends Command {

    constructor() {
        super();
        this.name = "invite"
        this.category = 'bot'
        this.botPermissions = { guild: [], channel: ['embedLinks'] }
        this.memberPermissions = { guild: [], channel: [] }
    }

    async run({ message, langjson }: command): Promise<eris.Message> {

        const link = 'https://discord.com/oauth2/authorize?client_id=721080193678311554&scope=bot&permissions=8';
        const invitacionLink = 'https://discord.gg/4Yzc7Hk';
        const embed = new MessageEmbed()
            .setThumbnail(this.client.user.dynamicAvatarURL())
            .setDescription(langjson.commands.invite.message(link, invitacionLink))
            .setColor(this.client.color)
            .setTimestamp()
        return message.channel.createMessage({ embed: embed })

    }
}

export default Comando;
