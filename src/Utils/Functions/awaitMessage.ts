/*import light from 'discord.js-light';

function awaitMessage(obj: { filter: light.CollectorFilter<[light.Message]>, channel: light.TextChannel | light.DMChannel | light.NewsChannel, max: number, time: number }): Promise<light.Collection<light.Snowflake, light.Message>> {
    const { filter, channel, max, time } = obj;
    if (!channel || !channel.awaitMessages) throw new Error('Canal invalido')
    return new Promise((resolve, reject) => {
        channel.awaitMessages(filter, { max: max ? max : 1, time: time ? time : 1000 * 60, errors: ['time'] })
            .then(collected => resolve(collected))
            .catch((c) => c.size ? resolve(c) : reject('TIME'))
    });
}

export default awaitMessage;*/