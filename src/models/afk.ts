import { Schema, model, Document } from 'mongoose';

interface Afk extends Document {
    id: string;
    reason: 'AFK' | string;
    date: number;
    status: boolean
}

const modelo = new Schema({

    id: String,
    reason: { type: String, default: 'AFK' },
    date: { type: Number, default: 0 },
    status: { type: Boolean, default: false }

})

export default model<Afk>('afk', modelo);