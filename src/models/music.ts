import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Guild = new Schema({
    message: String,
    guild: String,
    channel: String
})

interface Music extends mongoose.Document {
    message: string
    guild: string
    channel: string
}

export default model<Music>('Music', Guild)