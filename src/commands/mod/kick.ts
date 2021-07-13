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
      return [`${prefix}kick <@Member> [reason]`]
    },
    category: 'mod'
  },
  name: 'kick',
  permissions: [Flags.KICK_MEMBERS],
  permissionsClient: [Flags.KICK_MEMBERS],
  onBeforeRun(ctx) {
    const mention = ctx.message.mentions.first();
    return mention && (mention instanceof detritus.Structures.Member) && (mention.id != ctx.userId) && (mention.id != ctx.client.userId);
  },
  async run(ctx, { arg }) {

    const args = parseArgs(arg);
    const langjson = json[(await getGuild(ctx.guildId)).lang]
    const member = ctx.message.mentions.first() as detritus.Structures.Member

    if (!canMod(member, ctx.client, 'kick')) return ctx.reply(langjson.commands.kick.cannt_kick(`**${unmarkdown(member.username)}**`))
    if (ctx.message.author.id !== ctx.message.guild.ownerId) {
      if (getHighest(ctx.message.member).position <= getHighest(member).position) return ctx.reply(langjson.commands.kick.user_cannt_kick(`**${unmarkdown(member.username)}**`))
    }

    const reason = (args.join(' ') || '').replace(member.mention, '').slice(0, 500) || null;

    return member.remove({ reason }).then(() => {

      const embed = new MessageEmbed()
        .setColor(0x2ecc71)
        .setDescription(langjson.commands.kick.kick(`**${unmarkdown(member.username)}**`, reason))
        .setFooter(ctx.message.author.username, ctx.message.author.avatarUrl)

      return ctx.reply({ embed })

    }).catch((error) => {

      const embed = new MessageEmbed()
        .setColor(0xff0000)
        .setDescription(`Error: ${error ? (error.message || error) : error}`)
        .setFooter(ctx.message.author.username, ctx.message.author.avatarUrl)

      return ctx.reply({ embed })

    })

  },
});
