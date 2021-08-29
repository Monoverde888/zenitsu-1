import redis from '../managers/redis.js';
import model, { GUILD } from '../../database/models/guild.js';
import mongoose from 'mongoose';

async function getGuild(id: string): Promise<mongoose.LeanDocument<GUILD>> {

    const redisData = await redis.get(id);

    if (typeof redisData == 'string')
        return JSON.parse(redisData);

    const data = await model.findOne({ id }).lean() || await model.create({ id });
    await redis.set(id, JSON.stringify(data));
    return data;

}

export default getGuild;