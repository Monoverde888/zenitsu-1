import BaseCommand from '../../utils/classes/command.js';
import parseArgs from '../../utils/functions/parseargs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color, Flags } from '../../utils/const.js'
import redis from '../../utils/managers/redis.js';
import guild from '../../database/models/guild.js';

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [`${prefix}setlang <es|en>`]
    },
    category: 'admin'
  },
  permissions: [Flags.MANAGE_GUILD],
  name: 'setlang',
  onBeforeRun(__ctx, { arg }) {
    const args = parseArgs(arg);
    return ['es', 'en'].includes(args[0]);
  },
  async run(ctx, { arg }) {

    const args = parseArgs(arg);
    const selectLang = args[0].toLowerCase()

    switch (selectLang) {

      case 'es': {

        const data = await guild.findOneAndUpdate({ id: ctx.guildId }, { lang: 'es' }, { new: true, upsert: true }).lean();

        await redis.set(ctx.guildId, JSON.stringify(data));

        return ctx.reply({
          embed:
            new MessageEmbed()
              .setColor(Color)
              .setDescription(`🇪🇸 | Establecido al español :D.`)
              .setAuthor(ctx.message.author.username, ctx.message.author.avatarUrl)
        });

      }

      case 'en': {

        const data = await guild.findOneAndUpdate({ id: ctx.guildId }, { lang: 'en' }, { new: true, upsert: true }).lean();

        await redis.set(ctx.guildId, JSON.stringify(data));

        return ctx.reply({
          embed:
            new MessageEmbed()
              .setColor(Color)
              .setDescription(`🇺🇸 | Established in English.`)
              .setAuthor(ctx.message.author.username, ctx.message.author.avatarUrl)
        });

      }
    }
  },
});
