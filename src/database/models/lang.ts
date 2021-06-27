import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const lang = new Schema({
  id: { type: String, unique: true },
  lang: {
    default: 'es',
    type: String
  }
})

export interface Lang extends mongoose.Document {
  id: string;
  lang: 'es' | 'en'
}

export default model<Lang>('Lang', lang)
