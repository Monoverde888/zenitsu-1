import detritus from 'detritus-client';
import Collector from '../../utils/collectors/button.js';

function guildDelete(_client: detritus.ShardClient, _interactionClient: detritus.InteractionCommandClient, data: detritus.GatewayClientEvents.GuildDelete) {
  Collector.handleGuildDelete(data);
}

export default guildDelete;
