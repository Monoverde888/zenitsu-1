import prefixM from "../../../models/prefix.js";
import Manager from './RedisManager.js'

interface obj {
    prefix: string;
    id: string;
}

class PrefixManager {

    redisClient: Manager;

    constructor(manager: Manager) {
        this.redisClient = manager;
    }

    async set(id: string, prefix: string): Promise<obj> {
        const data = await prefixM.findOneAndUpdate({ id }, { prefix }, { new: true, upsert: true });
        return data;
    }

    async fetch(id: string): Promise<obj> {

        const data = await prefixM.findOne({ id }) || await prefixM.create({ id, prefix: 'z!' });

        await this.redisClient.set(id, JSON.stringify(data), 'prefix_');

        return data;

    }

    async delete(id: string): Promise<number> {

        await prefixM.findOneAndDelete({ id });
        return this.redisClient.del(id, 'prefix_');

    }

    async cacheOrFetch(id: string): Promise<obj> {
        
        const data = await this.redisClient.get(id, 'prefix_') || await this.fetch(id);

        if (typeof data == 'string')
            return JSON.parse(data)
        return data;

    }

}

export default PrefixManager;