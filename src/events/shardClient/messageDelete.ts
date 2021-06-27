import detritus from 'detritus-client';
import CommandClientType from '../../Utils/Classes/CommandClient.js';
import Collector from '../../Utils/Collectors/Button.js';

function poto(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.GatewayClientEvents.MessageDelete) {
  Collector.handleMessageDelete(data);
}

export default poto;
