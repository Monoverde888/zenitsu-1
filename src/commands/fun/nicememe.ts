import { loadImage, createCanvas } from 'canvas'
import run from '../../Utils/Interfaces/run';
import { MessageAttachment, Message } from 'discord.js-light';

import Command from '../../Utils/Classes/command';
export default class Comando extends Command {
    constructor() {
        super()
        this.name = "nicememe"
        this.alias = []
        this.category = 'fun'
        this.botPermissions.channel = ['ATTACH_FILES']
    }
    async run({ message, client, embedResponse, args }: run) {

        let atte = message.attachments.find(item => require('is-image')(item.proxyURL))?.proxyURL
        let img =
            atte || (require('is-image')(args[0] ? args[0] : 'ARGS IS UNDEFINED') ? args[0] : null)
            || client.users.cache.get(args[0])?.displayAvatarURL({ format: 'png' })
            || message.mentions.users.first()?.displayAvatarURL({ format: 'png' })
            || message.author.displayAvatarURL({ format: 'png' });

        let foto = await loadImage(img)
        const canvas = createCanvas(552, 513);
        let bck = client.imagenes.nicememe.background
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bck, 0, 0, 552, 513)
        ctx.drawImage(foto, 15, 10, 525, 350)
        return enviar(message, canvas.toBuffer(), 'img.png')

    }
}

function enviar(message: Message, buffer: Buffer, name: string): Promise<Message> {

    const att = new MessageAttachment(buffer, name)
    return message.channel.send({ files: [att] })

}