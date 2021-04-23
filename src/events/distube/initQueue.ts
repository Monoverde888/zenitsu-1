import Zenitsu from '../../Utils/Classes/client';
async function event(client: Zenitsu, queue: any): Promise<any> {

    return queue.autoplay = false;

}
export default event