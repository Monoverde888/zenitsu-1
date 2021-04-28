import light from 'discord.js-light';
import Zenitsu from "./client.js";
import Model from '../../models/logs.js'

interface logs {
    idWeb: string;
    tokenWeb: string;
    TYPE: string;
}

interface Logs {
    id: string;
    logs: logs[]
}

class LogsManager {

    collection: light.Collection<string, Logs>
    client: Zenitsu;

    constructor(client: Zenitsu) {
        this.client = client;
        this.collection = new light.Collection();
    }

    delete(id: string) {
        this.cache.delete(id);
        return Model.deleteOne({ id });
    }

    async update(datazo: {
        id: string;
        webhook: {
            token: string;
            id: string
        };
        TYPE: string;
    }) {

        const fetch = await this.cacheOrFetch(datazo.id),
            check = (fetch.logs.find(item => (item.TYPE == datazo.TYPE)))
        console.log(check)

        if (!check) {

            const data = await Model.findOneAndUpdate({ id: datazo.id },
                {
                    ['$addToSet']: {
                        logs: {
                            TYPE: datazo.TYPE,
                            tokenWeb: datazo.webhook.token,
                            idWeb: datazo.webhook.id
                        },
                    },
                }, { new: true, upsert: true });


            this.cache.set(datazo.id, data);
            return data;
        }

        else {
            await Model.findOneAndUpdate({ id: datazo.id }, {
                $pull: {
                    logs: check
                }
            }, { new: true })

            const data = await Model.findOneAndUpdate({ id: datazo.id },
                {
                    $addToSet: {
                        logs: {
                            TYPE: datazo.TYPE,
                            tokenWeb: datazo.webhook.token,
                            idWeb: datazo.webhook.id
                        },
                    },
                }, { new: true, upsert: true });

            this.cache.set(datazo.id, data);

            return data;
        }

    }

    async fetch(id: string) {

        const data = await Model.findOne({ id }) || await Model.create({
            id: id,
            logs: []
        });

        this.cache.set(id, data)

        return data;

    }

    cacheOrFetch(id: string) {
        return this.cache.get(id) || this.fetch(id);
    }

    get cache() {
        return this.collection;
    }

}

export default LogsManager;