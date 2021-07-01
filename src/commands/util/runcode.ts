import fetch from 'node-fetch';
import BaseCommand from '../../utils/classes/command.js';
import parseArgs from '../../utils/functions/parseargs.js';
import json from '../../utils/lang/langs.js';
import getGuild from '../../utils/functions/getguild.js';
const regex = /```.*```/gsi;
import Component from '../../utils/buttons/component.js';
import URLButton from '../../utils/buttons/url.js';
let avaliables: string[];

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [
        prefix + 'runcode \\`\\`\\`javascript\nconsole.log("Hello world");\n\\`\\`\\`',
      ]
    },
    category: 'util'
  },
  name: 'runcode',
  aliases: ['publiceval'],
  onCancelRun(ctx) {
    return ctx.reply('>>> ' + ctx.command.metadata.usage(ctx.prefix))
  },
  onBeforeRun(_, { arg }) {
    const args = parseArgs(arg);

    if (!args[0]) return false;
    return true;

  },
  async run(ctx, { arg }) {

    if (!avaliables) {

      const arr: { language: string; aliases: string[] }[] = await fetch(`https://emkc.org/api/v2/piston/runtimes`).then(x => x.json());
      const res = arr.map(x => [x.language, ...x.aliases]);
      const temp = [];
      for (const i of res) {
        temp.push(...i)
      }
      avaliables = temp;

    }

    const args = parseArgs(arg);
    const langjson = json[(await getGuild(ctx.guildId).then(x => x.lang))];

    let final_code = '';
    let final_lang = '';

    if (!ctx.message.attachments.first()) {

      const pre_code = args.join(' ');

      if (!pre_code) return ctx.reply(langjson.commands.runcode.no_code);

      const res_regex = pre_code.match(regex);
      const code = res_regex ? (res_regex[0].split('```').slice(0, 2).join('```').slice(3).split('\n').slice(1).join('\n') || '').trim() : null;

      if (!code) return ctx.reply(langjson.commands.runcode.no_code);

      final_code = code;
      final_lang = res_regex[0].slice(3).split('\n')[0].trim().toLowerCase();

      if (!avaliables.includes(final_lang)) return ctx.reply(langjson.commands.runcode.invalid_lang)

    }

    else {

      if (!args[0]) return ctx.reply(langjson.commands.runcode.invalid_lang);

      const code = await fetch(ctx.message.attachments.first().url).then(x => x.text());

      if (!code || !code.trim()) return ctx.reply(langjson.commands.runcode.no_code);

      final_code = code;
      final_lang = args[0].toLowerCase();

      if (!avaliables.includes(final_lang)) return ctx.reply(langjson.commands.runcode.invalid_lang);

    };

    const response = await fetch(`https://emkc.org/api/v2/piston/execute`, {
      method: 'POST',
      body: JSON.stringify({
        language: final_lang,//lenguaje
        version: '*',//ultima versión (?)
        files: [{ content: final_code }],//código
      }),
      headers: {
        Authorization: process.env.RUNCODEKEY,
      }
    });

    const res = await response.json();

    if (res.run) {

      if (res.run.output) return ctx.reply({
        content: `${ctx.message.author.mention}\`\`\`\n${(res.run.output as string).slice(0, 1800)}\`\`\``, components: [
          new Component(
            new URLButton()
              .setURL(`https://github.com/engineer-man/piston`)
              .setLabel('Piston GitHub')
          )
        ]
      });
      else return ctx.reply(langjson.commands.runcode.no_output);

    }

    console.log(res, ctx.message.content);

    return ctx.reply(res.message || langjson.commands.runcode.error);


  },
});
