import Zenitsu from '../../Utils/Classes/client.js';
async function event(client: Zenitsu, queue: any): Promise<any> {

    return queue.autoplay = false;

}
export default event