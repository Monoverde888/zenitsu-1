import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Guild = new Schema({
    id: String,
    lang: {
        default: 'es',
        type: String
    }
})

interface Lang extends mongoose.Document {
    id: string;
    lang: 'es' | 'en'
}

export default model<Lang>('Lang', Guild)