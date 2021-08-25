import detritus from 'detritus-client';
import Collector from '../../utils/collectors/button.js';

function messageDeleteBulk(_client: detritus.ShardClient, _interactionClient: detritus.InteractionCommandClient, data: detritus.GatewayClientEvents.MessageDeleteBulk) {
  Collector.handleMessageDeleteBulk(data);
}

export default messageDeleteBulk;
