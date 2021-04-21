import { DMChannel, NewsChannel } from "discord.js";
import { Collection, CollectorFilter, Message, Snowflake, TextChannel } from "discord.js-light";

function awaitMessage(obj: { filter: CollectorFilter, channel: TextChannel | DMChannel | NewsChannel, max: number, time: number }): Promise<Collection<Snowflake, Message>> {
    const { filter, channel, max, time } = obj;
    if (!channel || !channel.awaitMessages) throw new Error('Canal invalido')
    return new Promise((resolve, reject) => {
        channel.awaitMessages(filter, { max: max ? max : 1, time: time ? time : require('ms')('60s'), errors: ['time'] })
            .then(collected => resolve(collected))
            .catch((c) => c.size ? resolve(c) : reject('TIME'))
    });
}

export default awaitMessage