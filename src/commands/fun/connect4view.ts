import BaseCommand from '../../Utils/Classes/command.js';
import getUser from '../../Utils/Functions/getuser.js';
import json from '../../Utils/Lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../Utils/Functions/getguild.js';
import parseArgs from '../../Utils/Functions/parseargs.js';
import fetch from 'node-fetch';

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [
        `${prefix}connect4view <id>`,
      ]
    },
    category: 'fun'
  },
  name: 'connect4view',
  aliases: [`conecta4view`, 'fourinrowview', '4enlineaview', 'c4view'],
  onBeforeRun(_ctx, { arg }) {
    const args = parseArgs(arg);
    return !!args[0];
  },
  async run(ctx, { arg }) {

    const dataUser = await getUser(ctx.message.author.id);
    const langjson = await getGuild(ctx.guildId).then(x => json[x.lang]);
    const args = parseArgs(arg);

    const _id = args[0];
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setImage('https://i.imgur.com/qcek7Ll.gif')
      .setDescription(langjson.commands.connect4view.invalid);

    const data = (dataUser.c4Maps || []).find(item => JSON.parse(JSON.stringify(item))._id == _id);

    if (!data) return ctx.reply({ embed });

    try {

      const response = await fetch(`${process.env.APICONNECTFOUR}/${encodeURIComponent(JSON.stringify(data.maps))}`, {
        headers:
          { 'authorization': process.env.APIKEY }
      });

      const buffer = await response.buffer();

      return ctx.reply({ files: [{ value: buffer, filename: 'ggez.gif' }] });

    }

    catch {

      return ctx.reply('Error...');

    }

  },
});
