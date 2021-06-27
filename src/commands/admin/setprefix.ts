import BaseCommand from '../../Utils/Classes/Command.js';
import parseArgs from '../../Utils/Functions/parseArgs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color, Flags } from '../../Utils/Const.js'
import redis from '../../Utils/Managers/Redis.js';
import json from '../../Utils/Lang/langs.js';
import getGuild from '../../Utils/Functions/getGuild.js';
import guild from '../../Database/models/guild.js';

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [`${prefix}setprefix <newPrefix>`]
    },
    category: 'admin'
  },
  permissions: [Flags.MANAGE_GUILD],
  name: 'setprefix',
  onBeforeRun(__ctx, { arg }) {
    const args = parseArgs(arg);
    return args[0] && args[0].length <= 3;
  },
  async run(ctx, { arg }) {

    const langjson = json[(await getGuild(ctx.guildId).then(x => x.lang))];

    const args = parseArgs(arg);

    return guild.findOneAndUpdate({ id: ctx.guildId }, { prefix: args[0] }, { new: true, upsert: true }).lean().then(async data => {

      await redis.set(ctx.guildId, JSON.stringify(data))

      const embed = new MessageEmbed()
        .setColor(Color)
        .setDescription(langjson.commands.setprefix.prefix_nice(ctx.message.author.username, data.prefix))
        .setTimestamp()
      return ctx.reply({ embed: embed })

    }).catch(err => {

      const embed = new MessageEmbed()
        .setColor(Color)
        .setDescription(langjson.commands.setprefix.prefix_error)
        .setTimestamp()
        .setFooter(err.message || err)

      return ctx.reply({ embed: embed })

    })

  },
});
