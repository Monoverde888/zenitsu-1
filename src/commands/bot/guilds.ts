import BaseCommand from '../../Utils/Classes/Command.js';
import json from '../../Utils/Lang/langs.js';
import getGuild from '../../Utils/Functions/getGuild.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../Utils/Const.js'

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
      .setAuthor(`${ctx.client.guilds.size} shards`)
      .setFooter(`Shard #${ctx.shardId}`);

    return ctx.reply({ embed });

  },
});
