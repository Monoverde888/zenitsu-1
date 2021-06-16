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
  console.log('Ready', ...xd);
}).on('connect', (...xd) => {
  console.log('Connected', ...xd);
}).on('reconnecting', (...xd) => {
  console.log('Reconnecting', ...xd);
}).on('end', (...xd) => {
  console.log('Ended', ...xd);
}).on('warning', (...xd) => {
  console.log(...xd);
});

class RedisManager {

  default: redis.RedisClient;

  constructor() {
    this.default = client;
  }

  set(key: string, value: string, prefix: string): Promise<string> {

    return setPromise(prefix + key, value);

  }

  get(key: string, prefix: string): Promise<string> {

    return getPromise(prefix + key);

  }

  del(key: string, prefix: string): Promise<number> {

    return delPromise(prefix + key);

  }

}

export default RedisManager;
