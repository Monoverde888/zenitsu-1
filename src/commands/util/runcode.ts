import Command from '../../Utils/Classes/command.js'
import fetch from 'node-fetch';
import run from '../../Utils/Interfaces/run.js';
import * as  light from '@lil_marcrock22/eris-light';
const regex = /```.*```/gsi;
import Zenitsu from '../../Utils/Classes/client.js';
import Component from '../../Utils/Buttons/Component.js';
import URLButton from '../../Utils/Buttons/URL.js';
//https://github.com/engineer-man/piston
export default class Comando extends Command {
  avaliables: string[];
  constructor() {
    super()
    this.name = 'runcode';
    this.category = 'utils';
    this.alias = ['publiceval'];
    this.cooldown = 6;
  }
  async run({ message, args, embedResponse, langjson }: run): Promise<light.Message> {

    let final_code = '';
    let final_lang = '';

    if (!message.attachments[0]) {

      const pre_code = args.join(' ');

      if (!pre_code) return embedResponse(langjson.commands.runcode.no_code, message.channel, this.client.color);

      const res_regex = pre_code.match(regex);
      const code = res_regex ? (res_regex[0].split('```').slice(0, 2).join('```').slice(3).split('\n').slice(1).join('\n') || '').trim() : null;

      if (!code) return embedResponse(langjson.commands.runcode.no_code, message.channel, this.client.color);

      final_code = code;
      final_lang = res_regex[0].slice(3).split('\n')[0].trim().toLowerCase();

      if (!this.avaliables.includes(final_lang)) return embedResponse(langjson.commands.runcode.invalid_lang, message.channel, this.client.color);

    }

    else {

      if (!args[0]) return embedResponse(langjson.commands.runcode.invalid_lang, message.channel, this.client.color);

      const code = await fetch(message.attachments[0].url).then(x => x.text());

      if (!code || !code.trim()) return embedResponse(langjson.commands.runcode.no_code, message.channel, this.client.color);

      final_code = code;
      final_lang = args[0].toLowerCase();

      if (!this.avaliables.includes(final_lang)) return embedResponse(langjson.commands.runcode.invalid_lang, message.channel, this.client.color);

    };

    const response = await fetch(`https://emkc.org/api/v2/piston/execute`, {
      method: 'POST',
      body: JSON.stringify({
        language: final_lang,//lenguaje
        version: '*',//ultima versión (?)
        files: [{ content: final_code }],//código
      })
    });

    const res = await response.json();

    if (res.run) {

      if (res.run.output) return message.channel.createMessage({
        content: `\`\`\`\n${(res.run.output as string).slice(0, 1900)}\`\`\``, components: [
          new Component(
            new URLButton()
              .setURL(`https://github.com/engineer-man/piston`)
              .setLabel('Piston GitHub')
          )
        ]
      });
      else return message.channel.createMessage(langjson.commands.runcode.no_output);

    }

    console.log(res, message.content);

    return message.channel.createMessage(res.message || langjson.commands.runcode.error);

  }

  async init(bot: Zenitsu) {

    super.init(bot);
    const arr: { language: string; aliases: string[] }[] = await fetch(`https://emkc.org/api/v2/piston/runtimes`).then(x => x.json());
    const res = arr.map(x => [x.language, ...x.aliases]);
    const temp = [];
    for (const i of res) {
      temp.push(...i)
    }
    this.avaliables = temp;
    return this;

  }

}
