import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import * as  eris from '@lil_marcrock22/eris-light';
import MessageEmbed from '../../Utils/Classes/Embed.js';
const regex = /((http|https):\/\/)((www|canary|ptb)\.)?(discordapp|discord)\.com\/api\/webhooks\/([0-9]){7,19}\/[-a-zA-Z0-9@:%._+~#=]{60,120}/gmi
import nodefetch from 'node-fetch';
import logs from '../../models/logs.js';
import { Logs as LOGS } from '../../models/logs.js'
    
class Comando extends Command {

    constructor() {
        super();
        this.name = "setlogs"
        this.alias = []
        this.category = 'admin'
        this.botPermissions = { guild: [], channel: ['attachFiles'] }
        this.memberPermissions = { guild: ['manageGuild'], channel: [] }
    }

    async run({ client, message, args, langjson, prefix }: command): Promise<eris.Message> {

        const invalidUse = new MessageEmbed()
            .setTimestamp()
            .setColor(client.color)
            .setDescription(langjson.commands.setlogs.invalid)
            .setFooter(`${prefix}setlogs (WebhookURL) (messageUpdate|messageDelete)`)
            .setImage(`https://i.imgur.com/2WZ1ctQ.gif`)
            .setThumbnail(`https://i.imgur.com/7DdnGh5.png`)

        const [url, type] = args;

        const events = ['messageDelete', 'messageUpdate'];

        if (!events.includes(type) || !url)
            return message.channel.createMessage({ embed: invalidUse })

        const match = url.match(regex);

        if (!match) return message.channel.createMessage({ embed: invalidUse });

        const [token, id] = match[0].split('/').reverse();

        const webhook: eris.Webhook = await nodefetch(`https://canary.discord.com/api/webhooks/${id.trim()}/${token.trim()}`).then((data) => data.json()).catch(() => undefined);

        if (!webhook || (webhook?.guild_id != message.guild.id)) return message.channel.createMessage({ embed: invalidUse });

        const pre_fetch = await client.redis.get(message.guildID, 'logs_') || await logs.findOne({ id: message.guildID }).lean() || await logs.create({ id: message.guildID, logs: [] }),
            fetch: LOGS = typeof pre_fetch == 'string' ? JSON.parse(pre_fetch) : pre_fetch,
            check = (fetch.logs.find(item => (item.TYPE == type)))

        let data: LOGS;
        
        if (!check) {

            data = await logs.findOneAndUpdate({ id: message.guildID },
                {
                    $addToSet: {
                        logs: {
                            TYPE: type,
                            tokenWeb: token,
                            idWeb: id
                        },
                    },
                }, { new: true }).lean();
            
        }

        else {
            
            await logs.findOneAndUpdate({ id: message.guildID }, {
                $pull: {
                    logs: check
                }
            }, { new: true }).lean()

            data = await logs.findOneAndUpdate({ id: message.guildID },
                {
                    $addToSet: {
                        logs: {
                            TYPE: type,
                            tokenWeb: token,
                            idWeb: id
                        },
                    },
                }, { new: true }).lean();

        }

        return client.redis.set(message.guildID, JSON.stringify(data), 'logs_')
            .then(() => {

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