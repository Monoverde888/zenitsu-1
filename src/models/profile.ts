import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Guild = new Schema({

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

});

interface Profile extends mongoose.Document {
    id: string;
    description: string;
    flags: string[];
    achievements: string[];
    color: string;
}

export default model<Profile>('profile', Guild)