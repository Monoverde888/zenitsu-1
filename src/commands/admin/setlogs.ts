import BaseCommand             from '../../utils/classes/command.js';
import parseArgs               from '../../utils/functions/parseargs.js';
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import {Color}                 from '../../utils/const.js';

const regex = /((http|https):\/\/)((www|canary|ptb)\.)?(discordapp|discord)\.com\/api\/webhooks\/([0-9]){7,19}\/[-a-zA-Z0-9@:%._+~#=]{60,120}/gmi;
import redis                   from '../../utils/managers/redis.js';
import guild, {GUILD}          from '../../database/models/guild.js';
import json                    from '../../utils/lang/langs.js';
import getGuild                from '../../utils/functions/getguild.js';
import nodefetch               from 'node-fetch';
import unmarkdown              from '../../utils/functions/unmarkdown.js';
import detritus                from "detritus-client";

const {Constants : {Permissions : Flags}} = detritus;

export default new BaseCommand({
    label : 'arg',
    metadata : {
        usage(prefix : string) {
            return [`${prefix}setlogs webhookURL messageUpdate`, `${prefix}setlogs webhookURL messageDelete`]
        },
        category : 'admin'
    },
    permissions : [Flags.MANAGE_GUILD],
    name : 'setlogs',
    onBeforeRun(__ctx, {arg}) {
        const args = parseArgs(arg);
        return ['messageUpdate', 'messageDelete'].includes(args[1]);
    },
    async run(ctx, {arg}) {

        const args = parseArgs(arg);

        const langjson = json[(await getGuild(ctx.guildId).then(x => x.lang))];

        const invalidUse = new MessageEmbed()
            .setTimestamp()
            .setColor(Color)
            .setDescription(langjson.commands.setlogs.invalid)
            .setFooter(`${ctx.prefix}setlogs (WebhookURL) (messageUpdate|messageUpdate)`)
            .setImage(`https://i.imgur.com/2WZ1ctQ.gif`)
            .setThumbnail(`https://is.gd/G6VSKC`)

        const [url, type] = args;

        const events = ['messageDelete', 'messageUpdate'];

        if (!events.includes(type) || !url)
            return ctx.reply({embed : invalidUse})

        const match = url.match(regex);

        if (!match) return ctx.reply({embed : invalidUse});

        const [token, id] = match[0].split('/').reverse();

        const webhook = await nodefetch(`https://canary.discord.com/api/webhooks/${id.trim()}/${token.trim()}`).then((data) => data.json()).catch(() => undefined);

        if (!webhook || (webhook.guild_id != ctx.guildId)) return ctx.reply({embed : invalidUse});

        const fetch = await getGuild(ctx.guildId),
              check = (fetch.logs.find(item => (item.TYPE == type)))

        let data : GUILD;

        if (!check) {

            data = await guild.findOneAndUpdate({id : ctx.guildId},
                {
                    $addToSet : {
                        logs : {
                            TYPE : type,
                            tokenWeb : token,
                            idWeb : id
                        },
                    },
                }, {new : true}).lean();

        }

        else {

            await guild.findOneAndUpdate({id : ctx.guildId}, {
                $pull : {
                    logs : check
                }
            }, {new : true}).lean();

            data = await guild.findOneAndUpdate({id : ctx.guildId},
                {
                    $addToSet : {
                        logs : {
                            TYPE : type,
                            tokenWeb : token,
                            idWeb : id
                        },
                    },
                }, {new : true}).lean();

        }

        return redis.set(ctx.guildId, JSON.stringify(data))
                    .then(() => {

                        const embed = new MessageEmbed()
                            .setAuthor(webhook.name, webhook.avatar
                                ? `https://cdn.discordapp.com/avatars/${webhook.id}/${webhook.avatar}.png`
                                : `https://cdn.discordapp.com/embed/avatars/0.png`)
                            .setDescription(langjson.commands.setlogs.correct(unmarkdown(webhook.name), type))
                            .setColor(Color);

                        return ctx.reply({embed});

                    })
    },
});
