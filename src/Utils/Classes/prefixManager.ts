import { Collection } from "discord.js-light";
import prefixM from "../../models/prefix";
import Zenitsu from "./client";

interface obj {
    prefix: string;
    id: string;
}


class PrefixManager {

    collection: Collection<string, obj>
    client: Zenitsu;

    constructor(client: Zenitsu) {
        this.client = client;
        this.collection = new Collection();
    }

    async set(id: string, prefix: string) {
        const data = await prefixM.findOneAndUpdate({ id }, { prefix }, { new: true, upsert: true });
        this.collection.set(id, data);
        return data;
    }

    async fetch(id: string) {

        const data = await prefixM.findOne({ id }) || await prefixM.create({ id, prefix: 'z!' });

        this.collection.set(id, data);

        return data;

    }

    delete(id: string) {

        this.cache.delete(id);
        return prefixM.findOneAndDelete({ id });

    }

    cacheOrFetch(id: string) {

        return this.cache.get(id) || this.fetch(id);

    }

    get cache() {

        return this.collection;

    }

}

export default PrefixManager;