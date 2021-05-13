import Zenitsu from '../Utils/Classes/client.js';
import svg from 'node-svg2img';
import eris from 'eris-pluris';
import util from 'util';
const { promisify } = util;
import fs from 'fs/promises';
const { writeFile } = fs;
import path from 'path';
const { join } = path;
import common from '../Utils/Functions/commons.js';
const res = common(import.meta.url);
const __dirname: string = res.__dirname;
const activities: {
    [x: string]: eris.BotActivityType
} = {
    PLAYING: 0,
    STREAMING: 1,
    LISTENING: 2,
    WATCHING: 3,
    COMPETING: 5
}
const messages: {
    type: eris.BotActivityType;
    name: string
}[] =
    [{
        name: 'nezuko',
        type: activities['WATCHING']
    },
    {
        name: 'with tanjiro',
        type: activities['PLAYING']
    },
    {
        name: 'with Inosuke',
        type: activities['PLAYING']
    },
    {
        name: 'nezuko sing',
        type: activities['LISTENING']
    }];

async function event(client: Zenitsu): Promise<void> {

    const random = messages[Math.floor(Math.random() * messages.length)]

    client.editStatus('idle', random);

    const buffer = (await promisify(svg)(`https://top.gg/api/widget/721080193678311554.svg`, {})) as Buffer
    const path = join(__dirname, '..', '..', 'Images', 'topgg.png');
    writeFile(path, buffer)
        .catch((e) => {

            console.log(`[STATUS=${e.message || e?.toString() || e}] topgg.png 👎`)

        })
        .then(() => console.log(`[STATUS=NICE] topgg.png 👍`))

    console.log(`${client.user.username} está listo :):):):):):).`);

    setInterval(async () => {
        //Post stats to top.gg
        client.dbl.postStats(client.guilds.size);
    }, ((60 * 30) * 1000));//30m

}

export default event