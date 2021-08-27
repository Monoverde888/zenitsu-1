import detritus from 'detritus-client';
import { BaseCommandOption } from '../../../utils/classes/slash.js';
import json from '../../../utils/lang/langs.js';
import getGuild from '../../../utils/functions/getguild.js';
import getUser from '../../../utils/functions/getuser.js';
import fetch from 'node-fetch';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';

const { Constants: { ApplicationCommandOptionTypes }} = detritus;

export function view() {
    class View extends BaseCommandOption {
        constructor() {
            super({
                options: [
                    {
                        name: 'user',
                        type: ApplicationCommandOptionTypes.USER,
                        required: false,
                        description: 'User',
                    },
                ],
            });
            this.name = 'view';
            this.description = 'View your profile';
            this.metadata = {
                usage(prefix: string) {
                    return [`${prefix}profile view [Member]`];
                },
                category: 'fun',
            };
        }

        async run(
            ctx: detritus.Interaction.InteractionContext,
            args: { user: detritus.Structures.MemberOrUser }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const langjson = ctx.guildId ? json[(await getGuild(ctx.guildId)).lang] : json.en;
            const user = (args.user ? args.user.bot ? ctx.user : args.user : ctx.user) || ctx.user;
            const data = await getUser(user.id);

            try {

                const response = await fetch(`${process.env.APIPROFILE}/${encodeURIComponent(JSON.stringify({
                    color: data.color,
                    avatar: user.avatarUrl,
                    discriminator: user.discriminator,
                    username: user.username,
                    achievements: data.achievements,
                    flags: data.flags,
                    flagsTEXT: langjson.commands.profile.flags,
                    achievementsTEXT: langjson.commands.profile.achievements,
                    background: data.background,
                    beta: data.beta
                }))}`, {
                    headers:
                        { 'authorization': process.env.APIKEY }
                });
                const buf = await response.buffer();

                const embed = new MessageEmbed()
                    .setColor(parseInt(data.color, 16) || 0)
                    .setDescription(data.description)
                    .setImage('attachment://view.png');

                return ctx.editOrRespond({ embed, files: [{ value: buf, filename: 'view.png' }] });

            } catch (e) {

                console.error(e);
                return ctx.editOrRespond('Error...');

            }

        }
    }

    return new View();
}
