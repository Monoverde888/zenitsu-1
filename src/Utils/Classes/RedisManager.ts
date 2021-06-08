import redis from 'redis';
import util from 'util';

const client = redis.createClient(),
    { promisify } = util,
    setPromise = promisify(client.set).bind(client),
    getPromise = promisify(client.get).bind(client);

client.on("error", function (error) {
    console.error(error);
}).on('ready', async () => {
    setPromise('xd', 'aver')
        .then(console.log);
    console.log('Ready');
}).on('connect', (...xd) => {
    console.log(process.memoryUsage().heapUsed / 1024 / 1024);
    console.log('Connected', ...xd);
}).on('reconnecting', (...xd) => {
    console.log('Reconnecting', ...xd);
}).on('end', (...xd) => {
    console.log('Ended', ...xd);
}).on('warning', (...xd) => {
    console.log(...xd);
});

class RedisManager {

    set(key: string, value: string): string {
        
        return setPromise(key, value);

    }

    get(key: string): string {

        return getPromise(key);

    }

}

export default RedisManager;