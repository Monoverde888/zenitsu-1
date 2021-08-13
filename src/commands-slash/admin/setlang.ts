import detritus                from "detritus-client";
import {BaseSlash}             from "../../utils/classes/slash.js";
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import guild                   from "../../database/models/guild.js";
import redis                   from "../../utils/managers/redis.js";
import {Color}                 from "../../utils/const.js";

const {Constants : {Permissions : Flags}} = detritus;
const {Constants : {ApplicationCommandOptionTypes}} = detritus;

const langs = ['en', 'es'];

export default function () {
    class Setlang extends BaseSlash {
        constructor() {
            super({
                options : [
                    {
                        name : "lang",
                        type : ApplicationCommandOptionTypes.STRING,
                        required : true,
                        description : ".",
                        choices : langs.map(x => {
                            return {name : x, value : x}
                        })
                    }
                ]
            });
            this.disableDm = true;
            this.name = "setlang";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return langs.map(lang => `${prefix}setlang ${lang}`)
                },
                category : "admin",
            };
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
        }

        async run(
            ctx : detritus.Interaction.InteractionContext,
            args : { lang : 'es' | 'en'; }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            switch (args.lang) {

                case 'es': {

                    const data = await guild.findOneAndUpdate({id : ctx.guildId}, {lang : 'es'}, {
                        new : true,
                    }).lean();

                    await redis.set(ctx.guildId, JSON.stringify(data));

                    return ctx.editOrRespond({
                        embed :
                            new MessageEmbed()
                                .setColor(Color)
                                .setDescription(`🇪🇸 | Establecido al español :D.`)
                                .setAuthor(ctx.user.username, ctx.user.avatarUrl)
                    });

                }

                case 'en': {

                    const data = await guild.findOneAndUpdate({id : ctx.guildId}, {lang : 'en'}, {
                        new : true,
                    }).lean();

                    await redis.set(ctx.guildId, JSON.stringify(data));

                    return ctx.editOrRespond({
                        embed :
                            new MessageEmbed()
                                .setColor(Color)
                                .setDescription(`🇺🇸 | Set to English :D.`)
                                .setAuthor(ctx.user.username, ctx.user.avatarUrl)
                    });
                }
            }
        }
    }

    return new Setlang();
}