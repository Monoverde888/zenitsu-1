import BaseCommand from '../../Utils/Classes/command.js';
import json from '../../Utils/Lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../Utils/Functions/getguild.js';
import canMod from '../../Utils/Functions/canmod.js';
import getHighest from '../../Utils/Functions/gethighest.js';
import detritus from 'detritus-client';
import parseArgs from '../../Utils/Functions/parseargs.js';
import { Flags } from '../../Utils/const.js';
import unmarkdown from '../../Utils/Functions/unmarkdown.js';

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
    return ctx.message.mentions.first() && (ctx.message.mentions.first() instanceof detritus.Structures.Member) && (ctx.message.mentions.first().id != ctx.userId);
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
