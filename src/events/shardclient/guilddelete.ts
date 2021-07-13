import detritus from 'detritus-client';
import CommandClientType from '../../utils/classes/commandclient.js';
import Collector from '../../utils/collectors/button.js';
import MessageCollector from '../../utils/collectors/message.js';

function guildDelete(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.GatewayClientEvents.GuildDelete) {
  Collector.handleGuildDelete(data);
  MessageCollector.handleGuildDelete(data);
}

export default guildDelete;
