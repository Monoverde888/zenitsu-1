import detritus from 'detritus-client';
import redis from '../managers/redis.js';
import model, { GUILD } from '../../database/models/guild.js';

class commandClient extends detritus.CommandClient {

  async onPrefixCheck(ctx: detritus.Command.Context) {
    const getRedis = await redis.get(ctx.guildId);
    const pre_data = getRedis || await model.findOne({ id: ctx.guildId }).lean() || await model.create({ id: ctx.guildId });
    const data = async (): Promise<GUILD> => {
      if (typeof pre_data == 'string') {
        return JSON.parse(pre_data);
      }
      await redis.set(ctx.guildId, JSON.stringify(pre_data));
      return pre_data;
    }
    return [(await data()).prefix];
  }

  async onMessageCheck(ctx: detritus.Command.Context) {
    if (ctx.fromBot || ctx.inDm || !ctx.guild || !ctx.canReply) return false;
    return true;
  }

}

export default commandClient;
