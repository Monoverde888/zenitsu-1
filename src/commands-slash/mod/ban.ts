import detritus from 'detritus-client';
import { BaseSlash } from '../../utils/classes/slash.js';
import json from '../../utils/lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../utils/functions/getguild.js';
import getHighest from '../../utils/functions/gethighest.js';
import unmarkdown from '../../utils/functions/unmarkdown.js';
import canMod from '../../utils/functions/canmod.js';

const { Constants: { Permissions: Flags } } = detritus;
const { Constants: { ApplicationCommandOptionTypes } } = detritus;

export default function () {
    class Ban extends BaseSlash {
        constructor() {
            super({
                options: [
                    {
                        name: 'member',
                        type: ApplicationCommandOptionTypes.USER,
                        required: true,
                        description: 'Member to ban',
                    },
                    {
                        name: 'reason',
                        type: ApplicationCommandOptionTypes.STRING,
                        required: false,
                        description: 'Reason',
                    },
                    {
                        name: 'deletedays',
                        type: ApplicationCommandOptionTypes.STRING,
                        required: false,
                        description: 'Delete messages days ago',
                        choices: [0, 1, 2, 3, 4, 5, 6, 7].map(x => {
                            return { name: x.toString(), value: x.toString() };
                        })
                    },
                ],
            });
            this.disableDm = true;
            this.name = 'ban';
            this.description = 'Ban a member';
            this.metadata = {
                usage(prefix: string) {
                    return [`${prefix}ban [Member]`];
                },
                category: 'mod',
            };
            this.permissions = [Flags.BAN_MEMBERS].map(BigInt);
            this.permissionsClient = [Flags.BAN_MEMBERS].map(BigInt);
        }

        onBeforeRun(ctx: detritus.Interaction.InteractionContext, args: { member: detritus.Structures.MemberOrUser }) {
            return args.member && (args.member instanceof detritus.Structures.Member) && (args.member.id != ctx.userId);
        }

        async run(
            ctx: detritus.Interaction.InteractionContext,
            args: { member: detritus.Structures.MemberOrUser; reason?: string; deletedays?: string }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const data = await getGuild(ctx.guildId);
            const langjson = json[data.lang];
            const member = args.member as detritus.Structures.Member;

            if (!canMod(member, ctx.client, 'ban')) return ctx.editOrRespond(langjson.commands.ban.cannt_ban(`**${unmarkdown(member.username)}**`));
            if (ctx.user.id !== ctx.guild.ownerId) {
                if (getHighest(ctx.member).position <= getHighest(member).position) return ctx.editOrRespond(langjson.commands.ban.user_cannt_ban(`**${unmarkdown(member.username)}**`));
            }

            return member.ban(args.reason ? {
                reason: args.reason,
                deleteMessageDays: args.deletedays || '0'
            } : { deleteMessageDays: args.deletedays || '0' })
                .then(() => {

                    const embed = new MessageEmbed()
                        .setColor(14720566)
                        .setDescription(langjson.commands.ban.ban(`**${unmarkdown(member.username)}**`, args.reason))
                        .setFooter(ctx.user.username, ctx.user.avatarUrl);

                    return ctx.editOrRespond({ embed });

                })
                .catch((error) => {

                    const embed = new MessageEmbed()
                        .setColor(14720566)
                        .setDescription(`Error: ${error ? (error.message || error) : error}`)
                        .setFooter(ctx.user.username, ctx.user.avatarUrl);

                    return ctx.editOrRespond({ embed });

                });
        }
    }

    return new Ban();
}