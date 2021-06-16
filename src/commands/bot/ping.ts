import MessageEmbed from '../../Utils/Classes/Embed.js'
import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js';
import mongoose from 'mongoose';
import * as  eris from '@lil_marcrock22/eris-light';

class Comando extends Command {

  constructor() {
    super();
    this.name = 'ping';
    this.category = 'bot';
  }

  async run({ message }: command): Promise<eris.Message> {

    const date: number = Date.now();
    const ping_db: number = await new Promise((r, j) => {
      mongoose.connection.db.admin().ping((err, result) => (err || !result) ? j(err || result) : r(Date.now() - date))
    });
    const embed = new MessageEmbed()
      .setDescription(`🏓 Bot: ${message.guild.shard.latency}ms [${getStatus(message.guild.shard.latency)}]\n🏃 Message: ${date - message.createdAt}ms [${getStatus(date - message.createdAt)}]\n🗃️ DB: ${ping_db}ms [${getStatus(ping_db)}]`)
      .setTimestamp()
      .setColor(this.client.color);

    return message.channel.createMessage({ embed });

  }
}

export default Comando;

function getStatus(number: number) {

  let color = '';
  if (number >= 400) color = `⚫`
  else if (number >= 300) color = `🔴`
  else if (number >= 200) color = `🟠`
  else if (number >= 100) color = `🟡`
  else color = `🟢`;
  return `\\${color}`;

}
