import { Schema, model, Document } from 'mongoose'

const Guild = new Schema({
    id: String,
    description: {
        type: String,
        default: 'NONE.'
    },

    insignias: {
        type: Array,
        default: []
    },

    img: {
        type: String,
        default: 'https://cdn.discordapp.com/attachments/758009020526362715/766329070035402763/kimetsu-no-yaiba-romance-tanjiro-kanao.png'
    },

    thumbnail: {
        type: String,
        default: 'https://cdn.discordapp.com/attachments/758009020526362715/766329070035402763/kimetsu-no-yaiba-romance-tanjiro-kanao.png'
    },

    footer: {
        type: String,
        default: 'https://cdn.discordapp.com/attachments/758009020526362715/766329070035402763/kimetsu-no-yaiba-romance-tanjiro-kanao.png'
    },

    footertext: {
        type: String,
        default: 'NONE.'
    },

    color: {
        type: String,
        default: '#E09E36'
    },

    nick: {
        type: String,
        default: 'NONE.'
    },

});

interface Profile extends Document {
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

export default model<Profile>('profile', Guild)