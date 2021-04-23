import { Message } from 'discord.js-light';
import Zenitsu from '../../Utils/Classes/client';

async function event(client: Zenitsu, message: Message, queue: any, playlist: any): Promise<any> {

    return client.updateMusic(message.guild.id);

}
export default event