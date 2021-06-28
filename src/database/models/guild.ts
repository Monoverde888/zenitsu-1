import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export interface GUILD extends mongoose.Document {
  id: string;
  lang: 'es' | 'en';
  prefix: string;
  logs: { idWeb: string; tokenWeb: string; TYPE: string }[];
  muterole: string;
}

const Guild = new Schema({
  id: { type: String, unique: true },
  lang: {
    default: 'en',
    type: String
  },
  prefix: {
    default: 'z!',
    type: String
  },
  logs: [{
    idWeb: String,
    tokenWeb: String,
    TYPE: String
  }],
  muterole: { type: String, default: '1' }
}, { timestamps: true });

export default mongoose.models.GuildInfo || model<GUILD>('GuildInfo', Guild);
