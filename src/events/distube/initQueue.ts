import Cliente from '../../Utils/Classes/client';
async function event(client: Cliente, queue: any): Promise<any> {

    return queue.autoplay = false;

}
export default event