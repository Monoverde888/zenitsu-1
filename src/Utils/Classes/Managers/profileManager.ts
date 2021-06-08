import langM from "../../../models/profile.js";
import Manager from './RedisManager.js'

interface obj {
    id: string;
    description: string;
    flags: string[];
    achievements: string[];
    color: string;
}

class ProfileManager {

    redisClient: Manager;

    constructor(manager: Manager) {
        this.redisClient = manager;
    }

    async set(id: string, what: 'description' | 'color', value: string): Promise<obj> {
        const data = await langM.findOneAndUpdate({ id }, { [what]: value }, { new: true, upsert: true });
        await this.redisClient.set(id, JSON.stringify(data), 'profile_');
        return data;
    }

    async fetch(id: string): Promise<obj> {
        const data = await langM.findOne({ id }) || await langM.create({
            id,
            flags: [],
            achievements: [],
            color: '000000',
            description: `\u200b`
        });
        await this.redisClient.set(id, JSON.stringify(data), 'profile_');
        return data;
    }

    async delete(id: string): Promise<number> {
        await langM.deleteOne({ id });
        return this.redisClient.del(id, 'profile_');
    }

    async cacheOrFetch(id: string): Promise<obj> {
        const data = await this.redisClient.get(id, 'profile_') || await this.fetch(id);

        if (typeof data == 'string')
            return JSON.parse(data)
        return data;
    }

    async add(id: string, what: 'flags' | 'achievements', toAdd: string): Promise<obj> {
        const data = await langM.findOneAndUpdate({ id }, { $addToSet: { [what]: toAdd } }, { new: true, upsert: true });
        await this.redisClient.set(id, JSON.stringify(data), 'profile_');
        return data;
    }
}

export default ProfileManager;