import detritus from 'detritus-client';
import CommandClientType from '../../utils/classes/commandclient.js';
import getguild from '../../utils/functions/getguild.js';
import json from '../../utils/lang/langs.js';

async function commandRatelimit(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.Command.CommandEvents.CommandRatelimit) {

  const langjson = await getguild(data.context.guildId).then(x => json[x.lang]);

  let replied = false;

  for (const i of data.ratelimits.filter(x => !x.item.replied && data.context.canReply)) {
    if (replied) break;
    if (i.remaining < 2000) continue;
    i.item.replied = true;
    replied = true;
    return data.context.reply(langjson.messages.ratelimit(i.remaining));
  };
}

export default commandRatelimit;
