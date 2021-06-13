import * as  light from '@lil_marcrock22/eris-light';
import model from '../models/logs.js'
import Zenitsu from '../Utils/Classes/client.js';
import MessageEmbed from '../Utils/Classes/Embed.js';
import logs, { Logs as LOGS } from '../models/logs.js';

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

    const pre_fetch = await client.redis.get(newMessage.guildID, 'logs_') || await logs.findOne({ id: newMessage.guildID }).lean() || await logs.create({ id: newMessage.guildID, logs: [] }),
        data: LOGS = typeof pre_fetch == 'string' ? JSON.parse(pre_fetch) : pre_fetch,
        find = data.logs.find(item => item.TYPE == 'messageUpdate')

    if (!find) return;

    const embeds = [
        new MessageEmbed()
            .setColor(0x3498db)
            .setAuthor(newMessage.author.username, newMessage.author.dynamicAvatarURL(), newMessage.jumpLink)
            .setDescription(oldMessage.content)
            .setFooter(`messageUpdate - #${(newMessage.channel as light.TextChannel).name}`),

        new MessageEmbed()
            .setColor(0x2ecc71)
            .setAuthor(newMessage.author.username, newMessage.author.dynamicAvatarURL(), newMessage.jumpLink)
            .setDescription(newMessage.content)
            .setFooter(`messageUpdate - #${(newMessage.channel as light.TextChannel).name}`)
    ]


    return client.executeWebhook(find.idWeb, find.tokenWeb, { embeds, wait: true })
        .catch(async (e) => {

            if (e.message.includes('Unknown')) {
                const dataa = await model.findOneAndUpdate({ id: data.id }, {
                    $pull: {
                        logs: {
                            tokenWeb: find.tokenWeb,
                            idWeb: find.idWeb
                        }
                    }
                }, { new: true })
                await client.redis.set(newMessage.guildID, JSON.stringify(dataa), 'logs_')
                return undefined;
            }

        });
}

export default event;