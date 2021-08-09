import detritus            from "detritus-client";
import fetch               from "node-fetch";
import json                from "../../utils/lang/langs.js";
import getGuild            from "../../utils/functions/getguild.js";
import {BaseCommandOption} from "../../utils/classes/slash.js";

const {Constants : {ApplicationCommandOptionTypes}} = detritus;

export function DjsDocs() {
    const options = [
        "stable",
        "master",
        "commando",
        "rpc",
        "akairo",
        "akairo-master",
        "collection",
    ];

    class Docs extends BaseCommandOption {
        constructor() {
            super({
                options : [
                    {
                        name : "query",
                        required : true,
                        description : ".",
                        type : ApplicationCommandOptionTypes.STRING,
                    },
                    {
                        name : "type",
                        required : false,
                        description : ".",
                        type : ApplicationCommandOptionTypes.STRING,
                        choices : options.map((x) => {
                            return {name : x, value : x};
                        }),
                    },
                ],
            });
            this.name = "djsdocs";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return options.map((x) => `${prefix}djsdocs query [${x}]`);
                },
                category : "util",
            };
        }

        async run(
            ctx : detritus.Slash.SlashContext,
            args : { query : string; type? : string }
        ) {
            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
            const langjson = ctx.guildId
                ? json[await getGuild(ctx.guildId).then((x) => x.lang)]
                : json["en"];
            const type = args.type ? args.type : "stable";
            const response = await fetch(
                `https://djsdocs.sorta.moe/v2/embed?src=${encodeURIComponent(
                    type
                )}&q=${encodeURIComponent(args.query)}`
            ).then((res) => res.json()).catch(() => undefined);

            //if (!search) return ctx.editOrRespond(langjson.commands.djs.what);

            if (!response || response.status == 404)
                return ctx.editOrRespond(langjson.commands.djs.no_result);

            return ctx.editOrRespond({embed : response});
        }
    }

    return new Docs();
}
