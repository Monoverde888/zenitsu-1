import mapaCanvas from '../../Utils/Functions/mapaCanvas.js';
import tresenraya from 'tresenraya';
import * as  light from '@lil_marcrock22/eris-light';
const users: Map<string, string> = new Map();
import Command from '../../Utils/Classes/command.js'
import run from '../../Utils/Interfaces/run.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
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

        if ((!miembro) ||/*( miembro.id == message.author.id) ||*/ (usuario.bot && miembro.id != client.user.id)) return embedResponse(langjson.commands.tictactoe.game, message.channel, client.color);

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

        partida.on('ganador', async (jugador, tablero) => {
            partidas.delete(message.guild.id);
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.tictactoe.win(users.get(jugador as string)) + `\n\n${tablero.string}`)
                .setImage('attachment://tictactoe.gif')

            client.listener.stop(code, 'NO');
            message.channel.createMessage({ embed }, [{ file: await mapaCanvas(tablero.array, client.imagenes, true), name: 'tictactoe.gif' }])
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        partida.on('empate', async (jugadores, tablero) => {
            partidas.delete(message.guild.id)
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.tictactoe.draw(users.get(jugadores[0]), users.get(jugadores[1])))
                .setImage('attachment://tictactoe.gif')

            client.listener.stop(code, 'NO');
            message.channel.createMessage({ embed }, [{ file: await mapaCanvas(tablero.array, client.imagenes, false), name: 'tictactoe.gif' }])
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        partida.on('finalizado', async (_jugadores, tablero) => {
            partidas.delete(message.guild.id)
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.tictactoe.game_over + `\n\n${tablero.string}`)
                .setImage('attachment://tictactoe.gif');

            client.listener.stop(code, 'NO');
            message.channel.createMessage({ embed }, [{ file: await mapaCanvas(tablero.array, client.imagenes, false), name: 'tictactoe.gif' }])
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        if (partida.turno.jugador != client.user.id) {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.tictactoe.start(partida.turno.ficha, users.get(partida.turno.jugador)) + `\n\n${partida.tablero.string}`)
                .setImage('attachment://tictactoe.gif');

            await message.channel.createMessage({ embed }, [{ file: await mapaCanvas(partida.tablero.array, client.imagenes, false), name: 'tictactoe.gif' }])
        }

        else {
            const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
            const jugada = disponibles[Math.floor(Math.random() * disponibles.length)];
            partida.elegir(jugada)
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.tictactoe.turn(users.get(partida.turno.jugador) + ` [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`))
                .setImage('attachment://tictactoe.gif');

            await message.channel.createMessage({ embed }, [{ file: await mapaCanvas(partida.tablero.array, client.imagenes, false), name: 'tictactoe.gif' }])
        }

        client.listener.add({
            channelID: message.channel.id,
            max: 0,
            code,
            filter(msg: light.Message) {
                return partida
                    && partida.jugadores.includes(msg.author.id)
                    && msg.author.id === partida.turno.jugador
                    && parseInt(msg.content)
                    && (Number(msg.content) >= 1
                        && Number(msg.content) <= 9)
                    && partida.disponible(parseInt(msg.content))
                    && !partida.finalizado
            },
            idle: Infinity,
            async onStop(_, r) {
                if (r != 'NO') !partida || partida.finalizado ? null : partida.emit('finalizado', partida.jugadores, partida.tablero, partida.paso)
            },
            async onCollect(msg, colector) {
                partida.elegir(parseInt(msg.content));

                if (partida.finalizado) {
                    client.listener.stop(colector, '');
                    return;
                }

                if (partida.turno.jugador != client.user.id) {
                    const embed = new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(langjson.commands.tictactoe.turn(users.get(partida.turno.jugador)) + ` [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`)
                        .setImage('attachment://tictactoe.gif');

                    await message.channel.createMessage({ embed }, [{ file: await mapaCanvas(partida.tablero.array, client.imagenes, false), name: 'tictactoe.gif' }]);
                }

                if (!partida.finalizado && partida.turno.jugador == client.user.id) {
                    const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
                    const jugada = disponibles[Math.floor(Math.random() * disponibles.length)]
                    partida.elegir(jugada)
                    if (!partida.finalizado) {
                        const embed = new MessageEmbed()
                            .setColor(client.color)
                            .setDescription(langjson.commands.tictactoe.turn(users.get(partida.turno.jugador)) + ` [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`)
                            .setImage('attachment://tictactoe.gif');

                        await message.channel.createMessage({ embed }, [{ file: await mapaCanvas(partida.tablero.array, client.imagenes, false), name: 'tictactoe.gif' }]);

                    }
                }
            },
            timeLimit: (10 * 60) * 1000
        });

        return true;

    }
}