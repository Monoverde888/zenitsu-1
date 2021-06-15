import dotenv from 'dotenv';
dotenv.config();
import Zenitsu from "./Utils/Classes/client.js";
import * as eris from '@lil_marcrock22/eris-light';

const client = new Zenitsu(process.env.DISCORD_TOKEN, {
    cacheMembers: false,
    cacheUsers: false,
    cacheEmojis: false,
    allowedMentions: {
        everyone: false,
        roles: [],
        users: [],
        repliedUser: true
    },
    defaultImageFormat: 'png',
    defaultImageSize: 2048,
    intents: 513,
    maxShards: 'auto',
    messageLimit: 30,
    disableEvents: {
        READY: false,
        RESUMED: false,
        APPLICATION_COMMAND_CREATE: true,
        APPLICATION_COMMAND_DELETE: true,
        APPLICATION_COMMAND_UPDATE: true,
        GUILD_CREATE: false,
        GUILD_DELETE: false,
        GUILD_UPDATE: false,
        INVITE_CREATE: true,
        INVITE_DELETE: true,
        GUILD_MEMBER_ADD: true,
        GUILD_MEMBER_REMOVE: true,
        GUILD_MEMBER_UPDATE: true,
        GUILD_MEMBERS_CHUNK: true,
        GUILD_INTEGRATIONS_UPDATE: true,
        GUILD_ROLE_CREATE: false,
        GUILD_ROLE_DELETE: false,
        GUILD_ROLE_UPDATE: false,
        GUILD_BAN_ADD: true,
        GUILD_BAN_REMOVE: true,
        GUILD_EMOJIS_UPDATE: true,
        CHANNEL_CREATE: false,
        CHANNEL_DELETE: false,
        CHANNEL_UPDATE: false,
        CHANNEL_PINS_UPDATE: true,
        MESSAGE_CREATE: false,
        MESSAGE_DELETE: false,
        MESSAGE_UPDATE: false,
        MESSAGE_DELETE_BULK: true,
        MESSAGE_REACTION_ADD: true,
        MESSAGE_REACTION_REMOVE: true,
        MESSAGE_REACTION_REMOVE_ALL: true,
        MESSAGE_REACTION_REMOVE_EMOJI: true,
        USER_UPDATE: true,
        PRESENCE_UPDATE: true,
        TYPING_START: true,
        VOICE_STATE_UPDATE: true,
        VOICE_SERVER_UPDATE: true,
        WEBHOOKS_UPDATE: true,
        INTERACTION_CREATE: false
    }
});

client.connect();
process.on("unhandledRejection", (e: Error) => {
    console.log(e);
    new eris.Client(null)
        .executeWebhook(process.env.WEBHOOKID, process.env.WEBHOOKTOKEN, {
            wait: true,
            embeds: [{ description: '```js\n' + (e.stack || e.message || `${e}`).slice(0, 1900) + '```' }]
        });
});

/*
import * as sharder from '@lil_marcrock22/eris-sharder';
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
