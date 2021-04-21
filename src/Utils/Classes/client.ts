import { Client, APIMessage, Message, Collection, MessageEmbed, TextChannel, FileOptions, MessageAttachment, ClientOptions, DMChannel, NewsChannel } from "discord.js-light";
import Command from './command'
import musicmodel from '../../models/music';
import dbla from 'dblapi.js'
import { readdir } from 'fs/promises';
import { join } from 'path';
import { loadImage } from 'canvas'
import { connection } from 'mongoose';
import * as lenguaje from '../lang.json'
import AfkManager from "./afkManager";
import PrefixManager from './prefixManager';
import LangManager from './langManager';
import Distube from 'distube';
import modelLang from '../../models/lang';
import imagenesC from "../Interfaces/imagenes";
import axios from 'axios'

class Cliente extends Client {
    commands: Collection<string, Command>;
    dbl: dbla;
    imagenes: imagenesC | undefined;
    kaomojis: string[];
    devs: string[];
    prefix: PrefixManager;
    color: string;
    lang: LangManager
    afk: AfkManager;
    music: Distube;

    constructor(args: ClientOptions) {
        super(args);
        this.login();
        this.loadEvents('discord');
        this.loadEvents('distube');
        this.loadCommands();
        this.loadImages().catch((e) => console.log(e.message));
        this.music = new Distube(this, {
            leaveOnFinish: true
        });
        this.lang = new LangManager(this);
        this.prefix = new PrefixManager(this);
        this.afk = new AfkManager(this);
        this.color = '#E09E36';
        this.commands = new Collection();
        this.kaomojis = ['(* ^ ω ^)', '(o^▽^o)', 'ヽ(・∀・)ﾉ', '(o･ω･o)', '( ´ ω ` )', '╰(▔∀▔)╯', '(✯◡✯)', '(⌒‿⌒)', 'ヽ(>∀<☆)ノ', '＼(￣▽￣)／', '(╯✧▽✧)╯', '(⁀ᗢ⁀)', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', 'ヽ(*⌒▽⌒*)ﾉ', '☆*:.｡.o(≧▽≦)o.｡.:*☆', '(๑˃ᴗ˂)ﻭ', '(b ᵔ▽ᵔ)b', '(⌒ω⌒)', '(´ ∀ ` *)', '(─‿‿─)'];
        this.devs = [
            '507367752391196682', // Lil MARCROCK22
            '577000793094488085', // AndreMor
            '366779196975874049', // Socram09
            '390726024536653865' // zPablo 鯉
        ];

    };

    editWebhookMessage({ token, id, data, messageID }: { token: string, id: string, data: any, messageID: string }) {
        return axios({
            method: 'patch',
            url: `https://discord.com/api/v8/webhooks/${id}/${token}/messages/${messageID}`,
            data
        }).then(({ data }) => data)
    }

    async updateMusic(guildID: string) {

        const model = musicmodel;

        const data = await model.findOne({ guild: guildID });

        if (!data) throw new Error('No data.')

        const { guild, channel, message } = data,
            server = this.guilds.cache.get(guild);

        if (!server) {
            await model.deleteOne({ guild, channel, message });
            throw new Error('Invalid server.');
        }

        const canal = server.channels.cache.get(channel);

        if (!canal) {
            await model.deleteOne({ guild, channel, message });
            throw new Error('Invalid channel.');
        }

        const mensaje = (canal as TextChannel).messages.cache.get(message) || await (canal as TextChannel).messages.fetch(message).catch(() => { }).then(e => e);

        if (!mensaje) {
            await model.deleteOne({ guild, channel, message });
            throw new Error('Invalid message.');
        }

        const lang = await this.getLang(guildID);

        const queue = this.music.getQueue(guild);

        if (!queue) {
            let embedN = new MessageEmbed()
                .setDescription(lenguaje.music[lang + '_music_request'])
                .setImage(`https://cdn.discordapp.com/attachments/804318974086610954/825021359532015636/standard.gif`);

            mensaje.edit({
                content: lenguaje.music[lang + '_no_queue'], embed: embedN
            })

            return;
        }

        const actualSong = queue.songs[0];

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(lenguaje.music[lang + '_read_topic']);

        embed.setAuthor(lenguaje.music[lang + '_nowplaying'].replace('{DURATION}', actualSong.isLive ? lenguaje.music[lang + '_live'].toUpperCase() : actualSong.formattedDuration == '00:00' ? '??:??' : actualSong.formattedDuration).replace('{SONG_NAME}', actualSong.name), `https://cdn.discordapp.com/emojis/804368852388806686.png?v=1`)

        if (actualSong.youtube && actualSong.thumbnail) {
            embed.setImage(actualSong.thumbnail)
        }

        embed.setFooter(actualSong.user.tag, actualSong.user.displayAvatarURL({ dynamic: true, size: 2048 }))

        let { songs } = queue;

        let res = songs.slice(1).map((item, i) => {

            return `[${i + 1}] ${item.name} - ${item.isLive ? lenguaje.music[lang + '_live'] : item.formattedDuration == '00:00' ? '??:??' : item.formattedDuration}`;

        });

        const text = lenguaje.music[lang + '_queue']

        let totalRes = res.length ? text.replace('{TEXT}', palaqueue(res, 1900)) : lenguaje.music[lang + '_no_queue']

        const modos: string[] = lenguaje.music[lang + '_queue_modes'],
            loopMode = lenguaje.music[lang + '_loop_mode'],
            songsinqueue = lenguaje.music[lang + '_songs_in_queue'],
            autoplay = lenguaje.music[lang + '_autoplay'],
            yes = lenguaje.music[lang + '_yes'],
            no = lenguaje.music[lang + '_no']

        embed.addField(loopMode, modos[queue.repeatMode])
        embed.addField(songsinqueue, res.length)
        embed.addField(autoplay, queue.autoplay ? yes : no)

        mensaje.edit({ content: totalRes, embed })
    }

    async getLang(id: string) {

        const res = await modelLang.findOne({ id });
        return res?.lang || 'es';

    }

    sendEmbed(object: {
        fields?: string[][];
        description?: string;
        imageURL?: string;
        footerLink?: string;
        footerText?: string
        color?: string | number
        channel: TextChannel | DMChannel | NewsChannel
        title?: string
        thumbnailURL?: string;
        authorURL?: string;
        authorText?: string;
        authorLink?: string;
        titleURL?: string;
        attachFiles?: FileOptions[] | string[] | MessageAttachment[] | FileOptions | string | MessageAttachment
    }, options: { timestamp: boolean } = { timestamp: true }): Promise<Message> | undefined {

        let embed = new MessageEmbed()

        let { titleURL, attachFiles, fields, description, imageURL, footerLink, footerText, color, channel, title, thumbnailURL, authorURL, authorText, authorLink } = object;

        fields && fields.length ? fields.map(a => embed.addField(a[0], a[1], a[2] ? true : false)) : false
        if (description) embed.setDescription(description)
        if (imageURL) embed.setImage(imageURL);
        if (thumbnailURL) embed.setThumbnail(thumbnailURL)
        if (footerLink && footerText) embed.setFooter(footerText, footerLink)
        else {
            if (footerText) embed.setFooter(footerText)
            if (footerLink) embed.setFooter('\u200b', footerLink)
        }
        if (authorText && authorLink && authorURL) embed.setAuthor(authorText, authorLink, authorURL)
        else if (authorText && authorLink) embed.setAuthor(authorText, authorLink)
        if (titleURL) embed.setURL(titleURL)
        embed.setColor(color || this.color)
        if (title) embed.setTitle(title)
        if (options.timestamp) embed.setTimestamp()
        if (attachFiles) embed.attachFiles(Array.isArray(attachFiles) ? attachFiles : [attachFiles])
        if (!channel || !channel.send) throw new Error('No es un canal valido.');
        return channel.send({ embed: embed });

    }

    unMarkdown(texto: string): string {

        return texto.split('*').join(`\\*`).split('`').join("\\`").split('~').join(`\\~`).split('_').join(`\\_`).split('|').join(`\\|`);

    };

    async loadCommands() {

        let ruta = (...str: string[]) => join(__dirname, '..', '..', ...str)
        const load = async (dirs: string) => {
            const commands = (await readdir(ruta('commands', dirs))).filter(d => {
                return d.endsWith('.ts') || d.endsWith('.js');
            });
            for (let file of commands) {
                try {
                    let archivo = require(ruta('commands', dirs, file)).default;
                    let instance = new archivo();

                    if (this.commands.has(instance.name)) {

                        console.warn(`${instance.name} ya existe.`)

                        continue;
                    }

                    this.commands.set(instance.name, instance);
                } catch (e) {
                    console.log(e, file)
                }
            }
        };

        const categorys = await readdir(ruta('commands'))

        for (let i of categorys) {

            await load(i);

        }

        return this;

    }

    async loadEvents(typee: 'distube' | 'discord') {

        let ruta = (...str: string[]) => join(__dirname, '..', '..', ...str)
        const load = async (event) => {

            const { default: a } = require(ruta('events', typee, event))

            try {

                if (typee == 'distube') {
                    this.music.on(event.split('.')[0], a.bind(null, this));
                }

                else this.on(event.split('.')[0], a.bind(null, this));

            }
            catch (e) {
                console.log(event, e.message || e, typee);
            }

        };

        const eventos = await readdir(ruta('events', typee))

        for (let i of eventos) {

            await load(i);

        }

        return this;

    }

    async loadImages() {
        this.imagenes = {
            porquelloras: {
                chica: await loadImage(this.rutaImagen(`chica.png`)),
                chico: await loadImage(this.rutaImagen('chico.jpg'))
            },
            nicememe: {
                background: await loadImage(this.rutaImagen('nicememe.png'))
            },
            tictactoe: {
                background: await loadImage(this.rutaImagen(`inicio_tictactoe.gif`)),
                equis: await loadImage(this.rutaImagen(`x_tic.png`)),
                circulo: await loadImage(this.rutaImagen(`o_tic.png`))
            },
            connect4: {
                background: await loadImage(this.rutaImagen('4enraya.png')),
                win: await loadImage(this.rutaImagen('morado_de_4.png')),
                verde: await loadImage(this.rutaImagen('rojo_de_cuatro.png')),
                amarillo: await loadImage(this.rutaImagen('amarillo_de_cuatro.png'))
            }
        }
        return this.imagenes;

    }

    rutaImagen(str: string): string {
        return join(__dirname, '..', '..', '..', 'Images', str)
    }

    setPresence() {
        return this.user.setPresence({
            status: "idle",
            activity: {
                name: "z!suggest | " + this.guilds.cache.size + " servidores",
                type: "WATCHING"
            }
        });
    }

    get private() {

        return [
            this.token,
            process.env.DBLTOKEN,
            process.env.MONGODB,
            process.env.PASSWORD,
            process.env.PASSWORDDBL,
            process.env.WEBHOOKID,
            process.env.WEBHOOKTOKEN,
            connection.pass,
            connection.user,
            connection.host
        ];

    }

};

export default Cliente;

function palaqueue(array: string[], max: number = 2000) {

    array = array;

    let str = '',
        ministr = '',
        res = '';
    for (let i of array) {

        ministr = `${ministr ? ministr + '\n' : ''}${i}`
        if (ministr.length >= max) {
            res = str;
            break;
        }
        str = `${str ? str + '\n' : ''}${i}`
        res = str
    }
    return res.split('\n').reverse().join('\n')

}