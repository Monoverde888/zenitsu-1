import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export interface Settings extends mongoose.Document {
    id: string;
    muterole: string;
}

const Prefix = new Schema({
    id: { type: String, unique: true },
    muterole: { type: String, default: '1' }
})

export default model<Settings>('Settings', Prefix);