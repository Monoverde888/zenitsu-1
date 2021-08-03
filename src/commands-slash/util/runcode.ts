import detritus from 'detritus-client';
import fetch from 'node-fetch';
import json from '../../utils/lang/langs.js';
import getGuild from '../../utils/functions/getguild.js';
import Component from '../../utils/buttons/component.js';
import URLButton from '../../utils/buttons/url.js';
const { Constants: { ApplicationCommandOptionTypes } } = detritus;
import { BaseCommandOption } from '../../utils/classes/slash.js';

export async function runcode() {

  const arr = await fetch(`https://emkc.org/api/v2/piston/runtimes`).then(x => x.json());
  const res = arr.map((x: { language: string; aliases: string[] }) => [x.language, ...x.aliases]);
  const avaliables: string[] = [];
  for (const i of res) {
    avaliables.push(...i)
  }

  class RunCode extends BaseCommandOption {

    name = 'runcode';
    description = '.';

    constructor() {
      super({
        options: [
          {
            name: 'code',
            required: true,
            description: 'Code to run.',
            type: ApplicationCommandOptionTypes.STRING
          },
          {
            name: 'language',
            required: true,
            description: 'Language',
            type: ApplicationCommandOptionTypes.STRING
          },
        ]
      });
      this.metadata = {
        usage(prefix: string) {
          return [
            prefix + 'runcode \\`\\`\\`javascript\nconsole.log("Hello world");\n\\`\\`\\`',
          ]
        },
        category: 'util'
      };
    };

    async run(ctx: detritus.Slash.SlashContext, args: { code: string; language: string }) {

      const langjson = ctx.guildId ? json[(await getGuild(ctx.guildId).then(x => x.lang))] : json['en'];

      // const pre_code = args.join(' ');
      //
      // if (!pre_code) return ctx.reply(langjson.commands.runcode.no_code);
      //
      // const res_regex = pre_code.match(regex);
      // const code = res_regex ? (res_regex[0].split('```').slice(0, 2).join('```').slice(3).split('\n').slice(1).join('\n') || '').trim() : null;
      //
      // if (!code) return ctx.reply(langjson.commands.runcode.no_code);
      //
      // final_code = code;
      // final_lang = res_regex[0].slice(3).split('\n')[0].trim().toLowerCase();

      if (!avaliables.includes(args.language)) return ctx.editOrRespond(langjson.commands.runcode.invalid_lang)

      await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

      const response = await fetch(`https://emkc.org/api/v2/piston/execute`, {
        method: 'POST',
        body: JSON.stringify({
          language: args.language,//lenguaje
          version: '*',//ultima versión (?)
          files: [{ content: args.code }],//código
        }),
        headers: {
          Authorization: process.env.RUNCODEKEY,
        }
      });

      const res = await response.json();

      if (res.run) {

        if (res.run.output) return ctx.editOrRespond({
          content: `${ctx.user.mention}\`\`\`${args.language}\n${(res.run.output as string).slice(0, 1800)}\`\`\``, components: [
            new Component(
              new URLButton()
                .setURL(`https://github.com/engineer-man/piston`)
                .setLabel('Piston GitHub')
            )
          ]
        });

        else return ctx.editOrRespond(langjson.commands.runcode.no_output);

      }

      return ctx.editOrRespond(res.message || langjson.commands.runcode.error);

    }
  }

  return new RunCode();

};
