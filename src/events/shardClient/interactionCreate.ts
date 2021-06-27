import detritus from 'detritus-client';
import CommandClientType from '../../Utils/Classes/CommandClient.js';
import Collector, { Fixed } from '../../Utils/Collectors/Button.js';

function poto(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.GatewayClientEvents.InteractionCreate) {
  if ((data.interaction.type == 3) && ((data.interaction as Fixed).data.customId))
    Collector.handleInteractionCreate(data.interaction as Fixed);
}

export default poto;
