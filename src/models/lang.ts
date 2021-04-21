import { Schema, model, Document } from 'mongoose'

const Guild = new Schema({
    id: String,
    lang: {
        default: 'es',
        type: String
    }
})

interface Lang extends Document {
    id: string;
    lang: 'es' | 'en'
}

export default model<Lang>('Lang', Guild)