import redis from 'redis';
import util from 'util';

const client = redis.createClient(),
  { promisify } = util,
  setPromise = promisify(client.set).bind(client),
  getPromise = promisify(client.get).bind(client),
  delPromise = promisify(client.del).bind(client);

client.on("error", (...errors) => {
  console.error(...errors);
}).on('ready', (...xd) => {
  console.log('[REDIS] Ready', ...xd);
}).on('connect', (...xd) => {
  console.log('[REDIS] Connected', ...xd);
}).on('reconnecting', (...xd) => {
  console.log('[REDIS] Reconnecting', ...xd);
}).on('end', (...xd) => {
  console.log('[REDIS] Ended', ...xd);
}).on('warning', (...xd) => {
  console.warn(`[REDIS] Warning`, ...xd);
});

class RedisManager {

  set(key: string, value: string): Promise<string> {

    return setPromise(key, value);

  }

  get(key: string): Promise<string> {

    return getPromise(key);

  }

  del(key: string): Promise<number> {

    return delPromise(key);

  }

  get default() {

    return client;

  }

}
const manager = new RedisManager();
manager.default.flushall();
export default manager
