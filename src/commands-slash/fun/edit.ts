import detritus                from "detritus-client";
import {BaseCommandOption}     from "../../utils/classes/slash.js";
import json                    from '../../utils/lang/langs.js';
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import getGuild                from '../../utils/functions/getguild.js';
import redis                   from '../../utils/managers/redis.js';
import model                   from '../../database/models/user.js';
import pkgvalidURL             from 'image-url-validator';

const validURL = pkgvalidURL.default;
const {Constants : {ApplicationCommandOptionTypes}} = detritus;

export function edit() {
    class Edit extends BaseCommandOption {
        constructor() {
            super({
                options : [
                    {
                        name : "type",
                        type : ApplicationCommandOptionTypes.STRING,
                        required : true,
                        description : ".",
                        choices : ['color', 'description', 'background'].map(x => {
                            return {name : x, value : x}
                        })
                    },
                    {
                        name : "data",
                        type : ApplicationCommandOptionTypes.STRING,
                        required : true,
                        description : ".",
                    },
                ],
            });
            this.name = "edit";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [
                        `${prefix}profile edit color FF0000`,
                        `${prefix}profile edit color #FF0000`,
                        `${prefix}profile edit description Hi :d.`,
                        `${prefix}profile edit background URL`
                    ]
                },
                category : "fun",
            };
        }

        async run(
            ctx : detritus.Slash.SlashContext,
            args : { type : 'color' | 'description' | 'background'; data : string }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const langjson = json[(await getGuild(ctx.guildId)).lang];

            switch (args.type) {

                case 'background': {

                    const isIMG = await validURL(args.data);

                    if (!isIMG)
                        return ctx.editOrRespond(langjson.commands.editprofile.invalid_url);

                    return model.findOneAndUpdate({id : ctx.userId}, {background : args.data}, {
                        new : true,
                        upsert : true
                    }).then(async (d) => {

                        await redis.set(ctx.userId, JSON.stringify(d));

                        const embed = new MessageEmbed()
                            .setImage(args.data)
                            .setDescription(langjson.commands.editprofile.new_background)

                        return ctx.editOrRespond({embed});

                    });

                }

                case 'color': {

                    const newColor = parseInt(args.data.replace(/\#/gmi, ''), 16);

                    if (!newColor && newColor != 0) {

                        const embed = new MessageEmbed()
                            .setImage(`https://cdn.discordapp.com/attachments/842090973311270914/843166076673327134/G64ZYWcv.gif`)
                            .setDescription(langjson.commands.editprofile.invalid)
                            .setColor(0xff0000);
                        return ctx.editOrRespond({embed});

                    }

                    return model.findOneAndUpdate({id : ctx.userId}, {color : newColor.toString(16)}, {
                        new : true,
                        upsert : true
                    }).then(async (d) => {

                        await redis.set(ctx.userId, JSON.stringify(d));

                        const embed = new MessageEmbed()
                            .setColor(newColor)
                            .setDescription(langjson.commands.editprofile.new_color)
                        return ctx.editOrRespond({embed});

                    });

                }

                case 'description': {

                    // if (!args.data) {
                    //
                    //     const embed = new MessageEmbed()
                    //         .setDescription(langjson.commands.editprofile.description_invalid('/'))
                    //         .setColor(0xff0000);
                    //     return ctx.editOrRespond({embed});
                    //
                    // }

                    return model.findOneAndUpdate({id : ctx.userId}, {description : args.data}, {
                        new : true,
                        upsert : true
                    }).then(async (d) => {

                        await redis.set(ctx.userId, JSON.stringify(d));

                        const embed = new MessageEmbed()
                            .setColor(0xff0000)
                            .setDescription(langjson.commands.editprofile.description_nice('/'));
                        return ctx.editOrRespond({embed});

                    });

                }

            }

        }
    }

    return new Edit();
}
