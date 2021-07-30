import detritus from 'detritus-client';
import CommandClientType from '../../utils/classes/commandclient.js';
import Collector from '../../utils/collectors/button.js';

function threadDelete(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.GatewayClientEvents.ThreadDelete) {
  Collector.handleThreadDelete(data);
}

export default threadDelete;
