import dotenv from 'dotenv';
import * as sharder from '@lil_marcrock22/eris-sharder';
import eris from 'eris-pluris';
dotenv.config();
const { Base } = sharder;
class Sharder extends Base {

    constructor(client: { bot: eris.Client; clusterID: number; ipc: unknown }) {
        super(client);
    }
    async launch(): Promise<boolean> {
        console.log(`Shards cargadas 👍`)
        return true;
    }

}

export default Sharder;