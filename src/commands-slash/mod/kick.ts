import detritus                from "detritus-client";
import {BaseSlash}             from "../../utils/classes/slash.js";
import json                    from '../../utils/lang/langs.js';
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import getGuild                from '../../utils/functions/getguild.js';
import getHighest              from '../../utils/functions/gethighest.js';
import unmarkdown              from '../../utils/functions/unmarkdown.js';
import canMod                  from "../../utils/functions/canmod.js";

const {Constants : {Permissions : Flags}} = detritus;
const {Constants : {ApplicationCommandOptionTypes}} = detritus;

export default function () {
    class Kick extends BaseSlash {
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
                    }
                ],
            });
            this.disableDm = true;
            this.name = "kick";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [`${prefix}kick [Member]`];
                },
                category : "mod",
            };
            this.permissions = [Flags.KICK_MEMBERS].map(BigInt);
            this.permissionsClient = [Flags.KICK_MEMBERS].map(BigInt);
        }

        onBeforeRun(ctx : detritus.Slash.SlashContext, args : { member : detritus.Structures.MemberOrUser }) {
            return args.member && (args.member instanceof detritus.Structures.Member) && (args.member.id != ctx.userId);
        };

        async run(
            ctx : detritus.Slash.SlashContext,
            args : { member : detritus.Structures.MemberOrUser; reason? : string; deletedays? : string }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const data = await getGuild(ctx.guildId);
            const langjson = json[data.lang];
            const member = args.member as detritus.Structures.Member;

            if (!canMod(member, ctx.client, 'kick')) return ctx.editOrRespond(langjson.commands.kick.cannt_kick(`**${unmarkdown(member.username)}**`))
            if (ctx.user.id !== ctx.guild.ownerId) {
                if (getHighest(ctx.member).position <= getHighest(member).position) return ctx.editOrRespond(langjson.commands.kick.user_cannt_kick(`**${unmarkdown(member.username)}**`))
            }

            return member.remove({reason : args.reason || 'null'})
                         .then(() => {

                             const embed = new MessageEmbed()
                                 .setColor(0x2ecc71)
                                 .setDescription(langjson.commands.kick.kick(`**${unmarkdown(member.username)}**`, args.reason))
                                 .setFooter(ctx.user.username, ctx.user.avatarUrl)

                             return ctx.editOrRespond({embed})

                         }).catch((error) => {

                    const embed = new MessageEmbed()
                        .setColor(0xff0000)
                        .setDescription(`Error: ${error ? (error.message || error) : error}`)
                        .setFooter(ctx.user.username, ctx.user.avatarUrl)

                    return ctx.editOrRespond({embed})

                })
        }
    }

    return new Kick();
}