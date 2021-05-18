import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import eris from 'eris-pluris';
import MessageEmbed from '../../Utils/Classes/Embed.js';
const regex = /((http|https):\/\/)((www|canary|ptb)\.)?(discordapp|discord)\.com\/api\/webhooks\/([0-9]){7,19}\/[-a-zA-Z0-9@:%._+~#=]{60,120}/gmi
import axios from 'axios';

class Comando extends Command {

    constructor() {
        super();
        this.name = "setlogs"
        this.alias = []
        this.category = 'admin'
        this.botPermissions = { guild: [], channel: ['attachFiles'] }
        this.memberPermissions = { guild: ['manageGuild'], channel: [] }
    }

    async run({ client, message, args, langjson }: commandinterface): Promise<eris.Message> {

        const invalidUse = new MessageEmbed()
            .setTimestamp()
            .setColor(client.color)
            .setDescription(langjson.commands.setlogs.invalid)
            .setFooter(`${client.prefix.cache.get(message.guild.id)?.prefix || 'z!'}setlogs (WebhookURL) (messageUpdate|messageDelete)`)
            .setImage(`https://i.imgur.com/2WZ1ctQ.gif`)
            .setThumbnail(`https://i.imgur.com/7DdnGh5.png`)

        const [url, type] = args;

        const events = ['messageDelete', 'messageUpdate'];

        if (!events.includes(type) || !url)
            return message.channel.createMessage({ embed: invalidUse })

        const match = url.match(regex);

        if (!match) return message.channel.createMessage({ embed: invalidUse });

        const [token, id] = match[0].split('/').reverse();

        const webhook: eris.Webhook = await axios.get(`https://canary.discord.com/api/webhooks/${id.trim()}/${token.trim()}`).then(({ data }) => data).catch(() => undefined);

        if (!webhook || (webhook?.guild_id != message.guild.id)) return message.channel.createMessage({ embed: invalidUse });

        return client.logs.update({
            id: message.guild.id,
            webhook: {
                id,
                token
            },
            TYPE: type
        }).then(() => {

            const embed = new MessageEmbed()
                .setAuthor(webhook.name, webhook.avatar
                    ? `https://cdn.discordapp.com/avatars/${webhook.id}/${webhook.avatar}.png`
                    : `https://cdn.discordapp.com/embed/avatars/0.png`)
                .setDescription(langjson.commands.setlogs.correct(client.unMarkdown(webhook.name), type))
                .setColor(client.color);

            return message.channel.createMessage({ embed });

        })
    }
}

export default Comando;