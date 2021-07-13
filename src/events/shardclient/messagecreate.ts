import MessageCollector from '../../utils/collectors/message.js';
import detritus from 'detritus-client';
import CommandClientType from '../../utils/classes/commandclient.js';

function messageCreate(_client: detritus.ShardClient, _commandClient: CommandClientType, data: detritus.GatewayClientEvents.MessageCreate) {

  if (data.message.fromBot) return;
  return MessageCollector.handleMessageCreate(data);

}

export default messageCreate;
