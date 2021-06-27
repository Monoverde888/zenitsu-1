import fetch from 'node-fetch';
import BaseCommand from '../../Utils/Classes/command.js';
import parseArgs from '../../Utils/Functions/parseargs.js';
import json from '../../Utils/Lang/langs.js';
import getGuild from '../../Utils/Functions/getguild.js';

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [
        `${prefix}djsdocs [query]`,
        `${prefix}djsdocs stable [query]`,
        `${prefix}djsdocs master [query]`,
        `${prefix}djsdocs commando [query]`,
        `${prefix}djsdocs rpc [query]`,
        `${prefix}djsdocs akairo [query]`,
        `${prefix}djsdocs akairo-master [query]`,
        `${prefix}djsdocs collection [query]`,
      ]
    },
    category: 'util'
  },
  name: 'djsdocs',
  aliases: ['djs'],
  onBeforeRun(_, { arg }) {
    const args = parseArgs(arg);
    return !!args[0];
  },
  async run(ctx, { arg }) {

    const args = parseArgs(arg);
    const langjson = json[(await getGuild(ctx.guildId).then(x => x.lang))];
    /*
      "Copied" from https://github.com/AndreMor8/gidget/blob/master/src/commands/utility/djsdocs.js
    */
    let search = '';
    let type = '';
    const options = ["stable", "master", "commando", "rpc", "akairo", "akairo-master", "collection"];

    if (options.includes(args[0].toLowerCase())) {
      type = args[0].toLowerCase();
      search = args.slice(1).join(" ");
    } else {
      type = "stable";
      search = args.join(" ");
    }
    /*
      "Copied" from https://github.com/AndreMor8/gidget/blob/master/src/commands/utility/djsdocs.js
    */

    if (!search) return ctx.reply(langjson.commands.djs.what);

    const response = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${encodeURIComponent(type)}&q=${encodeURIComponent(search)}`).then(res => res.json()).catch(() => undefined);

    if (!response || (response.status == 404)) return ctx.reply(langjson.commands.djs.no_result);

    return ctx.reply({ embed: response });

  },
});
