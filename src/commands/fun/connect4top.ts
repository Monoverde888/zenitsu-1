import BaseCommand from '../../Utils/Classes/Command.js';
import model, { USER } from '../../Database/models/user.js';
import jsonLANG from '../../Utils/Lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../Utils/Functions/getGuild.js';
import parseArgs from '../../Utils/Functions/parseArgs.js';

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [
        `${prefix}connect4top <easy/medium/hard>`
      ]
    },
    category: 'fun'
  },
  name: 'connect4top',
  aliases: ['fourinrowtop', '4enlineatop', 'c4top'],
  onBeforeRun(__ctx, { arg }) {
    const args = parseArgs(arg);
    return args[0] ? ['easy', 'medium', 'hard'].includes(args[0].toLowerCase()) : null;
  },
  async run(ctx, { arg }) {

    const args = parseArgs(arg);
    const difficulty = args[0].toLowerCase() as 'easy' | 'medium' | 'hard';
    const langjson = await getGuild(ctx.guildId).then(x => jsonLANG[x.lang]);
    const data = await model.find().sort({ [`c4${difficulty}.ganadas`]: -1 }).limit(10);
    const embed = new MessageEmbed()
      .setDescription(langjson.commands.connect4top.no_data(difficulty))
      .setColor(0xff0000)

    if (!data.length)
      return ctx.reply({ embed })

    const states: string[] = langjson.commands.connect4top.states
    const mini_data = data.map((item: USER) => {

      const xd = `c4${difficulty}` as 'c4easy' | 'c4medium' | 'c4hard';

      if (!item[xd]) return false;

      return `${item.id == ctx.userId ? `➡️ ` : ''}${(item.cacheName || '<@' + item.id + '>')}\n${states[0]}: ${item[xd].ganadas || 0} ${states[1]}: ${item[xd].perdidas || 0} ${states[2]}: ${item[xd].empates || 0}`

    }).filter(x => x);

    if (!mini_data.length)
      return ctx.reply({ embed });

    const description = mini_data.join('\n\n');

    const embed2 = new MessageEmbed()
      .setTitle('Top 10.')
      .setFooter(difficulty)
      .setDescription(description)
      .setColor(0xff0000);

    return ctx.reply({ embed: embed2 })

  },
});
