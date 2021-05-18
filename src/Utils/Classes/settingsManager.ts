import Collection from './Collection.js'
import langM from "../../models/settings.js";

interface obj {
    id: string;
    muterole: string;
}

class SettingsManager {

    collection: Collection<string, obj>

    constructor() {
        this.collection = new Collection();
    }

    async set(id: string, what: 'muterole', value: string): Promise<obj> {
        const data = await langM.findOneAndUpdate({ id }, { [what]: value }, { new: true, upsert: true });
        this.collection.set(id, data);
        return data;
    }

    async fetch(id: string): Promise<obj> {
        const data = await langM.findOne({ id }) || await langM.create({
            id,
            muterole: '1'
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

    get cache(): Collection<string, obj> {
        return this.collection;
    }

}

export default SettingsManager;