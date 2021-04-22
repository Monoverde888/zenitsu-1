import Cliente from "../../Utils/Classes/client";
import { Message } from 'discord.js-light'

async function event(client: Cliente, message: Message): Promise<void> {


    if (!message) return;
    if (!message.author) return;
    if (message.author.bot) return;
    if (message.channel.type === 'dm') return;
    if (message.content) {
        client.snipes.set(message.channel.id, {
            mensaje: message.content,
            avatarURL: message.author.displayAvatarURL({
                dynamic: true,
                format: 'png'
            }),
            nombre: message.author.tag
        })
    }

}


export default event;