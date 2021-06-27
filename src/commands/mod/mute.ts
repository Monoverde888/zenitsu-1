import BaseCommand from '../../Utils/Classes/command.js';
import json from '../../Utils/Lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../Utils/Functions/getguild.js';
import getHighest from '../../Utils/Functions/gethighest.js';
import detritus from 'detritus-client';
import unmarkdown from '../../Utils/Functions/unmarkdown.js';
import { Flags } from '../../Utils/const.js';
import redis from '../../Utils/Managers/redis.js';

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [`${prefix}mute <@Member>`]
    },
    category: 'mod'
  },
  name: 'mute',
  permissions: [Flags.KICK_MEMBERS],
  permissionsClient: [Flags.MANAGE_ROLES],
  onBeforeRun(ctx) {
    return ctx.message.mentions.first() && (ctx.message.mentions.first() instanceof detritus.Structures.Member) && (ctx.message.mentions.first().id != ctx.userId);
  },
  async run(ctx) {

    const langjson = json[(await getGuild(ctx.guildId)).lang]

    const data = await getGuild(ctx.guildId);

    await redis.set(ctx.guildId, JSON.stringify(data));

    const ROLE_BOT = getHighest(ctx.guild.me);
    const role = ctx.guild.roles.get(data.muterole);

    if (!role)
      return ctx.reply(langjson.commands.mute.no_role(ctx.prefix))

    if (role.position >= ROLE_BOT.position)
      return ctx.reply(langjson.commands.mute.cant_role(role.mentionable ? role.name : role.mention))

    const member = ctx.message.mentions.first() as detritus.Structures.Member

    if (!member) return ctx.reply(langjson.commands.mute.mention);
    if (member.roles.has(role.id)) return ctx.reply(langjson.commands.mute.already_muted(unmarkdown(member.username)));
    if (ctx.userId != ctx.guild.ownerId) {
      if (getHighest(ctx.message.member).position <= getHighest(member).position) return ctx.reply(langjson.commands.mute.user_cannt_mute(`**${unmarkdown(member.username)}**`))
    }

    return member.addRole(role.id)
      .then(() => {

        const embed = new MessageEmbed()
          .setColor(0x2ecc71)
          .setDescription(langjson.commands.mute.mute(unmarkdown(member.username)))
          .setFooter(ctx.message.author.username, ctx.message.author.avatarUrl)

        return ctx.reply({ embed })

      })
      .catch((error) => {

        const embed = new MessageEmbed()
          .setColor(0xff0000)
          .setDescription(`Error: ${error ? (error.message || error) : error}`)
          .setFooter(ctx.message.author.username, ctx.message.author.avatarUrl)

        return ctx.reply({ embed })

      });

  },
});
