import * as  light from '@lil_marcrock22/eris-light';
import model from '../models/logs.js'
import Zenitsu from '../Utils/Classes/client.js';
import MessageEmbed from '../Utils/Classes/Embed.js';
import fetch from 'node-fetch';

async function event(client: Zenitsu, newMessage: light.Message, oldMessage: light.Message): Promise<light.Message> {
    if (!oldMessage || !newMessage) return;
    const guild = newMessage.guild;
    if (!guild
        || !guild.id
        || !oldMessage.content
    ) return;

    if (!newMessage.author
        || !newMessage.author.username
        || !newMessage.author.id
        || newMessage.author.bot
        || !newMessage.content
        || !newMessage.channel
    ) return;

    if (oldMessage.content == newMessage.content) return;

    const data = await client.logs.cacheOrFetch(newMessage.guild.id),
        find = data.logs.find(item => item.TYPE == 'messageUpdate')

    if (!find) return;

    const file = await fetch(newMessage.author.dynamicAvatarURL(undefined, 64)).then(RESPONSE => RESPONSE.buffer());

    const embeds = [
        new MessageEmbed()
            .setColor(0x3498db)
            .setAuthor(newMessage.author.username, 'attachment://avatar.png', newMessage.jumpLink)
            .setDescription(oldMessage.content)
            .setFooter(`messageUpdate - #${(newMessage.channel as light.TextChannel).name}`),

        new MessageEmbed()
            .setColor(0x2ecc71)
            .setAuthor(newMessage.author.username, 'attachment://avatar.png', newMessage.jumpLink)
            .setDescription(newMessage.content)
            .setFooter(`messageUpdate - #${(newMessage.channel as light.TextChannel).name}`)
    ]


    return client.executeWebhook(find.idWeb, find.tokenWeb, { embeds, wait: true, file: [{ name: 'avatar.png', file }] })
        .catch(async (e) => {

            console.log(`[WEBHOOK-MESSAGE_UPDATE]: `, e)

            const dataa = await model.findOneAndUpdate({ id: data.id }, {
                $pull: {
                    logs: {

                        tokenWeb: find.tokenWeb,
                        idWeb: find.idWeb
                    }
                }
            }, { new: true })

            client.logs.cache.set(data.id, dataa)

            return undefined;

        });

}

export default event;