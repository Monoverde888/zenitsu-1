import BaseCommand from '../../Utils/Classes/Command.js';
import json from '../../Utils/Lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Color } from '../../Utils/Const.js';
import getGuild from '../../Utils/Functions/getGuild.js';

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [`${prefix}invite`]
    },
    category: 'bot'
  },
  name: 'invite',
  async run(ctx) {

    const langjson = json[(await getGuild(ctx.guildId)).lang]

    const link = 'https://discord.com/oauth2/authorize?client_id=721080193678311554&scope=bot&permissions=8';
    const invitacionLink = 'https://discord.gg/4Yzc7Hk';
    const embed = new MessageEmbed()
      .setThumbnail(ctx.client.user.avatarUrl)
      .setDescription(langjson.commands.invite.message(link, invitacionLink))
      .setColor(Color)
      .setTimestamp()
    return ctx.reply({ embed: embed })

  },
});
