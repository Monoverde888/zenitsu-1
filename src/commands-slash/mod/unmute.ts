import detritus                from "detritus-client";
import {BaseSlash}             from "../../utils/classes/slash.js";
import json                    from '../../utils/lang/langs.js';
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import getGuild                from '../../utils/functions/getguild.js';
import getHighest              from '../../utils/functions/gethighest.js';
import unmarkdown              from '../../utils/functions/unmarkdown.js';

const {Constants : {Permissions : Flags}} = detritus;
const {Constants : {ApplicationCommandOptionTypes}} = detritus;

export default function () {
    class UnMute extends BaseSlash {
        constructor() {
            super({
                options : [
                    {
                        name : "member",
                        type : ApplicationCommandOptionTypes.USER,
                        required : true,
                        description : ".",
                    },
                    {
                        name : "reason",
                        type : ApplicationCommandOptionTypes.STRING,
                        required : false,
                        description : ".",
                    },
                ],
            });
            this.disableDm = true;
            this.name = "unmute";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [`${prefix}unmute [Member]`];
                },
                category : "mod",
            };
            this.permissions = [Flags.KICK_MEMBERS].map(BigInt);
            this.permissionsClient = [Flags.MANAGE_ROLES].map(BigInt);
        }

        onBeforeRun(ctx : detritus.Slash.SlashContext, args : { member : detritus.Structures.MemberOrUser }) {
            return args.member && (args.member instanceof detritus.Structures.Member) && (args.member.id != ctx.userId);
        };

        async run(
            ctx : detritus.Slash.SlashContext,
            args : { member : detritus.Structures.MemberOrUser; reason? : string }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const data = await getGuild(ctx.guildId);
            const langjson = json[data.lang];
            const ROLE_BOT = getHighest(ctx.guild.me);
            const role = ctx.guild.roles.get(data.muterole);

            if (!role)
                return ctx.editOrRespond(langjson.commands.unmute.no_role('/'));

            if (role.position >= ROLE_BOT.position)
                return ctx.editOrRespond(langjson.commands.unmute.cant_role(role.mentionable ? role.name : role.mention))

            const member = args.member as detritus.Structures.Member

            if (!member.roles.has(role.id)) return ctx.editOrRespond(langjson.commands.unmute.already_unmuted(unmarkdown(member.username)));
            if (ctx.userId != ctx.guild.ownerId) {
                if (getHighest(ctx.member).position <= getHighest(member).position) return ctx.editOrRespond(langjson.commands.unmute.user_cannt_unmute(`**${unmarkdown(member.username)}**`))
            }

            return member.removeRole(role.id, args.reason ? {reason : args.reason} : {})
                         .then(() => {

                             const embed = new MessageEmbed()
                                 .setColor(0x2ecc71)
                                 .setDescription(langjson.commands.unmute.unmute(unmarkdown(member.username)))
                                 .setFooter(ctx.user.username, ctx.user.avatarUrl)

                             return ctx.editOrRespond({embed})

                         })
                         .catch((error) => {

                             const embed = new MessageEmbed()
                                 .setColor(0xff0000)
                                 .setDescription(`Error: ${error ? (error.message || error) : error}`)
                                 .setFooter(ctx.user.username, ctx.user.avatarUrl)

                             return ctx.editOrRespond({embed})

                         });
        }
    }

    return new UnMute();
}