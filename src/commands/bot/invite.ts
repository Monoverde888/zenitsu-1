import BaseCommand from '../../utils/classes/command.js';
import json from '../../utils/lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../utils/const.js';
import getGuild from '../../utils/functions/getguild.js';

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [`${prefix}invite`]
    },
    category: 'bot'
  },
  name: 'invite',
  async run(ctx) {

    const langjson = json[(await getGuild(ctx.guildId)).lang];
    const link = 'https://discord.com/api/oauth2/authorize?client_id=721080193678311554&scope=bot+applications.commands&permissions=8';
    const invitacionLink = 'https://discord.gg/4Yzc7Hk';
    const embed = new MessageEmbed()
      .setThumbnail(ctx.client.user.avatarUrl)
      .setDescription(langjson.commands.invite.message(link, invitacionLink))
      .setColor(Color)
      .setTimestamp()
    return ctx.reply({ embed: embed })

  },
});
