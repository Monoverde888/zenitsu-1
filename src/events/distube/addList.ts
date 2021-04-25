import light from 'discord.js-light';
import Zenitsu from '../../Utils/Classes/client.js';

async function event(client: Zenitsu, message: light.Message, queue: any, playlist: any): Promise<any> {

    return client.updateMusic(message.guild.id);

}
export default event