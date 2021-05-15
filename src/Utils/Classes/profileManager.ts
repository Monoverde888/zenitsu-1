import Collection from './Collection.js'
import langM from "../../models/profile.js";

interface obj {
    id: string;
    description: string;
    flags: string[];
    achievements: string[];
    color: string;
}

class LangManager {

    collection: Collection<string, obj>

    constructor() {
        this.collection = new Collection();
    }

    async set(id: string, what: 'description' | 'color', value: string): Promise<obj> {
        const data = await langM.findOneAndUpdate({ id }, { [what]: value }, { new: true, upsert: true });
        this.collection.set(id, data);
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
        this.collection.set(id, data);
        return data;
    }

    async delete(id: string): Promise<boolean> {
        await langM.deleteOne({ id });
        return this.cache.delete(id);
    }

    cacheOrFetch(id: string): obj | Promise<obj> {
        return this.cache.get(id) || this.fetch(id);
    }

    async add(id: string, what: 'flags' | 'achievements', toAdd: string): Promise<obj> {
        const data = await langM.findOneAndUpdate({ id }, { $addToSet: { [what]: toAdd } }, { new: true, upsert: true });
        this.cache.set(id, data);
        return data;
    }

    get cache(): Collection<string, obj> {
        return this.collection;
    }

}

export default LangManager;