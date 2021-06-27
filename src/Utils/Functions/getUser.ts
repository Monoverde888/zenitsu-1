import redis from '../Managers/Redis.js';
import model, { USER } from '../../Database/models/user.js';

async function getUser(id: string): Promise<USER> {

  const redisData = await redis.get(id)

  if (typeof redisData == 'string') {

    return JSON.parse(redisData);

  }

  const data = await model.findOne({ id }).lean() || await model.create({ id });

  await redis.set(id, JSON.stringify(data));

  return data;

}

export default getUser;
