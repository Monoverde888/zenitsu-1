import detritus from 'detritus-client';
import CommandClientType from '../../Utils/Classes/CommandClient.js';
import Collector from '../../Utils/Collectors/Button.js';

function poto(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.GatewayClientEvents.GuildDelete) {
  Collector.handleGuildDelete(data);
}

export default poto;
