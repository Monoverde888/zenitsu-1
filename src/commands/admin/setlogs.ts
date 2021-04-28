import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import light from 'discord.js-light'
const regex = /((http|https):\/\/)((www|canary|ptb)\.)?(discordapp|discord)\.com\/api\/webhooks\/([0-9]){7,19}\/[-a-zA-Z0-9@:%._\+~#=]{60,120}/gmi

class Comando extends Command {

    constructor() {
        super();
        this.cooldown = 0;
        this.name = "setlogs"
        this.alias = []
        this.category = 'admin'
        this.botPermissions = { guild: [], channel: ['EMBED_LINKS'] }
        this.memberPermissions = { guild: ['MANAGE_GUILD'], channel: [] }
    };

    async run({ client, message, args, langjson }: commandinterface) {

        const invalidUse = new light.MessageEmbed()
            .setTimestamp()
            .setColor(client.color)
            .setDescription(langjson.commands.setlogs.invalid)
            .setFooter(`${client.prefix.cache.get(message.guild.id)?.prefix || 'z!'}setlogs (WebhookURL) (messageUpdate|messageDelete)`)
            .setImage(`https://i.imgur.com/2WZ1ctQ.gif`)
            .setThumbnail(`https://i.imgur.com/7DdnGh5.png`)

        const [url, type] = args;

        const events = ['messageDelete', 'messageUpdate'];

        if (!events.includes(type) || !url)
            return message.channel.send({ embed: invalidUse })

        const match = url.match(url);

        if (!match) return message.channel.send({ embed: invalidUse });

        const [token, id] = match[0].split('/').reverse();

        const webhook: light.Webhook = await client.fetchWebhook(id, token).catch(() => undefined);

        if (!webhook || (webhook?.guildID != message.guild.id)) return message.channel.send({ embed: invalidUse });

        return client.logs.update({
            id: message.guild.id,
            webhook: {
                id,
                token
            },
            TYPE: type
        }).then(() => {

            const embed = new light.MessageEmbed()
                .setAuthor(webhook.name, webhook.avatar
                    ? `https://cdn.discordapp.com/avatars/${webhook.id}/${webhook.avatar}.png`
                    : `https://cdn.discordapp.com/embed/avatars/0.png`)
                .setDescription(langjson.commands.setlogs.correct(client.unMarkdown(webhook.name), type))

            return message.reply({ embed });

        })
    }
}

export default Comando;