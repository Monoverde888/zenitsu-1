import detritus from 'detritus-client';
import CommandClientType from '../../utils/classes/commandclient.js';
import Collector from '../../utils/collectors/button.js';
import MessageCollector from '../../utils/collectors/message.js';

function channelDelete(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.GatewayClientEvents.ChannelDelete) {
  Collector.handleChannelDelete(data);
  MessageCollector.handleChannelDelete(data);
}

export default channelDelete
