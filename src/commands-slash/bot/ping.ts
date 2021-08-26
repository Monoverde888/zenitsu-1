import detritus from 'detritus-client';
import mongoose from 'mongoose';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../utils/const.js'
import { BaseSlash } from '../../utils/classes/slash.js';
import ButtonCollector from '../../utils/collectors/buttoncollector.js';
import Button from '../../utils/buttons/normal.js';
import Components from '../../utils/buttons/component.js';

export default function () {

    class Ping extends BaseSlash {
        constructor() {
            super();
            this.name = 'ping'
            this.description = 'Bot latency';
            this.metadata = {
                usage(prefix: string) {
                    return [`${prefix}ping`];
                },
                category: "bot",
            };
        }

        async run(ctx: detritus.Interaction.InteractionContext) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const date = Date.now();
            const Promise_res = ctx.client.ping();
            const Promise_ping_db: Promise<number> = new Promise((r, j) => {
                mongoose.connection.db.admin().ping((err, result) => (err || !result) ? j(err || result) : r(Date.now() - date))
            });
            const [res, ping_db] = await Promise.all([Promise_res, Promise_ping_db])
            const embed = new MessageEmbed()

                .setDescription(`
        🏓 Gateway: ${res.gateway}ms [${getStatus(res.gateway)}]\n🏃 Message: ${date - Number(ctx.interaction.createdAt)}ms [${getStatus(date - Number(ctx.interaction.createdAt))}]\n🗃️ DB: ${ping_db}ms [${getStatus(ping_db)}]
        `)
                .setTimestamp()
                .setColor(Color);
            await ctx.editOrRespond({
                embed, components: [new Components(new Button('primary').setCustomID('xd').setLabel('???'))]
            });

            const message = await ctx.fetchResponse();

            const col = new ButtonCollector(message, {
                filter(interaction) {
                    return interaction.user.id == ctx.userId;
                },
                max: 1
            }, ctx.client)

            col.on('collect', (interaction) => {
                return interaction.respond({ data: { content: 'shh', flags: detritus.Constants.MessageFlags.EPHEMERAL }, type: detritus.Constants.InteractionCallbackTypes.CHANNEL_MESSAGE_WITH_SOURCE })
            })

            return message;

        }
    }

    return new Ping();

}

function getStatus(number: number) {

    let color = '';
    if (number >= 400) color = `⚫`
    else if (number >= 300) color = `🔴`
    else if (number >= 200) color = `🟠`
    else if (number >= 100) color = `🟡`
    else color = `🟢`;
    return `\\${color}`;

}