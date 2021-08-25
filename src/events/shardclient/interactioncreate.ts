import detritus           from 'detritus-client';
import CommandClientType  from '../../utils/classes/commandclient.js';
import Collector, {Fixed} from '../../utils/collectors/button.js';

function interactionCreate(_client : detritus.ShardClient, _commandClient : CommandClientType, data : detritus.GatewayClientEvents.InteractionCreate) {
    if ((data.interaction.type == 3) && ((data.interaction as Fixed).data.customId))
        Collector.handleInteractionCreate(data.interaction as Fixed);
}

export default interactionCreate;
