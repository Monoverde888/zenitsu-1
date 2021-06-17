import Command from '../../Utils/Classes/command.js'
import fetch from 'node-fetch';
import run from '../../Utils/Interfaces/run.js';
import * as  light from '@lil_marcrock22/eris-light'
export default class Comando extends Command {
  constructor() {
    super()
    this.name = "djs"
    this.category = 'utils'
  }
  async run({ message, args, embedResponse, langjson, prefix }: run): Promise<light.Message> {

    /*
      "Copied" from https://github.com/AndreMor8/gidget/blob/master/src/commands/utility/djsdocs.js
    */
    let search = '';
    let type = '';
    const options = ["stable", "master", "commando", "rpc", "akairo", "akairo-master", "collection"];

    if (args[0] && options.includes(args[0].toLowerCase())) {
      type = args[0];
      search = args.slice(1).join(" ");
    } else {
      type = "stable";
      search = args.join(" ");
    }
    /*
      "Copied" from https://github.com/AndreMor8/gidget/blob/master/src/commands/utility/djsdocs.js
    */

    if (!search) return embedResponse(langjson.commands.djs.what, message.channel, this.client.color, { embed: { footer: { text: `${prefix}${this.name} ( ${options.join(' | ')} ) <${langjson.commands.djs.query}>` } } });

    const response = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=${encodeURIComponent(type)}&q=${encodeURIComponent(search)}`).then(res => res.json()).catch(() => undefined);

    if (!response || (response.status == 404)) return embedResponse(langjson.commands.djs.no_result, message.channel, this.client.color);

    return message.channel.createMessage({ embed: response }).catch(() => undefined);

  }
}
