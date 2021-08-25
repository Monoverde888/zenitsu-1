import detritus from 'detritus-client';
import Collector from '../../utils/collectors/button.js';

function threadDelete(_client: detritus.ShardClient, _interactionClient: detritus.InteractionCommandClient, data: detritus.GatewayClientEvents.ThreadDelete) {
  Collector.handleThreadDelete(data);
}

export default threadDelete;
