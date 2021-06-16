import mongoose from 'mongoose';
const { Schema, model } = mongoose;

export interface Connect4Map extends mongoose.Document {
  maps: [number, number, string][]
  users: string[];
  dif: string;
}

const Guild = new Schema({
  maps: {
    type: Array,
    default: []
  },
  users: {
    type: Array,
    default: []
  },
  dif: String
});

export default model<Connect4Map>('c4maps', Guild);
