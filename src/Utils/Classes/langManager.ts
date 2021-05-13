import Collection from './Collection.js'
import langM from "../../models/lang.js";

interface obj {
    id: string;
    lang: 'es' | 'en';
}

class LangManager {

    collection: Collection<string, obj>

    constructor() {
        this.collection = new Collection();
    }

    async set(id: string, lang: 'es' | 'en'): Promise<obj> {
        const data = await langM.findOneAndUpdate({ id }, { lang }, { new: true, upsert: true });
        this.collection.set(id, data);
        return data;
    }

    async fetch(id: string): Promise<obj> {

        const data = await langM.findOne({ id }) || await langM.create({ id, lang: 'en' });

        this.collection.set(id, data);

        return data;

    }

    async delete(id: string): Promise<boolean> {
        await langM.deleteOne({ id });
        return this.cache.delete(id);
    }

    cacheOrFetch(id: string): Promise<obj> | obj {

        return this.cache.get(id) || this.fetch(id);

    }

    get cache(): Collection<string, obj> {

        return this.collection;

    }

}

export default LangManager;