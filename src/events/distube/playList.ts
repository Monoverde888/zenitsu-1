import { Message } from 'discord.js-light';
import Cliente from '../../Utils/Classes/client';

async function event(client: Cliente, message: Message, queue: any, playlist: any, song: any): Promise<any> {

    return client.updateMusic(message.guild.id);

}
export default event