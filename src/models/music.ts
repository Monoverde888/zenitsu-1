import { Schema, model, Document } from 'mongoose'

const Guild = new Schema({
    message: String,
    guild: String,
    channel: String
})

interface Music extends Document {
    message: string
    guild: string
    channel: string
}

export default model<Music>('Music', Guild)