import mongoose from 'mongoose';
const { Schema, model } = mongoose;

interface Connect4 extends mongoose.Document {
    id: string;
    difficulty: string;
    perdidas: number;
    ganadas: number;
    empates: number;
    cacheName: string | '?'
}

const Guild = new Schema({
    id: { type: String, required: true, unique: true },
    difficulty: { type: String, default: 'medium' },
    perdidas: { type: Number, default: 0 },
    ganadas: { type: Number, default: 0 },
    empates: { type: Number, default: 0 },
    cacheName: { type: String, default: '?' }
});

export default model<Connect4>('c4top', Guild);