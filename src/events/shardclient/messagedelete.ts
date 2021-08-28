import detritus from 'detritus-client';
import getguild from '../../utils/functions/getguild.js';
import model from '../../database/models/guild.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import redis from '../../utils/managers/redis.js';

async function messageDelete(client: detritus.ShardClient, _interactionClient: detritus.InteractionCommandClient, DATA: detritus.GatewayClientEvents.MessageDelete) {

    const { message } = DATA;
    if (!message || !message.id) return;

    if (!message.guild
        || !message.guild.id
        || !message.author
        || !message.author.username
        || !message.author.id
        || message.author.bot
        || !message.content
        || !message.channel
    ) return;

    const data = await getguild(message.guildId),
        find = data.logs.find(item => item.TYPE == 'messageDelete');

    if (!find) return;

    const embed = new MessageEmbed()
        .setColor(0xff0000)
        .setAuthor(message.author.username, message.author.avatarUrl, message.jumpLink)
        .setDescription(message.content)
        .setFooter(`messageDelete - #${message.channel.name}`);

    new detritus.Structures.Webhook(client, { token: find.tokenWeb, id: find.idWeb })
        .execute({ embeds: [embed], wait: true })
        .catch(async (e) => {

            if (e.message.includes('Unknown Webhook')) {
                const dataa = await model.findOneAndUpdate({ id: message.guildId }, {
                    $pull: {
                        logs: {
                            tokenWeb: find.tokenWeb,
                            idWeb: find.idWeb
                        }
                    }
                }, { new: true }).lean();
                await redis.set(message.guildId, JSON.stringify(dataa));
                return undefined;
            }

        });

}

export default messageDelete;
