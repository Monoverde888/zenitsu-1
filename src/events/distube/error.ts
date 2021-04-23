import { Message } from 'discord.js-light';
import Zenitsu from '../../Utils/Classes/client';

async function event(client: Zenitsu, message: Message, error: any): Promise<any> {

    console.log(error)

}
export default event