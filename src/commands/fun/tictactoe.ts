import AI from 'ai-tic-tac-toe';
import tresenraya from 'tresenraya';
import * as light from '@lil_marcrock22/eris-light';
const users: Map<string, string> = new Map();
import Command from '../../Utils/Classes/command.js'
import run from '../../Utils/Interfaces/run.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import Button from '../../Utils/Buttons/Normal.js';
import Components from '../../Utils/Buttons/Component.js';
import { estilos } from '../../Utils/Buttons/types.js';
import Zenitsu from '../../Utils/Classes/client.js';

function AIplay(partida: tresenraya.partida) {
    return (AI.getmove(partida.tablero.array.map(item => item == '❌' ? 'x' : item == '⭕' ? 'o' : ''), partida.turno.ficha == '❌' ? 'x' : 'o')) + 1;
}

function resolveMarkdown(user: light.User, partida: tresenraya.partida) {

    return partida.turno.jugador == user.id ? `**${user.username}**` : user.username

}

function generateButtons(partida: tresenraya.partida, forceDisable = false, empate = '') {

    const res = [];

    for (const i in partida.tablero.array) {

        const but = partida.tablero.array[i]
        const check = ['❌', '⭕'].find(item => but == item);
        const number = parseInt(i) + 1;
        const colors: {
            [x: string]: estilos
        } = {
            '❌': 'danger',
            '⭕': 'primary'
        };

        const temp = new Button(colors[check] ? colors[check] : 'secondary')
            .setCustomID(`${number}`)
            .setDisabled(forceDisable || !!check)

        if (check) temp.setEmoji({ id: but == '❌' ? '849685084236021790' : '849685083967586304', name: but == '❌' ? 'x_tic' : 'o_tic' });
        else temp.setLabel('~')

        res.push(temp);

    }

    const buttons1 = res.slice(0, 3);
    const buttons2 = res.slice(3, 6);
    const buttons3 = res.slice(6);

    if (empate) buttons2.push(
        new Button('success')
            .setCustomID('repeat')
            .setEmoji({ name: '🔁', id: undefined })
            .setLabel('Revancha')
    );

    return [new Components(...buttons1), new Components(...buttons2), new Components(...buttons3)];

}

const partidas: Set<string> = new Set();

async function jugar(firstp: light.Member, secondp: light.Member, client: Zenitsu, channel: light.TextableChannel, run: run) {
    
    const { embedResponse, langjson } = run;

    if (partidas.has(firstp.guild.id))
        return embedResponse(langjson.commands.tictactoe.curso, channel, client.color);

    if (client.user.id != secondp.id) {
        embedResponse(langjson.commands.tictactoe.wait_user(secondp.username), channel, client.color);
    }

    const code = 'user:' + firstp.id + 'guild:' + firstp.guild.id + 'date:' + Date.now() + 'random:' + Math.random();
    const partida = new tresenraya.partida({ jugadores: [firstp.id, secondp.id] });

    partidas.add(firstp.guild.id);

    if (client.user.id != secondp.id) {
        const res: string | undefined = await new Promise(resolve => {
            client.listener.add({
                channelID: channel.id,
                max: 1,
                code: 'user:' + firstp.id + 'guild:' + firstp.guild.id + 'date:' + Date.now() + 'random:' + Math.random(),
                filter(m) {
                    return m.author.id == secondp.id && ['s', 'n'].some(item => item == m.content)
                },
                idle: ((1 * 60) * 1000) * 2,
                async onStop() {
                    resolve(undefined);
                },
                async onCollect(msg) {
                    resolve(msg.content);
                },
                timeLimit: (1 * 60) * 1000,
            });
        });

        const respuesta = res;

        if (!respuesta) {
            embedResponse(langjson.commands.tictactoe.dont_answer(secondp.username), channel, client.color)
            return partidas.delete(firstp.guild.id)
        }

        if (respuesta == 'n') {
            embedResponse(langjson.commands.tictactoe.deny(secondp.username), channel, client.color)
            return partidas.delete(firstp.guild.id)
        }
    }

    users.set(secondp.id, secondp.username)
    users.set(firstp.id, firstp.username)

    partida.jugadores = [firstp.id, secondp.id]

    partida.on('ganador', async (jugador) => {
        partidas.delete(firstp.guild.id);
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.tictactoe.win(users.get(jugador as string)))

        client.buttons.stop(code, 'NO');
        channel.createMessage({ embed, components: generateButtons(partida, true) })
        users.delete(firstp.id)
        users.delete(secondp.id)
    });

    partida.on('empate', async (jugadores) => {
        partidas.delete(firstp.guild.id)
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.tictactoe.draw(users.get(jugadores[0]), users.get(jugadores[1])))

        client.buttons.stop(code, 'NO');
        users.delete(firstp.id)
        users.delete(secondp.id)

        const empate = await channel.createMessage({ embed, components: generateButtons(partida, true, langjson.commands.tictactoe.rematch) })

        const res: false | light.ButtonInteraction = await new Promise(resolve => {
            client.buttons.add({
                messageID: empate.id,
                max: 1,
                code: 'user:' + firstp.id + 'guild:' + firstp.guild.id + 'date:' + Date.now() + 'random:' + Math.random(),
                filter(b) {
                    return (jugadores.includes(b.member.user.id) && b.customID == 'repeat');
                },
                idle: Infinity,
                async onStop() {
                    resolve(false);
                },
                async onCollect(b) {
                    resolve(b);
                },
                timeLimit: (1 * 30) * 1000,
            });
        });

        if (res) {
            const temp = [res.member.id != firstp.id ? secondp : firstp, res.member.id == firstp.id  ? secondp : firstp]
            return jugar(temp[0], temp[1], client, channel, run);
        }

    });

    partida.on('finalizado', async () => {
        partidas.delete(firstp.guild.id)
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setDescription(langjson.commands.tictactoe.game_over);

        client.buttons.stop(code, 'NO');
        channel.createMessage({ embed, components: generateButtons(partida, true) })
        users.delete(firstp.id)
        users.delete(secondp.id)
    });

    let msg: light.Message;

    if (partida.turno.jugador != client.user.id) {
        msg = await channel.createMessage({ content: `${resolveMarkdown(firstp.user, partida)} vs ${resolveMarkdown(secondp.user, partida)}\n\n${langjson.commands.tictactoe.start(partida.turno.jugador == firstp.id ? firstp.username : secondp.username, partida.turno.ficha)}`, components: generateButtons(partida) })
    }

    else {
        const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
        const jugada = AIplay(partida) || disponibles[Math.floor(Math.random() * disponibles.length)]
        partida.elegir(jugada)
        msg = await channel.createMessage({ content: `${resolveMarkdown(firstp.user, partida)} vs ${resolveMarkdown(secondp.user, partida)}`, components: generateButtons(partida) })
    }

    client.buttons.add({
        messageID: msg.id,
        max: 0,
        code,
        filter(button) {
            return partida
                && partida.jugadores.includes(button.member.id)
                && button.member.id === partida.turno.jugador
                && partida.disponible(parseInt(button.customID) || 1)
                && !partida.finalizado
        },
        idle: Infinity,
        async onStop(_, r) {
            if ((r != 'NO')) {
                return !partida || partida.finalizado ? null : partida.emit('finalizado', partida.jugadores, partida.tablero, partida.paso);
            }
        },
        async onCollect(button, colector) {

            const res = await button.defer().then(() => true).catch(() => false);

            if (!res) return res;

            partida.elegir(parseInt(button.customID));

            if (partida.finalizado) {
                client.buttons.stop(colector, '');
                return;
            }

            if (partida.turno.jugador != client.user.id) {
                await msg.edit({ content: `${resolveMarkdown(firstp.user, partida)} vs ${resolveMarkdown(secondp.user, partida)}`, components: generateButtons(partida) });
            }

            if (!partida.finalizado && partida.turno.jugador == client.user.id) {
                const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
                const jugada = AIplay(partida) || disponibles[Math.floor(Math.random() * disponibles.length)]
                partida.elegir(jugada)
                if (!partida.finalizado) {

                    await msg.edit({ content: `${resolveMarkdown(firstp.user, partida)} vs ${resolveMarkdown(secondp.user, partida)}`, components: generateButtons(partida) });

                }
            }
        },
        timeLimit: (10 * 60) * 1000
    });

    return true;

}

export default class Comando extends Command {
    constructor() {
        super();
        this.name = "tictactoe";
        this.alias = ['ttt', 'tresenraya'];
        this.category = 'fun';
        this.botPermissions.channel = ['attachFiles'];
    }
    async run(RUN: run): Promise<light.Message | boolean> {

        const { message, client, langjson, embedResponse } = RUN;
        const usuario = message.mentions[0];
        const miembro = usuario?.member;
        
        if ((!miembro) || (miembro.id == message.author.id) || (usuario.bot && miembro.id != client.user.id))
            return embedResponse(langjson.commands.tictactoe.game, message.channel, client.color);

        return jugar(message.member, miembro, client, message.channel, RUN);

    }
}