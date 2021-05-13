import * as Sharder from '@lil_marcrock22/eris-sharder';
import dotenv from 'dotenv';
import Zenitsu from './Utils/Classes/client.js';
dotenv.config();
const token = process.env.SHARD_TOKEN;
const id = process.env.SHARD_ID;

new Sharder.Master(process.env.DISCORD_TOKEN, `./dist/index.js`, {
    name: 'zenitsu',
    clientOptions: {
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
    },
    webhooks: {
        cluster: { id, token },
        shard: { id, token }
    },
    debug: false
}, Zenitsu);