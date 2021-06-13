import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Guild = new Schema({
    id: { type: String, unique: true },
    logs: [{
        idWeb: String,
        tokenWeb: String,
        TYPE: String
    }]
})

interface logs {
    idWeb: string;
    tokenWeb: string;
    TYPE: string;
}

export interface Logs extends mongoose.Document {
    id: string;
    logs: logs[]
}

export default model<Logs>('Logs', Guild)