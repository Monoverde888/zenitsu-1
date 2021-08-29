import redis from '../managers/redis.js';
import model, { USER } from '../../database/models/user.js';
import mongoose from 'mongoose';

async function getUser(id: string): Promise<mongoose.LeanDocument<USER>> {

    const redisData = await redis.get(id);

    if (typeof redisData == 'string')
        return JSON.parse(redisData);

    const data = await model.findOne({ id }).lean() || await model.create({ id });
    await redis.set(id, JSON.stringify(data));
    return data;

}

export default getUser;