import dotenv from 'dotenv';
dotenv.config();
import load from './utils/load.js';
load({ token: process.env.DISCORD_TOKEN, mongo: process.env.MONGODB });
