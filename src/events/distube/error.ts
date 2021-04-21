import { Message } from 'discord.js-light';
import Cliente from '../../Utils/Classes/client';

async function event(client: Cliente, message: Message, error: any): Promise<any> {

    console.log(error)

}
export default event