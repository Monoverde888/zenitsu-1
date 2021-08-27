import detritus from 'detritus-client';
import getguild from '../../utils/functions/getguild.js';
import model from '../../database/models/guild.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import redis from '../../utils/managers/redis.js';

async function messageUpdate(client: detritus.ShardClient, _interactionClient: detritus.InteractionCommandClient, { message: newMessage, old: oldMessage }: detritus.GatewayClientEvents.MessageUpdate) {

    if (!oldMessage || !newMessage) return;

    const guild = newMessage.guild;

    if (!guild
    || !oldMessage.content
    ) return;

    if (!newMessage.author
    || !newMessage.guildId
    || !newMessage.author.username
    || !newMessage.author.id
    || newMessage.author.bot
    || !newMessage.content
    || !newMessage.channel
    ) return;

    if (oldMessage.content == newMessage.content) return;

    const data = await getguild(newMessage.guildId),
        find = data.logs.find(item => item.TYPE == 'messageUpdate');

    if (!find) return;

    const embeds = [
        new MessageEmbed()
            .setColor(0x3498db)
            .setAuthor(newMessage.author.username, newMessage.author.avatarUrl, newMessage.jumpLink)
            .setDescription(oldMessage.content)
            .setFooter(`messageUpdate - #${newMessage.channel.name}`),

        new MessageEmbed()
            .setColor(0x2ecc71)
            .setAuthor(newMessage.author.username, newMessage.author.avatarUrl, newMessage.jumpLink)
            .setDescription(newMessage.content)
            .setFooter(`messageUpdate - #${newMessage.channel.name}`)
    ];


    new detritus.Structures.Webhook(client, { token: find.tokenWeb, id: find.idWeb })
        .execute({ embeds, wait: true })
        .catch(async (e) => {

            if (e.message.includes('Unknown Webhook')) {
                const dataa = await model.findOneAndUpdate({ id: newMessage.guildId }, {
                    $pull: {
                        logs: {
                            tokenWeb: find.tokenWeb,
                            idWeb: find.idWeb
                        }
                    }
                }, { new: true }).lean();
                await redis.set(newMessage.guildId, JSON.stringify(dataa));
                return undefined;
            }

        });


}

export default messageUpdate;
