import detritus from 'detritus-client';
import getguild from '../../utils/functions/getguild.js';
import json from '../../utils/lang/langs.js';

async function commandRatelimit(_client: detritus.ShardClient, _interactionClient: detritus.InteractionCommandClient, data: detritus.Interaction.InteractionCommandEvents.CommandRatelimit) {

  const langjson = await getguild(data.context.guildId).then(x => json[x.lang]);

  let replied = false;

  for (const i of data.ratelimits.filter(x => !x.item.replied)) {
    if (replied) break;
    if (i.remaining < 2000) continue;
    i.item.replied = true;
    replied = true;
    return data.context.respond({ data: { content: langjson.messages.ratelimit(i.remaining) }, type: detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE });
  }
}

export default commandRatelimit;
