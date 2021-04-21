import { Schema, model, Document } from 'mongoose';

const Snipe = new Schema({
    id: String,
    mensaje: String,
    avatarURL: String,
    nombre: String,
    date: Number
});

interface Snipes extends Document {
    id: string;
    mensaje: string;
    avatarURL: string;
    nombre: string;
    date: number
}

export default model<Snipes>('Snipe', Snipe);