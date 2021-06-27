import BaseCommand from '../../Utils/Classes/Command.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../Utils/Const.js';

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [`${prefix}vote`]
    },
    category: 'bot'
  },
  name: 'vote',
  aliases: ['topgg'],
  async run(ctx) {

    const embed = new MessageEmbed()
      .setThumbnail(ctx.client.user.avatarUrl)
      .setDescription(`https://top.gg/bot/721080193678311554`)
      .setColor(Color)
      .setFooter(ctx.message.author.username, ctx.message.author.avatarUrl)
      .setTimestamp();

    return ctx.reply({ embed: embed })

  },
});
