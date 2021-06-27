import BaseCommand from '../../Utils/Classes/Command.js';
import mongoose from 'mongoose';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../Utils/Const.js'

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [`${prefix}ping`]
    },
    category: 'bot'
  },
  name: 'ping',
  aliases: ['pong'],
  async run(ctx) {

    const res = await ctx.client.ping();
    const date: number = Date.now();
    const ping_db: number = await new Promise((r, j) => {
      mongoose.connection.db.admin().ping((err, result) => (err || !result) ? j(err || result) : r(Date.now() - date))
    });
    const embed = new MessageEmbed()
      .setDescription
      (
        `
        🏓 Gateway: ${res.gateway}ms [${getStatus(res.gateway)}]\n🏃 Message: ${date - Number(ctx.message.createdAt)}ms [${getStatus(date - Number(ctx.message.createdAt))}]\n🗃️ DB: ${ping_db}ms [${getStatus(ping_db)}]
        `
      )
      .setTimestamp()
      .setColor(Color);

    return ctx.reply({ embed });

  },
});

function getStatus(number: number) {

  let color = '';
  if (number >= 400) color = `⚫`
  else if (number >= 300) color = `🔴`
  else if (number >= 200) color = `🟠`
  else if (number >= 100) color = `🟡`
  else color = `🟢`;
  return `\\${color}`;

}
