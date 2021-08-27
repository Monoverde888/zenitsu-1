import BaseCommand from '../../utils/classes/command.js';
import parseArgs from '../../utils/functions/parseargs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';

import redis from '../../utils/managers/redis.js';
import json from '../../utils/lang/langs.js';
import getGuild from '../../utils/functions/getguild.js';
import guild from '../../database/models/guild.js';
import detritus from 'detritus-client';

const { Constants: { Permissions: Flags } } = detritus;

export default new BaseCommand({
    label: 'arg',
    metadata: {
        usage(prefix: string) {
            return [`${prefix}setprefix <newPrefix>`];
        },
        category: 'admin'
    },
    permissions: [Flags.MANAGE_GUILD],
    name: 'setprefix',
    onBeforeRun(__ctx, { arg }) {
        const args = parseArgs(arg);
        return args[0] && args[0].length <= 3;
    },
    async run(ctx, { arg }) {

        const langjson = json[(await getGuild(ctx.guildId).then(x => x.lang))];

        const args = parseArgs(arg);

        return guild.findOneAndUpdate({ id: ctx.guildId }, { prefix: args[0] }, {
            new: true,
            upsert: true
        }).lean().then(async data => {

            await redis.set(ctx.guildId, JSON.stringify(data));

            const embed = new MessageEmbed()
                .setColor(14720566)
                .setDescription(langjson.commands.setprefix.prefix_nice(ctx.message.author.username, data.prefix))
                .setTimestamp();
            return ctx.reply({ embed: embed });

        }).catch(err => {

            const embed = new MessageEmbed()
                .setColor(14720566)
                .setDescription(langjson.commands.setprefix.prefix_error)
                .setTimestamp()
                .setFooter(err.message || err);

            return ctx.reply({ embed: embed });

        });

    },
});
