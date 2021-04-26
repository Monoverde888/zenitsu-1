import Client from './Utils/Classes/client.js'
import dotenv from 'dotenv';
const { config } = dotenv
config();
import light from 'discord.js-light'
const { WebhookClient, MessageEmbed } = light
import mongoose from 'mongoose'
const { set, connect } = mongoose;

new Client({
    partials: ['MESSAGE', 'REACTION'],
    http: { version: 7 },
    messageCacheMaxSize: 10,
    messageSweepInterval: 3600,
    messageCacheLifetime: 1800,
    messageEditHistoryMaxSize: 1,
    allowedMentions: {
        parse: [

        ]
    },
    ws: {
        intents: 1701
    },
    cacheGuilds: true,
    cacheOverwrites: true,
    cacheRoles: true,
    cacheEmojis: false,
    cachePresences: false,
    cacheChannels: true,
    disabledEvents: [
        'RESUMED',
        'INVITE_CREATE',
        'INVITE_DELETE',
        'GUILD_MEMBER_ADD',
        'GUILD_MEMBER_REMOVE',
        'GUILD_MEMBER_UPDATE',
        'GUILD_MEMBERS_CHUNK',
        'GUILD_INTEGRATIONS_UPDATE',
        'GUILD_BAN_ADD',
        'GUILD_BAN_REMOVE',
        'GUILD_EMOJIS_UPDATE',
        'CHANNEL_PINS_UPDATE',
        'MESSAGE_DELETE_BULK',
        'MESSAGE_REACTION_REMOVE',
        'MESSAGE_REACTION_REMOVE_ALL',
        'MESSAGE_REACTION_REMOVE_EMOJI',
        'USER_UPDATE',
        'PRESENCE_UPDATE',
        'TYPING_START',
        'WEBHOOKS_UPDATE',
    ]
});

set('useFindAndModify', false);

connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("[MongoDB]: Conectado.");
}).catch((err) => {
    console.log(`[MongoDB-Error]: ${err.message || err}`);
});

process.on("unhandledRejection", (e: { stack: string, message: string } | string) => {
    console.log(e)
    new WebhookClient(process.env.WEBHOOKID, process.env.WEBHOOKTOKEN).send(
        new MessageEmbed()
            .setAuthor(typeof e == 'string' ? e : (e.message || e.toString()))
            .setColor('GREEN')
            .setTitle('Error')
            .setDescription(`\`\`\`${typeof e == 'string' ? e : (e.stack || e.toString().slice(0, 200))}\`\`\``.slice(0, 2048))
            .setTimestamp()
    ).catch(() => { })
});