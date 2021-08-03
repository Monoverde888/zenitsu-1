import detritus from 'detritus-client';
import mongoose from 'mongoose';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../utils/const.js'
import { BaseSlash } from '../../utils/classes/slash.js';

export default function() {

  class Ping extends BaseSlash {
    constructor() {
      super();
      this.name = 'ping'
      this.description = 'Pong'
    }
    async run(ctx: detritus.Slash.SlashContext, __args: Record<string, any>) {

      const res = await ctx.client.ping();
      const date: number = Date.now();
      const ping_db: number = await new Promise((r, j) => {
        mongoose.connection.db.admin().ping((err, result) => (err || !result) ? j(err || result) : r(Date.now() - date))
      });
      const embed = new MessageEmbed()
        .setDescription
        (
          `
        🏓 Gateway: ${res.gateway}ms [${getStatus(res.gateway)}]\n🏃 Message: ${date - Number(ctx.interaction.createdAt)}ms [${getStatus(date - Number(ctx.interaction.createdAt))}]\n🗃️ DB: ${ping_db}ms [${getStatus(ping_db)}]
        `
        )
        .setTimestamp()
        .setColor(Color);
      return ctx.editOrRespond({ embed });
    }
  }

  return new Ping();

};

function getStatus(number: number) {

  let color = '';
  if (number >= 400) color = `⚫`
  else if (number >= 300) color = `🔴`
  else if (number >= 200) color = `🟠`
  else if (number >= 100) color = `🟡`
  else color = `🟢`;
  return `\\${color}`;

}
