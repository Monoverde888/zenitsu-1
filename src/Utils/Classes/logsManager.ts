import light from 'discord.js-light';
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

    constructor() {
        this.collection = new light.Collection();
    }

    async delete(id: string): Promise<boolean> {
        await Model.deleteOne({ id });
        return this.cache.delete(id);
    }

    async update(datazo: {
        id: string;
        webhook: {
            token: string;
            id: string
        };
        TYPE: string;
    }): Promise<Logs> {

        const fetch = await this.cacheOrFetch(datazo.id),
            check = (fetch.logs.find(item => (item.TYPE == datazo.TYPE)))

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

    async fetch(id: string): Promise<Logs> {

        const data = await Model.findOne({ id }) || await Model.create({
            id: id,
            logs: []
        });

        this.cache.set(id, data)

        return data;

    }

    cacheOrFetch(id: string): Promise<Logs> | Logs {
        return this.cache.get(id) || this.fetch(id);
    }

    get cache(): light.Collection<string, Logs> {
        return this.collection;
    }

}

export default LogsManager;