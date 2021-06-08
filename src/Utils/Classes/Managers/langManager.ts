import langM from "../../../models/lang.js";
import Manager from './RedisManager.js'

interface obj {
    id: string;
    lang: 'es' | 'en';
}

class LangManager {

    redisClient: Manager;

    constructor(manager: Manager) {
        this.redisClient = manager;
    }

    async set(id: string, lang: 'es' | 'en'): Promise<obj> {
        const data = await langM.findOneAndUpdate({ id }, { lang }, { new: true, upsert: true }).lean();
        await this.redisClient.set(id, JSON.stringify(data), 'lang_');
        return data;
    }

    async fetch(id: string): Promise<obj> {

        const data = await langM.findOne({ id }) || await langM.create({ id, lang: 'en' });
        await this.redisClient.set(id, JSON.stringify(data), 'lang_');
        return data;

    }

    async delete(id: string): Promise<number> {
        await langM.deleteOne({ id });
        return this.redisClient.del(id, 'lang_')
    }

    async cacheOrFetch(id: string): Promise<obj> {
        
        const data = await this.redisClient.get(id, 'lang_') || await this.fetch(id);
        
        if (typeof data == 'string')
            return JSON.parse(data)
        return data;

    }

}

export default LangManager;