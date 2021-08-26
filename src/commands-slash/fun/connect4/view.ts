import detritus from "detritus-client";
import { BaseCommandOption } from "../../../utils/classes/slash.js";
import jsonOBJECT from "../../../utils/lang/langs.js";
import getGuild from "../../../utils/functions/getguild.js";
import getUser from "../../../utils/functions/getuser.js";
import { Embed as MessageEmbed } from "detritus-client/lib/utils/embed.js";
import fetch from "node-fetch";

const { Constants: { ApplicationCommandOptionTypes } } = detritus;

export function view() {
    class View extends BaseCommandOption {
        constructor() {
            super({
                options: [
                    {
                        name: "id",
                        type: ApplicationCommandOptionTypes.STRING,
                        required: true,
                        description: "Game ID",
                    },
                ],
                ratelimits: [{
                    duration: 10000, limit: 1, type: 'guild',
                }]
            });
            this.name = "view";
            this.description = "View a connect4 game";
            this.metadata = {
                usage(prefix: string) {
                    return [`${prefix}connect4 view ID`];
                },
                category: "fun",
            };
        }

        async run(
            ctx: detritus.Interaction.InteractionContext,
            args: { id: string }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const DATA = await getUser(ctx.client.userId);
            const langjson = ctx.guildId ? jsonOBJECT[(await getGuild(ctx.guildId)).lang] : jsonOBJECT.en;

            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .setImage('https://is.gd/6KTM2e')
                .setDescription(langjson.commands.connect4view.invalid);

            const data = (DATA.c4Maps || []).find(item => JSON.parse(JSON.stringify(item))._id == args.id);

            if (!data) return ctx.editOrRespond({ embed });

            try {

                const response = await fetch(`${process.env.APICONNECTFOUR}/${encodeURIComponent(JSON.stringify(data.maps))}`, {
                    headers:
                        { 'authorization': process.env.APIKEY }
                });

                const buffer = await response.buffer();

                return ctx.editOrRespond({
                    files: [{ value: buffer, filename: 'ggez.gif' }]
                });

            }

            catch {

                return ctx.editOrRespond('Error...');

            }

        }
    }

    return new View();
}
