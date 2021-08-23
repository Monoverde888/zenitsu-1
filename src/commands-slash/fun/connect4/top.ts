import detritus                from "detritus-client";
import {BaseCommandOption}     from "../../../utils/classes/slash.js";
import jsonOBJECT              from "../../../utils/lang/langs.js";
import getGuild                from "../../../utils/functions/getguild.js";
import {Embed as MessageEmbed} from "detritus-client/lib/utils/embed.js";
import model, {USER}           from "../../../database/models/user.js";

const {Constants : {ApplicationCommandOptionTypes}} = detritus;

export function top() {
    class Top extends BaseCommandOption {
        constructor() {
            super({
                options : [
                    {
                        name : "difficulty",
                        type : ApplicationCommandOptionTypes.STRING,
                        required : true,
                        description : "Difficulty to look for",
                        choices : ['easy', 'medium', 'hard'].map(item => {
                            return {name : item, value : item}
                        })
                    },
                ],
            });
            this.name = "top";
            this.description = "List of best players";
            this.metadata = {
                usage(prefix : string) {
                    return [`${prefix}connect4 top easy/medium/hard`];
                },
                category : "fun",
            };
        }

        async run(
            ctx : detritus.Interaction.InteractionContext,
            args : { difficulty : string }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const langjson = ctx.guildId ? jsonOBJECT[(await getGuild(ctx.guildId)).lang] : jsonOBJECT.en;

            const data = await model.find().sort({[`c4${args.difficulty}.ganadas`] : -1}).limit(10);
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4top.no_data(args.difficulty))
                .setColor(0xff0000)

            if (!data.length)
                return ctx.editOrRespond({embed})

            const states : string[] = langjson.commands.connect4top.states
            const mini_data = data.map((item : USER) => {

                const xd = `c4${args.difficulty}` as 'c4easy' | 'c4medium' | 'c4hard';

                if (!item[xd]) return false;

                return `${item.id == ctx.userId ? `➡️ ` : ''}${(item.cacheName || '<@' + item.id + '>')}\n${states[0]}: ${item[xd].ganadas || 0} ${states[1]}: ${item[xd].perdidas || 0} ${states[2]}: ${item[xd].empates || 0}`

            }).filter(x => x);

            if (!mini_data.length)
                return ctx.editOrRespond({embed});

            const description = mini_data.join('\n\n');

            const embed2 = new MessageEmbed()
                .setTitle('Top 10.')
                .setFooter(args.difficulty)
                .setDescription(description)
                .setColor(0xff0000);

            return ctx.editOrRespond({embed : embed2})

        }
    }

    return new Top();
}
