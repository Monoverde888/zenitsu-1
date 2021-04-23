import { Message } from 'discord.js-light';
import Zenitsu from '../../Utils/Classes/client';

async function event(client: Zenitsu, message: Message): Promise<any> {

    return client.updateMusic(message.guild.id);

}
export default event