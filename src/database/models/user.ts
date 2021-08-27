import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const Map = new Schema({
    maps: {
        type: Array,
        default: []
    },
    users: {
        type: Array,
        default: []
    },
    dif: String
}, { timestamps: true });

interface MAP extends mongoose.Document {
    maps: (string | number)[][]
    users: string[];
    dif: string;
}

export interface USER extends mongoose.Document {
    id: string;
    description: string;
    flags: string[];
    achievements: string[];
    color: string;
    c4easy: { perdidas: number; ganadas: number; empates: number; };
    c4medium: { perdidas: number; ganadas: number; empates: number; };
    c4hard: { perdidas: number; ganadas: number; empates: number; };
    c4Maps: MAP[];
    background: string;
    cacheName: string;
    beta: boolean;
}

const User = new Schema({
    id: { type: String, unique: true },
    description: {
        type: String,
        default: '\u200b'
    },
    flags: {
        type: Array,
        default: []
    },
    achievements: {
        type: Array,
        default: []
    },
    color: {
        type: String,
        default: '000000'
    },
    background: String,
    c4easy: Object,
    c4medium: Object,
    c4hard: Object,
    c4Maps: [Map],
    cacheName: String,
    beta: Boolean
}, { timestamps: true });

export default model<USER>('UserInfo', User);
