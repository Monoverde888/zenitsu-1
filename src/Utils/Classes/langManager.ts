import { Collection } from "discord.js-light";
import langM from "../../models/lang";
import Zenitsu from "./client";

interface obj {
    id: string;
    lang: 'es' | 'en';
}


class PrefixManager {

    collection: Collection<string, obj>
    client: Zenitsu;

    constructor(client: Zenitsu) {
        this.client = client;
        this.collection = new Collection();
    }

    async set(id: string, lang: 'es' | 'en') {
        const data = await langM.findOneAndUpdate({ id }, { lang }, { new: true, upsert: true });
        this.collection.set(id, data);
        return data;
    }

    async fetch(id: string) {

        const data = await langM.findOne({ id }) || await langM.create({ id, lang: 'en' });

        this.collection.set(id, data);

        return data;

    }

    delete(id: string) {

        this.cache.delete(id);
        return langM.findOneAndDelete({ id });

    }

    cacheOrFetch(id: string) {

        return this.cache.get(id) || this.fetch(id);

    }

    get cache() {

        return this.collection;

    }

}

export default PrefixManager;