import Command from '../../Utils/Classes/command.js'
import run from '../../Utils/Interfaces/run.js';
export default class Comando extends Command {
    constructor() {
        super()
        this.name = "avatar"
        this.category = 'utils'
    }
    run({ message }: run) {

        const user = message.mentions.users.first() || message.author,
            avatar = user.displayAvatarURL({
                dynamic: true,
                size: 2048,
                format: 'png'
            });

        return message.channel.send(`> ${avatar}`)

    }
};