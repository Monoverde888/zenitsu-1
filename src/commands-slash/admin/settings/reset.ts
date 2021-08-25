import { Embed as MessageEmbed } from "detritus-client/lib/utils/embed.js";
import detritus from "detritus-client";
import { BaseCommandOption } from "../../../utils/classes/slash.js";
import json from "../../../utils/lang/langs.js";
import guild from "../../../database/models/guild.js";
import redis from "../../../utils/managers/redis.js";

const { Constants: { ApplicationCommandOptionTypes } } = detritus;
const { Constants: { Permissions: Flags } } = detritus;

export function reset() {

    class Reset extends BaseCommandOption {
        constructor() {
            super({
                options: [{
                    name: 'field',
                    description: 'Configuration to restart',
                    choices: ['ignorechannels', 'muterole', 'all'].map(x => {
                        return { name: x, value: x }
                    }),
                    required: true,
                    type: ApplicationCommandOptionTypes.STRING
                }]
            });
            this.name = "reset";
            this.disableDm = true;
            this.description = "Restart configuration";
            this.metadata = {
                usage(prefix: string) {
                    return [
                        prefix + "settings reset ignorechannels",
                        prefix + "settings reset onlythreads",
                        prefix + "settings reset muterole",
                        prefix + "settings reset all"
                    ];
                },
                category: "admin",
            };
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
            this.permissionsClient = [];
        }

        async run(
            ctx: detritus.Interaction.InteractionContext,
            args: { field: 'ignorechannels' | 'onlythreads' | 'muterole' | 'all' }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            switch (args.field) {
                case 'all': {
                    const data = await guild.findOneAndUpdate({ id: ctx.guildId }, {
                        muterole: '1',
                        ignorechannels: [],
                        onlythreads: true
                    }, { new: true }).lean();
                    await redis.set(ctx.guildId, JSON.stringify(data));
                    const langjson = json[data.lang];

                    const embed = new MessageEmbed()
                        .setColor(0xff0000)
                        .setDescription(langjson.commands.settings.reset.message)
                        .setTimestamp();
                    return ctx.editOrRespond({ embed });
                }
                    break;
                default: {
                    const data = await guild.findOne({ id: ctx.guildId });
                    switch (args.field) {
                        case 'muterole':
                            data['muterole'] = '1';
                            break;
                        case 'ignorechannels':
                            data['ignorechannels'] = [];
                            break;
                    }
                    await data.save();
                    await redis.set(ctx.guildId, JSON.stringify(data));
                    const langjson = json[data.lang];

                    const embed = new MessageEmbed()
                        .setColor(0xff0000)
                        .setDescription(langjson.commands.settings.reset.message)
                        .setTimestamp()
                        .setFooter(args.field);

                    return ctx.editOrRespond({ embed });
                }
                    break;
            }
        }
    }

    return new Reset();
}
