import BaseCommand from '../../Utils/Classes/command.js';
import getPrivate from '../../Utils/Functions/getprivate.js';
import replace from '../../Utils/Functions/replace.js';
import parseArgs from '../../Utils/Functions/parseargs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../Utils/const.js'
import util from 'util';
import child_process from 'child_process';
const { exec: execC } = child_process;
const exec = util.promisify(execC)

export default new BaseCommand({
  label: 'code',
  onBefore(ctx) {
    return (ctx.message.author.id == `507367752391196682`);
  },
  metadata: {
    usage(prefix: string) {
      return [`${prefix}eval <code> -type [async|normal|exec|shell]`]
    },
    category: 'dev'
  },
  name: 'eval',
  aliases: ['e'],
  args: [{
    name: 'type',
    required: false,
    choices: ['async', 'normal', 'exec', 'shell'],
    default: 'normal'
  }],
  onBeforeRun(_, { code }) {
    const args = parseArgs(code);
    return !!args[0]
  },
  async run(ctx, { code, type }: { code: string; type: string }) {

    switch (type) {

      case 'normal':
      case 'async': {
        try {

          const res_evalued = await eval(`${type == 'async' ? '(async() => {' : ''}${code} ${type == 'async' ? '})()' : ''}`);
          const TYPE = typeof (res_evalued)
          let evalued = util.inspect(res_evalued, { depth: 0 });
          evalued = replace(evalued, getPrivate(), '☹️')
          const embed = new MessageEmbed()
            .setColor(Color)
            .setDescription('```js\n' + evalued.slice(0, 2000) + '\n```')
            .setTimestamp()
            .setFooter(ctx.message.author.username, ctx.message.author.avatarUrl)
            .addField('typeof', TYPE, true)
            .addField('Class', (res_evalued && res_evalued.constructor && res_evalued.constructor.name) ? res_evalued.constructor.name || 'NO CLASS' : 'NO CLASS', true)

          return await ctx.reply({ embed })

        }
        catch (err) {
          return ctx.reply('```js\n' + err.toString().slice(0, 1500) + '```')
        }
      }

      case 'exec':
      case 'shell': {
        try {

          const res = await exec(code);

          if (res.stderr.length && !res.stdout.length) {
            return ctx.reply('```STDERR:\n' + res.stderr.slice(0, 1500) + '```');
          }

          if (res.stderr.length) {
            ctx.reply('```STDERR:\n' + res.stderr.slice(0, 1500) + '```');
          }

          if (res.stdout.length) {
            return ctx.reply('```STDOUT:\n' + res.stdout.slice(0, 1500) + '```');
          }

        } catch (err) {

          return ctx.reply('```ERR:\n' + err.message.slice(0, 1500) + '```');

        }
      };

    }

  },
});
