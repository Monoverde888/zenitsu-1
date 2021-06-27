import detritus from 'detritus-client';
import CommandClientType from '../../utils/classes/commandclient.js';
import Collector from '../../utils/collectors/button.js';

function guildDelete(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.GatewayClientEvents.GuildDelete) {
  Collector.handleGuildDelete(data);
}

export default guildDelete;
