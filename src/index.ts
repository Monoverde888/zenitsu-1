import dotenv from 'dotenv';
dotenv.config();
import Zenitsu from "./Utils/Classes/client.js";

new Zenitsu(process.env.DISCORD_TOKEN, {
    allowedMentions: {
        everyone: false,
        roles: [],
        users: [],
        repliedUser: true
    },
    defaultImageFormat: 'png',
    defaultImageSize: 2048,
    intents: 1701,
    maxShards: 'auto'
}).connect();
/*
import * as sharder from '@lil_marcrock22/eris-sharder';
import eris from 'eris-pluris';
const { Base } = sharder;
class Sharder extends Base {

    constructor(client: { bot: eris.Client; clusterID: number; ipc: unknown }) {
        super(client);
    }
    async launch(): Promise<boolean> {
        console.log(`Shards cargadas 👍`)
        return true;
    }

}

export default Sharder;
*/