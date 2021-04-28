import light from 'discord.js-light';
import Zenitsu from '../../Utils/Classes/client.js';
import model from '../../models/logs.js'

async function event(client: Zenitsu, message: light.Message): Promise<any> {

    if (!message) return;

    if (!message.guild
        || !message.guild.id
        || !message.author
        || !message.author.tag
        || !message.author.id
        || message.author.bot
        || !message.content
        || !message.channel
    ) return;

    const data = await client.logs.cacheOrFetch(message.guild.id),
        find = data.logs.find(item => item.TYPE == 'messageDelete')

    if (!find) return;

    const embed = new light.MessageEmbed()
        .setColor('RED')
        .setAuthor(message.author.tag, message.author.displayAvatarURL({
            size: 2048,
            format: 'png',
            dynamic: true
        }))
        .setDescription(message.content)
        .setFooter(`#${(message.channel as light.TextChannel).name}`)

    const wh = new light.WebhookClient(find.idWeb, find.tokenWeb);

    wh.send(embed)
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