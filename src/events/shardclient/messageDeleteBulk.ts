import detritus from 'detritus-client';
import CommandClientType from '../../utils/classes/commandclient.js';
import Collector from '../../utils/collectors/button.js';

function messageDeleteBulk(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.GatewayClientEvents.MessageDeleteBulk) {
  Collector.handleMessageDeleteBulk(data);
}

export default messageDeleteBulk;
