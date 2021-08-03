import detritus from 'detritus-client';
import fetch from 'node-fetch';
import json from '../../utils/lang/langs.js';
import getGuild from '../../utils/functions/getguild.js';
const { Constants: { ApplicationCommandOptionTypes } } = detritus;
import { BaseCommandOption } from '../../utils/classes/slash.js';

export function DjsDocs() {

  const options = ["stable", "master", "commando", "rpc", "akairo", "akairo-master", "collection"];

  class Docs extends BaseCommandOption {

    name = 'djsdocs';
    description = '.';

    constructor() {
      super({
        options: [
          {
            name: 'query',
            required: true,
            description: 'Query',
            type: ApplicationCommandOptionTypes.STRING
          },
          {
            name: 'type',
            required: false,
            description: 'Type',
            type: ApplicationCommandOptionTypes.STRING,
            choices: options.map(x => { return { name: x, value: x } })
          },
        ]
      });
    };

    async run(ctx: detritus.Slash.SlashContext, args: { query: string; type?: string }) {

      const langjson = ctx.guildId ? json[(await getGuild(ctx.guildId).then(x => x.lang))] : json['en'];
      const type = args.type ? args.type : 'stable';
      const response = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${encodeURIComponent(type)}&q=${encodeURIComponent(args.query)}`).then(res => res.json()).catch(() => undefined);

      //if (!search) return ctx.editOrRespond(langjson.commands.djs.what);

      if (!response || (response.status == 404)) return ctx.editOrRespond(langjson.commands.djs.no_result);

      return ctx.editOrRespond({ embed: response });

    }

  }

  return new Docs();

};
