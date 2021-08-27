import mongoose from 'mongoose';

function getPrivate() {
    return [
        process.env.DISCORD_TOKEN,
        process.env.DBLTOKEN,
        process.env.MONGODB,
        process.env.PASSWORD,
        process.env.PASSWORDDBL,
        process.env.WEBHOOKID,
        process.env.WEBHOOKTOKEN,
        process.env.SHARD_ID,
        process.env.SHARD_TOKEN,
        mongoose.connection.pass,
        mongoose.connection.user,
        mongoose.connection.host,
        process.env.APIKEY,
        process.env.RUNCODEKEY,
        process.env.DISPLAYCONNECT4,
        process.env.APICONNECTFOUR,
        process.env.APIPROFILE
    ].filter(item => item);
}

export default getPrivate;