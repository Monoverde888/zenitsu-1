import Model from '../../../models/logs.js'
import Manager from './RedisManager.js'

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

    redisClient: Manager;

    constructor(manager: Manager) {
        this.redisClient = manager;
    }

    async delete(id: string): Promise<number> {
        await Model.deleteOne({ id });
        return this.redisClient.del(id, 'logs_')
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


            await this.redisClient.set(datazo.id, JSON.stringify(data), 'logs_');
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

            await this.redisClient.set(datazo.id, JSON.stringify(data), 'logs_');

            return data;
        }

    }

    async fetch(id: string): Promise<Logs> {

        const data = await Model.findOne({ id }) || await Model.create({
            id,
            logs: []
        });

        await this.redisClient.set(id, JSON.stringify(data), 'logs_');

        return data;

    }

    async cacheOrFetch(id: string): Promise<Logs> {
        
        const data = await this.redisClient.get(id, 'logs_') || await this.fetch(id);

        if (typeof data == 'string')
            return JSON.parse(data)
        return data;
    }

}

export default LogsManager;