import Zenitsu from '../Utils/Classes/client.js';
import * as eris from '@lil_marcrock22/eris-light';
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

async function once(client: Zenitsu): Promise<void> {
    const random = messages[Math.floor(Math.random() * messages.length)];
    client.editStatus('idle', random);
    console.log(`${client.user.username} está listo :):):):):):).`);
    setInterval(async () => {
        //Post stats to top.gg
        client.postStats(true);
    }, ((60 * 30) * 1000));//30m
}

export default once;
