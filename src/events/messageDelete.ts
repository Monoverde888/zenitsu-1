import * as light from '@lil_marcrock22/eris-light';
import Zenitsu from '../Utils/Classes/client.js';
import model from '../models/logs.js'
import MessageEmbed from '../Utils/Classes/Embed.js';
import logs, { Logs as LOGS } from '../models/logs.js';

async function on(client: Zenitsu, message: light.Message): Promise<light.Message> {

    if (!message || !message.id) return;

    const check = client.buttons.listenersXD.find(item => item.messageID == message.id);

    if (check)
        client.buttons.stop(check, 'DELETED');

    if (!message.guild
        || !message.guild.id
        || !message.author
        || !message.author.username
        || !message.author.id
        || message.author.bot
        || !message.content
        || !message.channel
    ) return;

    const pre_fetch = await client.redis.get(message.guildID, 'logs_') || await logs.findOne({ id: message.guildID }).lean() || await logs.create({ id: message.guildID, logs: [] }),
        data: LOGS = typeof pre_fetch == 'string' ? JSON.parse(pre_fetch) : pre_fetch,
        find = data.logs.find(item => item.TYPE == 'messageDelete')

    if (!find) return;

    const embed = new MessageEmbed()
        .setColor(0xff0000)
        .setAuthor(message.author.username, message.author.dynamicAvatarURL(), message.jumpLink)
        .setDescription(message.content)
        .setFooter(`messageDelete - #${(message.channel as light.TextChannel).name}`)

    return client.executeWebhook(find.idWeb, find.tokenWeb, { embeds: [embed], wait: true })
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
                await client.redis.set(message.guildID, JSON.stringify(dataa), 'logs_')
                return undefined;
            }

        });
}

export default on;
