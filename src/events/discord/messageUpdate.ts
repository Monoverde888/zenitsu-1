import light from 'discord.js-light';
import model from '../../models/logs.js'
import Zenitsu from '../../Utils/Classes/client.js';

async function event(client: Zenitsu, oldMessage: light.Message, newMessage: light.Message): Promise<any> {

    if (!oldMessage || !newMessage) return;

    if (!oldMessage.guild
        || !oldMessage.guild.id
        || !oldMessage.author
        || !oldMessage.author.tag
        || !oldMessage.author.id
        || oldMessage.author.bot
        || !oldMessage.content
        || !oldMessage.channel
    ) return;

    if (!newMessage.guild
        || !newMessage.guild.id
        || !newMessage.author
        || !newMessage.author.tag
        || !newMessage.author.id
        || newMessage.author.bot
        || !newMessage.content
        || !newMessage.channel
    ) return;

    if (oldMessage.content == newMessage.content) return;

    const data = await client.logs.cacheOrFetch(newMessage.guild.id),
        find = data.logs.find(item => item.TYPE == 'messageUpdate')

    if (!find) return;

    const embeds = [
        new light.MessageEmbed()
            .setColor('BLUE')
            .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({
                size: 2048,
                format: 'png',
                dynamic: true
            }))
            .setDescription(oldMessage.content)
            .setFooter(`#${(oldMessage.channel as light.TextChannel).name}`)
        ,
        new light.MessageEmbed()
            .setColor('GREEN')
            .setAuthor(newMessage.author.tag, newMessage.author.displayAvatarURL({
                size: 2048,
                format: 'png',
                dynamic: true
            }))
            .setDescription(newMessage.content)
            .setFooter(`#${(newMessage.channel as light.TextChannel).name}`)
    ]


    const wh = new light.WebhookClient(find.idWeb, find.tokenWeb);

    wh.send({ embeds })
        .catch(async () => {

            const dataa = await model.findOneAndUpdate({ id: data.id }, {
                $pull: {
                    logs: {

                        tokenWeb: find.tokenWeb,
                        idWeb: find.idWeb
                    }
                }
            }, { new: true })

            client.logs.cache.set(data.id, dataa)

        });

}

export default event;