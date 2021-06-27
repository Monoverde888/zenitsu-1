import detritus from 'detritus-client';
import CommandClientType from '../../Utils/Classes/CommandClient.js';

function poto(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.Command.CommandEvents.CommandRatelimit) {
  for (const i of data.ratelimits.filter(x => !x.item.replied && data.context.canReply)) {
    if (i.remaining < 2000) continue;
    i.item.replied = true;
    return data.context.reply(`Try after ${i.remaining / 1000} seconds (${i.remaining}ms).`);
  };
}

export default poto;
