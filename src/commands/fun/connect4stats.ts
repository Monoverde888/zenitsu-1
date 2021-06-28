import BaseCommand from '../../utils/classes/command.js';
import getUser from '../../utils/functions/getuser.js';
import jsonLANG from '../../utils/lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../utils/functions/getguild.js';

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [
        `${prefix}connect4stats [@User]`
      ]
    },
    category: 'fun'
  },
  name: 'conecta4stats',
  aliases: ['fourinrowstats', '4enlineastats', 'c4stats'],
  async run(ctx) {

    const user = ctx.message.mentions.first() || ctx.message.author
    const langjson = await getGuild(ctx.guildId).then(x => jsonLANG[x.lang]);
    const data = await getUser(user.id);
    const easy = data.c4easy,
      medium = data.c4medium,
      hard = data.c4hard

    if (!easy && !medium && !hard) {
      const embed = new MessageEmbed()
        .setDescription(langjson.commands.connect4stats.no_data(user.mention))
        .setColor(0xff0000)
      return ctx.reply({ embed });
    }

    const json = langjson.commands.connect4stats,
      difi = json.difficulties,
      states = json.states

    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setAuthor(user.username, user.avatarUrl)

    if (easy) embed.addField(difi[0], `${states[0]}: ${easy.ganadas || 0} ${states[1]}: ${easy.perdidas || 0} ${states[2]}: ${easy.empates || 0}`)
    if (medium) embed.addField(difi[1], `${states[0]}: ${medium.ganadas || 0} ${states[1]}: ${medium.perdidas || 0} ${states[2]}: ${medium.empates || 0}`)
    if (hard) embed.addField(difi[2], `${states[0]}: ${hard.ganadas || 0} ${states[1]}: ${hard.perdidas || 0} ${states[2]}: ${hard.empates || 0}`)

    return ctx.reply({ embed: embed });

  },
});
