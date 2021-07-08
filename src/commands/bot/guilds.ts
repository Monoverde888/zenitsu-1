import BaseCommand from '../../utils/classes/command.js';
import json from '../../utils/lang/langs.js';
import getGuild from '../../utils/functions/getguild.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../utils/const.js'

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [`${prefix}guilds`]
    },
    category: 'bot'
  },
  name: 'guilds',
  aliases: ['servers'],
  async run(ctx) {

    const langjson = json[(await getGuild(ctx.guildId).then(x => x.lang))];

    const embed = new MessageEmbed()
      .setColor(Color)
      .setDescription(langjson.commands.guilds.message(ctx.client.guilds.size))
      .setTimestamp()
      .setAuthor(`${ctx.shardCount} shards`)
      .setFooter(`Shard #${ctx.shardId}`);

    return ctx.reply({ embed });

  },
});
