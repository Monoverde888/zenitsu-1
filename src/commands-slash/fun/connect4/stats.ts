import detritus from "detritus-client";
import { BaseCommandOption } from "../../../utils/classes/slash.js";
import jsonOBJECT from "../../../utils/lang/langs.js";
import getGuild from "../../../utils/functions/getguild.js";
import getUser from "../../../utils/functions/getuser.js";
import { Embed as MessageEmbed } from "detritus-client/lib/utils/embed.js";

const { Constants: { ApplicationCommandOptionTypes } } = detritus;

export function stats() {
    class Stats extends BaseCommandOption {
        constructor() {
            super({
                options: [
                    {
                        name: "user",
                        type: ApplicationCommandOptionTypes.USER,
                        required: false,
                        description: "User",
                    },
                ],
            });
            this.name = "stats";
            this.description = "Statistics";
            this.metadata = {
                usage(prefix: string) {
                    return [`${prefix}connect4 stats User`];
                },
                category: "fun",
            };
        }

        async run(
            ctx: detritus.Interaction.InteractionContext,
            args: { user: detritus.Structures.MemberOrUser }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const langjson = ctx.guildId ? jsonOBJECT[(await getGuild(ctx.guildId)).lang] : jsonOBJECT.en;
            const user = (args.user ? args.user.bot ? ctx.user : args.user : ctx.user) || ctx.user;
            const data = await getUser(user.id)
            const easy = data.c4easy,
                medium = data.c4medium,
                hard = data.c4hard

            if (!easy && !medium && !hard) {
                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4stats.no_data(user.mention))
                    .setColor(0xff0000)
                return ctx.editOrRespond({ embed });
            }

            const json = langjson.commands.connect4stats,
                difi = json.difficulties,
                states = json.states

            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .setAuthor(user.username, user.avatarUrl)

            if (easy) embed.addField(difi[0], `${states[0]}: ${easy.ganadas || 0} ${states[1]}: ${easy.perdidas || 0} ${states[2]}: ${easy.empates || 0}`)
            if (medium) embed.addField(difi[1], `${states[0]}: ${medium.ganadas || 0} ${states[1]}: ${medium.perdidas || 0} ${states[2]}: ${medium.empates || 0}`)
            if (hard) embed.addField(difi[2], `${states[0]}: ${hard.ganadas || 0} ${states[1]}: ${hard.perdidas || 0} ${states[2]}: ${hard.empates || 0}`)

            return ctx.editOrRespond({ embed: embed });

        }
    }

    return new Stats();
}
