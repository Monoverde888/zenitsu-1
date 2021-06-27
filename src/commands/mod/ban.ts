import BaseCommand from '../../utils/classes/command.js';
import json from '../../utils/lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../utils/functions/getguild.js';
import canMod from '../../utils/functions/canmod.js';
import getHighest from '../../utils/functions/gethighest.js';
import detritus from 'detritus-client';
import parseArgs from '../../utils/functions/parseargs.js';
import { Flags } from '../../utils/const.js';
import unmarkdown from '../../utils/functions/unmarkdown.js';

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [`${prefix}ban <@Member> [reason] [-deletedays 1-7]`]
    },
    category: 'mod'
  },
  name: 'ban',
  permissions: [Flags.BAN_MEMBERS],
  permissionsClient: [Flags.BAN_MEMBERS],
  args: [{
    name: 'deletedays',
    required: false,
    type: Number,
    choices: [0, 1, 2, 3, 4, 5, 6, 7],
    default: 0
  }],
  onBeforeRun(ctx) {
    return ctx.message.mentions.first() && (ctx.message.mentions.first() instanceof detritus.Structures.Member) && (ctx.message.mentions.first().id != ctx.userId);
  },
  async run(ctx, { arg, deletedays }) {

    const args = parseArgs(arg);
    const langjson = json[(await getGuild(ctx.guildId)).lang]
    const member = ctx.message.mentions.first() as detritus.Structures.Member

    if (!canMod(member, ctx.client, 'ban')) return ctx.reply(langjson.commands.ban.cannt_ban(`**${unmarkdown(member.username)}**`))
    if (ctx.message.author.id !== ctx.guild.ownerId) {
      if (getHighest(ctx.message.member).position <= getHighest(member).position) return ctx.reply(langjson.commands.ban.user_cannt_ban(`**${unmarkdown(member.username)}**`));
    }

    const reason = (args.join(' ') || '').replace(`<@!${member.id}>`, '').slice(0, 500) || null;

    return member.ban({ reason, deleteMessageDays: deletedays }).then(() => {

      const embed = new MessageEmbed()
        .setColor(0x2ecc71)
        .setDescription(langjson.commands.ban.ban(`**${unmarkdown(member.username)}**`, reason))
        .setFooter(ctx.message.author.username, ctx.message.author.avatarUrl)

      return ctx.reply({ embed })

    })
      .catch((error) => {

        const embed = new MessageEmbed()
          .setColor(0xff000)
          .setDescription(`Error: ${error ? (error.message || error) : error}`)
          .setFooter(ctx.message.author.username, ctx.message.author.avatarUrl)

        return ctx.reply({ embed })

      })

  },
});
