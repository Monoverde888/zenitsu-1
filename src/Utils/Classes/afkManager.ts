import light from 'discord.js-light';
import afkModel from '../../models/afk.js'

interface obj {
    reason: string;
    date: number
    status: boolean
    id: string
}


class AfkManager {

    collection: light.Collection<string, obj>

    constructor() {
        this.collection = new light.Collection();
    }

    async fetch(user: string): Promise<obj> {
        const func = async (): Promise<obj> => {
            return this.collection.get(user) || await afkModel.findOne({ id: user }) || await afkModel.create({ id: user, status: false, reason: 'AFK', date: Date.now() })
        }
        this.collection.set(user, await func());
        return this.collection.get(user);
    }

    async delete(user: string): Promise<true> {
        const cacheAfk = this.collection.get(user);
        await this.set(user, cacheAfk.reason, cacheAfk.date, false)
        return true;
    }

    async set(user: string, reason = 'AFK', date = Date.now(), status = true): Promise<obj> {
        const info = await afkModel.findOneAndUpdate({ id: user }, { reason, date, status }, { new: true, upsert: true })
        this.collection.set(user, info);
        return this.collection.get(user);
    }

    cacheOrFetch(user: string): obj | Promise<obj> {

        return this.cache.get(user) || this.fetch(user);

    }

    get cache(): light.Collection<string, obj> {
        return this.collection;
    }

}

export default AfkManager;