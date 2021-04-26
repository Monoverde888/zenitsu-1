import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Guild = new Schema({
    id: String,
    logs: [{
        idWeb: String,
        tokenWeb: String,
        type: String
    }]
})

interface logs {
    idWeb: string;
    tokenWeb: string;
    type: string;
}

interface Logs extends mongoose.Document {
    id: string;
    logs: logs[]
}

export default model<Logs>('Logs', Guild)