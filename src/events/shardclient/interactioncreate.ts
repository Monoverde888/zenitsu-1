import detritus from 'detritus-client';
import Collector, { Fixed } from '../../utils/collectors/button.js';

function interactionCreate(_client: detritus.ShardClient, _interactionClient: detritus.InteractionCommandClient, data: detritus.GatewayClientEvents.InteractionCreate) {

    if ((data.interaction.type == 3) && ((data.interaction as Fixed).data.customId))
        Collector.handleInteractionCreate(data.interaction as Fixed);
}

export default interactionCreate;
