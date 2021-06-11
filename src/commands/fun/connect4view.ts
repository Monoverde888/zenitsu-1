import run from '../../Utils/Interfaces/run.js';
import canvas from 'canvas';
const { createCanvas } = canvas;
import buffer from '../../Utils/Functions/toBuffer.js';
import util from 'util';
const toBuffer = util.promisify(buffer);
import GIFEncoder from 'gifencoder';
import Command from '../../Utils/Classes/command.js';
interface potonum {
    [x: string]: number
}
import MODEL from '../../models/c4maps.js';
const fila: potonum = {
    "0": 20,
    "1": 120,
    "2": 220,
    "3": 320,
    "4": 420,
    "5": 520,
    "6": 620
}
import * as eris from '@lil_marcrock22/eris-light';
import MessageEmbed from '../../Utils/Classes/Embed.js';

function createImage(bck: canvas.Image, ArrayOfArrayOfNumbers: (number | canvas.Image)[][]) {

    const canvas = createCanvas(700, 600);
    const ctx = canvas.getContext('2d');
    const encoder = new GIFEncoder(700, 600);
    const stream = encoder.createReadStream();
    encoder.start();
    encoder.setRepeat(-1);
    encoder.setDelay(500);
    encoder.setQuality(10);
    ctx.drawImage(bck, 0, 0, 700, 600);

    for (const i of ArrayOfArrayOfNumbers) {
        
        const image = i[2];
        ctx.drawImage(image, fila[i[1] as number], canvas.width - fila[i[0] as number] - 160, 50, 50);
        encoder.addFrame(ctx);

    }

    encoder.finish();
    
    return toBuffer(stream);

}

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "connect4view";
        this.category = 'fun';
        this.alias = [`conecta4view`, 'fourinrowview', '4enlineaview', 'c4view']
        this.cooldown = 20;
    }

    async run({ args, message, client, langjson }: run): Promise<eris.Message> {

        const _id = args[0];
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setImage('https://i.imgur.com/qcek7Ll.gif')
            .setDescription(langjson.commands.connect4view.invalid);
        
        if (!_id) return message.channel.createMessage({ embed });

        const data = await MODEL.findById(_id).catch(() => {
            null;
        });

        if (!data) return message.channel.createMessage({ embed });

        const arr = [];

        for (const i of data.maps){

            const temp = [];

            temp[0] = i[0];
            temp[1] = i[1];
            temp[2] = i[2] == 'red' ? client.imagenes.connect4.verde : client.imagenes.connect4.amarillo

            arr.push(temp);

        }
        
        const file = await createImage(client.imagenes.connect4.background, arr);
        const files = [{ name: 'ggez.gif', file }];
        
        return message.channel.createMessage(undefined, files);

    }
}