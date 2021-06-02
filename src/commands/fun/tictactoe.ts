import tresenraya from 'tresenraya';
import Eris, * as  light from '@lil_marcrock22/eris-light';
const users: Map<string, string> = new Map();
import Command from '../../Utils/Classes/command.js'
import run from '../../Utils/Interfaces/run.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import Button from '../../Utils/Buttons/Normal.js';
import Components from '../../Utils/Buttons/Component.js';

function resolveMarkdown(user: Eris.User, partida: tresenraya.partida) {

    return partida.turno.jugador == user.id ? `**${user.username}**` : user.username

}

function generateButtons(partida: tresenraya.partida, forceDisable = false) {

    const res = [];

    for (const i in partida.tablero.array) {

        const but = partida.tablero.array[i]
        const check = ['❌', '⭕'].some(item => but == item);
        const number = parseInt(i) + 1;

        const temp = new Button(check ? 'danger' : 'primary')
            .setCustomID(`${number}`)
            .setDisabled(forceDisable || check)
            .setLabel(`${number}`);

        if (check)
            temp.setEmoji({ id: but == '❌' ? '849685084236021790' : '849685083967586304', name: but == '❌' ? 'x_tic' : 'o_tic' });

        res.push(temp);

    }

    const buttons1 = res.slice(0, 3);
    const buttons2 = res.slice(3, 6);
    const buttons3 = res.slice(6);

    return [new Components(...buttons1), new Components(...buttons2), new Components(...buttons3)];

}

const partidas: Set<string> = new Set();

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "tictactoe";
        this.alias = ['ttt', 'tresenraya'];
        this.category = 'fun';
        this.botPermissions.channel = ['attachFiles'];
    }
    async run({ message, client, langjson, embedResponse }: run): Promise<light.Message | boolean> {

        const usuario = message.mentions[0];
        const miembro = usuario?.member;

        if ((!miembro) || (miembro.id == message.author.id) || (usuario.bot && miembro.id != client.user.id)) return embedResponse(langjson.commands.tictactoe.game, message.channel, client.color);

        if (partidas.has(message.guild.id))
            return embedResponse(langjson.commands.tictactoe.curso, message.channel, client.color);

        if (client.user.id != usuario.id) {
            embedResponse(langjson.commands.tictactoe.wait_user(usuario.username), message.channel, client.color);
        }

        const code = 'user:' + message.author.id + 'guild:' + message.guild.id + 'date:' + Date.now() + 'random:' + Math.random();
        const partida = new tresenraya.partida({ jugadores: [message.author.id, usuario.id] });

        partidas.add(message.guild.id);

        if (client.user.id != usuario.id) {
            const res: string | undefined = await new Promise(resolve => {
                client.listener.add({
                    channelID: message.channel.id,
                    max: 1,
                    code: 'user:' + message.author.id + 'guild:' + message.guild.id + 'date:' + Date.now() + 'random:' + Math.random(),
                    filter(m) {
                        return m.author.id == usuario.id && ['s', 'n'].some(item => item == m.content)
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
                embedResponse(langjson.commands.tictactoe.dont_answer(usuario.username), message.channel, client.color)
                return partidas.delete(message.guild.id)
            }

            if (respuesta == 'n') {
                embedResponse(langjson.commands.tictactoe.deny(usuario.username), message.channel, client.color)
                return partidas.delete(message.guild.id)
            }
        }

        users.set(usuario.id, usuario.username)
        users.set(message.author.id, message.author.username)

        partida.jugadores = [message.author.id, usuario.id]

        partida.on('ganador', async (jugador) => {
            partidas.delete(message.guild.id);
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.tictactoe.win(users.get(jugador as string)))

            client.buttons.stop(code, 'NO');
            message.channel.createMessage({ embed, components: generateButtons(partida, true) })
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        partida.on('empate', async (jugadores) => {
            partidas.delete(message.guild.id)
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.tictactoe.draw(users.get(jugadores[0]), users.get(jugadores[1])))

            client.buttons.stop(code, 'NO');
            message.channel.createMessage({ embed, components: generateButtons(partida, true) })
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        partida.on('finalizado', async () => {
            partidas.delete(message.guild.id)
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.tictactoe.game_over)

            client.buttons.stop(code, 'NO');
            message.channel.createMessage({ embed, components: generateButtons(partida, true) })
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        let msg: Eris.Message;

        if (partida.turno.jugador != client.user.id) {
            msg = await message.channel.createMessage({ content: `${resolveMarkdown(message.author, partida)} vs ${resolveMarkdown(usuario, partida)}\n\n${langjson.commands.tictactoe.start(partida.turno.jugador == message.author.id ? message.author.username : usuario.username, partida.turno.ficha)}`, components: generateButtons(partida) })
        }

        else {
            const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
            const jugada = disponibles[Math.floor(Math.random() * disponibles.length)];
            partida.elegir(jugada)
            msg = await message.channel.createMessage({ content: `${resolveMarkdown(message.author, partida)} vs ${resolveMarkdown(usuario, partida)}`, components: generateButtons(partida) })
        }

        client.buttons.add({
            messageID: msg.id,
            max: 0,
            code,
            filter(button) {
                return partida
                    && partida.jugadores.includes(button.member.id)
                    && button.member.id === partida.turno.jugador
                    && partida.disponible(parseInt(button.customID))
                    && !partida.finalizado
            },
            idle: Infinity,
            async onStop(_, r) {
                if ((r != 'NO')) {
                    return !partida || partida.finalizado ? null : partida.emit('finalizado', partida.jugadores, partida.tablero, partida.paso)
                }
            },
            async onCollect(button, colector) {

                button.defer();
                partida.elegir(parseInt(button.customID));

                if (partida.finalizado) {
                    client.buttons.stop(colector, '');
                    return;
                }

                if (partida.turno.jugador != client.user.id) {
                    await msg.edit({ content: `${resolveMarkdown(message.author, partida)} vs ${resolveMarkdown(usuario, partida)}`, components: generateButtons(partida) });
                }

                if (!partida.finalizado && partida.turno.jugador == client.user.id) {
                    const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
                    const jugada = disponibles[Math.floor(Math.random() * disponibles.length)]
                    partida.elegir(jugada)
                    if (!partida.finalizado) {

                        await msg.edit({ content: `${resolveMarkdown(message.author, partida)} vs ${resolveMarkdown(usuario, partida)}`, components: generateButtons(partida) });

                    }
                }
            },
            timeLimit: (10 * 60) * 1000
        });

        return true;

    }
}