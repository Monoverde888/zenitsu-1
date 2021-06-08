import langM from "../../../models/settings.js";
import Manager from './RedisManager.js'

interface obj {
    id: string;
    muterole: string;
}

class SettingsManager {

    redisClient: Manager;

    constructor(manager: Manager) {
        this.redisClient = manager;
    }

    async set(id: string, what: 'muterole', value: string): Promise<obj> {
        const data = await langM.findOneAndUpdate({ id }, { [what]: value }, { new: true, upsert: true });
        await this.redisClient.set(id, JSON.stringify(data), 'settings_');
        return data;
    }

    async fetch(id: string): Promise<obj> {
        const data = await langM.findOne({ id }) || await langM.create({
            id,
            muterole: '1'
        });
        await this.redisClient.set(id, JSON.stringify(data), 'settings_');
        return data;
    }

    async delete(id: string): Promise<number> {
        await langM.deleteOne({ id });
        return this.redisClient.del(id, 'settings_');
    }

    async cacheOrFetch(id: string): Promise<obj> {
        const data = await this.redisClient.get(id, 'settings_') || await this.fetch(id);

        if (typeof data == 'string')
            return JSON.parse(data)
        return data;
    }

}

export default SettingsManager;