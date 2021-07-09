import BaseCommand from '../../utils/classes/command.js';
import getUser from '../../utils/functions/getuser.js';
import json from '../../utils/lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../utils/functions/getguild.js';
import fetch from 'node-fetch';

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [`${prefix}profile [@user]`]
    },
    category: 'fun'
  },
  name: 'profile',
  async run(ctx) {

    const langjson = json[(await getGuild(ctx.guildId)).lang];
    const user = ctx.message.mentions.filter(user => !user.bot)[0] || ctx.message.author;
    const data = await getUser(user.id)

    try {

      const response = await fetch(`${process.env.APIPROFILE}/${encodeURIComponent(JSON.stringify({
        color: data.color,
        avatar: user.avatarUrl,
        discriminator: user.discriminator,
        username: user.username,
        achievements: data.achievements,
        flags: data.flags,
        flagsTEXT: langjson.commands.profile.flags,
        achievementsTEXT: langjson.commands.profile.achievements,
        background: data.background,
        beta: data.beta
      }))}`, {
        headers:
          { 'authorization': process.env.APIKEY }
      })

      const buf = await response.buffer();

      const embed = new MessageEmbed()
        .setColor(parseInt(data.color, 16) || 0)
        .setDescription(data.description)
        .setImage('attachment://profile.png');

      return ctx.reply({ embed, files: [{ value: buf, filename: 'profile.png' }] });

    }

    catch{

      return ctx.reply('Error...');

    };


  },
});
