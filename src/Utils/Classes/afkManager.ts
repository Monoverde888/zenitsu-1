import { Collection } from "discord.js-light";
import Cliente from "./client";
import afkModel from '../../models/afk'

interface obj {
    reason: string;
    date: number
    status: boolean
    id: string
}


class AfkManager {

    collection: Collection<string, obj>
    client: Cliente;

    constructor(client: Cliente) {
        this.client = client;
        this.collection = new Collection();
    }

    async fetch(user: string): Promise<obj> {
        let func = async (): Promise<any> => {
            return this.collection.get(user) || await afkModel.findOne({ id: user })
        }
        this.collection.set(user, await func() || {});
        return this.collection.get(user);
    }

    async delete(user: string): Promise<true> {
        let cacheAfk = this.collection.get(user);
        await this.set(user, cacheAfk.reason, cacheAfk.date, false)
        return true;
    }

    async set(user: string, reason: string = 'AFK', date = Date.now(), status = true) {
        let info = await afkModel.findOneAndUpdate({ id: user }, { reason, date, status }, { new: true, upsert: true })
        this.collection.set(user, info);
        return this.collection.get(user);
    }

    cacheOrFetch(user: string) {

        return this.cache.get(user) || this.fetch(user);

    }

    get cache() {
        return this.collection;
    }

}

export default AfkManager;