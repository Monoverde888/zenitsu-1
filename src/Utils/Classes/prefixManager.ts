import Collection from './Collection.js'
import prefixM from "../../models/prefix.js";

interface obj {
    prefix: string;
    id: string;
}

class PrefixManager {

    collection: Collection<string, obj>

    constructor() {
        this.collection = new Collection();
    }

    async set(id: string, prefix: string): Promise<obj> {
        const data = await prefixM.findOneAndUpdate({ id }, { prefix }, { new: true, upsert: true });
        this.collection.set(id, data);
        return data;
    }

    async fetch(id: string): Promise<obj> {

        const data = await prefixM.findOne({ id }) || await prefixM.create({ id, prefix: 'z!' });

        this.collection.set(id, data);

        return data;

    }

    async delete(id: string): Promise<boolean> {

        await prefixM.findOneAndDelete({ id });
        return this.cache.delete(id);

    }

    cacheOrFetch(id: string): Promise<obj> | obj {

        return this.cache.get(id) || this.fetch(id);

    }

    get cache(): Collection<string, obj> {

        return this.collection;

    }

}

export default PrefixManager;