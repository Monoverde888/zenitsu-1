import light from 'discord.js-light';
import Zenitsu from '../../Utils/Classes/client.js';

async function event(client: Zenitsu, message: light.Message, error: any): Promise<any> {

    console.log(error)

}
export default event