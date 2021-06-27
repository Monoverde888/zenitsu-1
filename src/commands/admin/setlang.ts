import BaseCommand from '../../Utils/Classes/Command.js';
import parseArgs from '../../Utils/Functions/parseArgs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color, Flags } from '../../Utils/Const.js'
import redis from '../../Utils/Managers/Redis.js';
import guild from '../../Database/models/guild.js';

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
