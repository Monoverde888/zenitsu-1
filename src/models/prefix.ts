import mongoose from 'mongoose';
const { Schema, model } = mongoose;

interface Prefix extends mongoose.Document {
    id: string;
    prefix: 'z!' | string
}

const Prefix = new Schema({
    id: { type: String, unique: true },
    prefix: {
        default: 'z!',
        type: String
    },
})

export default model<Prefix>('Prefix', Prefix);