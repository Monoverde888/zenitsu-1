import { Schema, model, Document } from 'mongoose'

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
    type: 'messages' | 'members';
}

interface Logs extends Document {
    id: string;
    logs: logs[]
}

export default model<Logs>('Logs', Guild)