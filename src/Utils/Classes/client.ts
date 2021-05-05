import light from 'discord.js-light';
const { Client, Collection, MessageEmbed } = light;
import Command from './command.js'
//import musicmodel from '../../models/music.js';
import dbla from 'dblapi.js'
import fs from 'fs/promises';
const { readdir } = fs;
import path from 'path';
const { join } = path;
import canvas from 'canvas';
const { loadImage } = canvas;
import mongoose from 'mongoose';
const { connection } = mongoose;
import AfkManager from "./afkManager.js";
import PrefixManager from './prefixManager.js';
import LogsManager from './logsManager.js';
import LangManager from './langManager.js';
import Distube from 'distube';
import modelLang from '../../models/lang.js';
import imagenesC from "../Interfaces/imagenes.js";
import axios from 'axios';
import common from '../Functions/commons.js';
const res = common(import.meta.url);
const __dirname: string = res.__dirname;
import nekos from 'nekos.life';
import spotify from '@distube/spotify'
//import lenguajes from '../Lang/langs.js'
interface potasio {
    id: string,
    type: number,
    content: string,
    channel_id: string,
    pinned: boolean,
    mention_everyone: boolean,
    tts: boolean,
    timestamp: string,
    edited_timestamp: string,
    flags: number,
    webhook_id: string
}

class Zenitsu extends Client {
    commands: light.Collection<string, Command>;
    dbl: dbla;
    imagenes: imagenesC | undefined;
    kaomojis: string[];
    devs: string[];
    prefix: PrefixManager;
    color: string;
    lang: LangManager
    afk: AfkManager;
    music: Distube;
    nekos: nekos;
    logs: LogsManager

    constructor(args: light.ClientOptions) {
        super(args);
        this.init()
    }

    editWebhookMessage({ token, id, data, messageID }: {
        token: string, id: string, data: {
            content: string,
            embeds: { description: string }[]
        }, messageID: string
    }): Promise<potasio> {
        return axios({
            method: 'patch',
            url: `https://discord.com/api/v8/webhooks/${id}/${token}/messages/${messageID}`,
            data
        }).then(({ data }) => data)
    }

    async init(): Promise<boolean> {
        await this.login();
        await this.loadEvents('discord');
        await this.loadEvents('distube');
        await this.loadCommands();
        await this.loadImages().catch((e) => console.log(e.message));
        this.dbl = new dbla(process.env.DBLTOKEN, this);
        this.music = new Distube(this, {
            leaveOnFinish: true,
            leaveOnStop: true,
            youtubeCookie: process.env.YOUTUBE_COOKIE,
            plugins: [new spotify({ parallel: true })]
        });
        this.lang = new LangManager();
        this.prefix = new PrefixManager();
        this.afk = new AfkManager();
        this.logs = new LogsManager();
        this.color = '#E09E36';
        this.commands = new Collection();
        this.nekos = new nekos();
        this.devs = [
            '507367752391196682', // Lil MARCROCK22
            '577000793094488085', // AndreMor
            '390726024536653865', // zPablo 鯉
        ];

        return true;

    }

    /*async updateMusic(guildID: string): Promise<void> {

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

        const mensaje = (canal as light.TextChannel).messages.cache.get(message) || await (canal as light.TextChannel).messages.fetch(message).catch(() => undefined).then(e => e);

        if (!mensaje) {
            await model.deleteOne({ guild, channel, message });
            throw new Error('Invalid message.');
        }

        const lang = await this.getLang(guildID);

        const queue = this.music.getQueue(guild);

        const datazo = lenguajes[lang]

        if (!queue) {
            const embedN = new MessageEmbed()

                .setDescription(datazo.music.music_request)
                .setImage(`https://cdn.discordapp.com/attachments/804318974086610954/825021359532015636/standard.gif`);

            mensaje.edit({
                content: datazo.music.no_queue, embed: embedN
            })

            return;
        }

        const actualSong = queue.songs[0];

        const embed = new MessageEmbed()
            .setColor('RANDOM')
            .setDescription(datazo.music.read_topic);

        const texto = datazo.music.nowplaying(actualSong.isLive ? datazo.music.live.toUpperCase() : actualSong.formattedDuration == '00:00' ? '??:??' : actualSong.formattedDuration, actualSong.name)

        embed.setAuthor(texto, `https://cdn.discordapp.com/emojis/804368852388806686.png?v=1`)

        if (actualSong.thumbnail) {
            embed.setImage(actualSong.thumbnail)
        }

        embed.setFooter(actualSong.user.tag, actualSong.user.displayAvatarURL({ dynamic: true, size: 2048 }))

        const { songs } = queue;

        const res = songs.slice(1).map((item, i) => {

            return `[${i + 1}] ${item.name} - ${item.isLive ? datazo.music.live : item.formattedDuration == '00:00' ? '??:??' : item.formattedDuration}`;

        });

        const text = datazo.music.queue(palaqueue(res, 1900))

        const totalRes = res.length ? text : datazo.music.no_queue

        const modos: string[] = datazo.music.queue_modes,
            loopMode = datazo.music.loop_mode,
            songsinqueue = datazo.music.songs_in_queue,
            autoplay = datazo.music.autoplay,
            yes = datazo.music.yes,
            no = datazo.music.no

        embed.addField(loopMode, modos[queue.repeatMode])
        embed.addField(songsinqueue, res.length)
        embed.addField(autoplay, queue.autoplay ? yes : no)

        mensaje.edit({ content: totalRes, embed })
    }*/

    async getLang(id: string): Promise<"es" | "en"> {

        const res = await modelLang.findOne({ id });
        return res?.lang || 'es';

    }

    async sendEmbed(object: {
        fields?: string[][];
        description?: string;
        imageURL?: string;
        footerLink?: string;
        footerText?: string
        color?: string | number
        channel: light.TextChannel | light.DMChannel | light.NewsChannel
        title?: string
        thumbnailURL?: string;
        authorURL?: string;
        authorText?: string;
        authorLink?: string;
        titleURL?: string;
        attachFiles?: light.FileOptions[] | string[] | light.MessageAttachment[] | light.FileOptions | string | light.MessageAttachment
    }, options: { timestamp: boolean } = { timestamp: true }): Promise<light.Message> {

        const embed = new MessageEmbed()

        const { titleURL, attachFiles, fields, description, imageURL, footerLink, footerText, color, channel, title, thumbnailURL, authorURL, authorText, authorLink } = object;

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

    }

    async loadCommands(): Promise<Zenitsu> {

        const ruta = (...str: string[]) => join(__dirname, '..', '..', ...str)
        const load = async (dirs: string) => {
            const commands = (await readdir(ruta('commands', dirs))).filter(d => {
                return d.endsWith('.ts') || d.endsWith('.js');
            });
            for (const file of commands) {
                try {
                    const { default: archivo } = await import(`file:///` + ruta('commands', dirs, file));
                    const instance = new archivo();
                    if (this.commands.has(instance.name)) {

                        console.warn(`${instance.name} ya existe.`)

                        continue;
                    }

                    this.commands.set(instance.name, instance);
                } catch (e) {
                    console.log(e, file);
                    break;
                }
            }
        };

        const categorys = await readdir(ruta('commands'))

        for (const i of categorys) {

            await load(i);

        }

        return this;

    }

    async loadEvents(typee: 'distube' | 'discord'): Promise<Zenitsu> {

        const ruta = (...str: string[]) => join(__dirname, '..', '..', ...str)
        const load = async (event: string) => {

            const { default: a } = await import(`file:///` + ruta('events', typee, event))

            try {

                if (typee == 'distube') {
                    this.music.on((event.split('.')[0] as 'playSong'), a.bind(null, this));//pnche ts xdxd
                }

                else this.on(event.split('.')[0], a.bind(null, this));

            }
            catch (e) {
                console.log(event, e.message || e, typee);
            }

        };

        const eventos = await readdir(ruta('events', typee))

        for (const i of eventos) {

            await load(i);

        }

        return this;

    }

    async loadImages(): Promise<imagenesC> {
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

    setPresence(text: string, type: light.ActivityType): light.Presence {
        return this.user.setPresence({
            status: "idle",
            activities: [{
                name: text,
                type: type
            }],
            shardID: this.shard.ids
        });
    }

    get private(): string[] {

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
        ].filter(item => item);

    }

}

export default Zenitsu;

/*function palaqueue(array: string[], max = 2000) {

    let str = '',
        ministr = '',
        res = '';
    for (const i of array) {

        ministr = `${ministr ? ministr + '\n' : ''}${i}`
        if (ministr.length >= max) {
            res = str;
            break;
        }
        str = `${str ? str + '\n' : ''}${i}`
        res = str
    }
    return res.split('\n').reverse().join('\n')

}*/