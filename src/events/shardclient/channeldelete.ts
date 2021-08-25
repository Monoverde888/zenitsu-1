import detritus from 'detritus-client';
import Collector from '../../utils/collectors/button.js';

function channelDelete(_client: detritus.ShardClient, _interactionClient: detritus.InteractionCommandClient, data: detritus.GatewayClientEvents.ChannelDelete) {
  Collector.handleChannelDelete(data);
}

export default channelDelete
