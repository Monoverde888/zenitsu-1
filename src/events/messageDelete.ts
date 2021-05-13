import light from 'eris-pluris';
import Zenitsu from '../Utils/Classes/client.js';
import model from '../models/logs.js'
import MessageEmbed from '../Utils/Classes/Embed.js';

async function event(client: Zenitsu, message: light.Message): Promise<light.Message> {

    if (!message) return;

    if (!message.guild
        || !message.guild.id
        || !message.author
        || !message.author.username
        || !message.author.id
        || message.author.bot
        || !message.content
        || !message.channel
    ) return;

    const data = await client.logs.cacheOrFetch(message.guild.id),
        find = data.logs.find(item => item.TYPE == 'messageDelete')

    if (!find) return;

    const embed = new MessageEmbed()
        .setColor(0xff0000)
        .setAuthor(message.author.username, message.author.dynamicAvatarURL(), message.jumpLink)
        .setDescription(message.content)
        .setFooter(`messageDelete - #${(message.channel as light.TextChannel).name}`)

    return client.executeWebhook(find.idWeb, find.tokenWeb, { embeds: [embed] })
        .catch(async (e) => {

            console.log(`[WEBHOOK-MESSAGE_DELETE]: `, e)

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