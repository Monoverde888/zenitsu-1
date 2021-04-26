/*

import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const Guild = new Schema({
    idGuild: String,
    idMember: String,
    warns: [{
        fecha: String,
        mod: String,
        razon: String,
        token: String
    }]
});

interface Warns extends mongoose.Document {
    id: string;
    description: string;
    insignias: string[];
    img: string;
    thumbnail: string;
    footer: string;
    footertext: string;
    color: string;
    nick: string;
}

export default model<Warns>('profile', Guild)

*/