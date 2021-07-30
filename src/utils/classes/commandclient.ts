import detritus from 'detritus-client';
import getGuild from '../functions/getguild.js';

class commandClient extends detritus.CommandClient {

  async onPrefixCheck(ctx: detritus.Command.Context) {
    const data = await getGuild(ctx.guildId);
    return [data.prefix || 'z!'];
  }

  async onMessageCheck(ctx: detritus.Command.Context) {
    const data = await getGuild(ctx.guildId);
    if (data.ignorechannels && data.ignorechannels.includes(ctx.channelId)) return false;
    if (ctx.fromBot || ctx.inDm || !ctx.guild || !ctx.canReply || !ctx.channel.canEmbedLinks) return false;
    return true;
  }

}

export default commandClient;
