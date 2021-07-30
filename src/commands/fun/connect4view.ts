import BaseCommand from '../../utils/classes/command.js';
import getUser from '../../utils/functions/getuser.js';
import json from '../../utils/lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../utils/functions/getguild.js';
import parseArgs from '../../utils/functions/parseargs.js';
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
  ratelimits: [
    { duration: 10 * 1000, limit: 1, type: 'user' },
  ],
  onBeforeRun(_ctx, { arg }) {
    const args = parseArgs(arg);
    return !!args[0];
  },
  async run(ctx, { arg }) {

    const DATA = await getUser(ctx.client.userId);
    const langjson = await getGuild(ctx.guildId).then(x => json[x.lang]);
    const args = parseArgs(arg);

    const _id = args[0];
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setImage('https://is.gd/6KTM2e')
      .setDescription(langjson.commands.connect4view.invalid);

    const data = (DATA.c4Maps || []).find(item => JSON.parse(JSON.stringify(item))._id == _id);

    if (!data) return ctx.reply({
      embed
    });

    try {

      const response = await fetch(`${process.env.APICONNECTFOUR}/${encodeURIComponent(JSON.stringify(data.maps))}`, {
        headers:
          { 'authorization': process.env.APIKEY }
      });

      const buffer = await response.buffer();

      return ctx.reply({
        files: [{ value: buffer, filename: 'ggez.gif' }], messageReference: {
          channelId: ctx.channelId,
          failIfNotExists: false,
          messageId: ctx.messageId,
          guildId: ctx.guildId,
        }
      });

    }

    catch {

      return ctx.reply('Error...');

    }

  },
});
