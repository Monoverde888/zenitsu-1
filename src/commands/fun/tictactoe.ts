import mapaCanvas from '../../Utils/Functions/mapaCanvas.js';
import awaitMessage from '../../Utils/Functions/awaitMessage.js';
import tresenraya from 'tresenraya';
import light from 'discord.js-light';
const { MessageAttachment } = light;
const users: Map<string, string> = new Map();
import Command from '../../Utils/Classes/command.js'
import run from '../../Utils/Interfaces/run.js';
const partidas: Set<string> = new Set();
export default class Comando extends Command {
    constructor() {
        super()
        this.name = "tictactoe"
        this.alias = ['ttt', 'tresenraya']
        this.category = 'fun'
        this.botPermissions.channel = ['ATTACH_FILES']
    }
    async run({ message, client, langjson }: run): Promise<light.Message | boolean> {

        const miembro = message.mentions.members.first()

        if (!miembro || miembro.id == message.author.id || (miembro.user.bot && miembro.id != client.user.id)) return client.sendEmbed({
            channel: message.channel,
            description: langjson.commands.tictactoe.game
        });

        const usuario = miembro.user;

        if (partidas.has(message.guild.id))
            return client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe.curso
            })

        if (client.user.id != usuario.id) {
            client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe.wait_user(usuario.username)
            });
        }

        const partida = new tresenraya.partida({ jugadores: [message.author.id, usuario.id] });
        partidas.add(message.guild.id)

        let respuesta: light.Collection<string, light.Message> | void;

        if (client.user.id != usuario.id) {
            respuesta = await awaitMessage({ channel: message.channel, filter: (m: light.Message) => m.author.id == usuario.id && ['s', 'n'].some(item => item == m.content), time: (1 * 60) * 1000, max: 1 }).catch(() => undefined)

            if (!respuesta || !respuesta?.first()) {
                client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.tictactoe.dont_answer(usuario.username)
                })
                return partidas.delete(message.guild.id)
            }

            if (respuesta.first().content == 'n') {
                client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.tictactoe.deny(usuario.username)
                })
                return partidas.delete(message.guild.id)
            }
        }

        users.set(usuario.id, usuario.username)
        users.set(message.author.id, message.author.username)

        partida.on('ganador', async (jugador, tablero) => {
            partidas.delete(message.guild.id)
            client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe.win(users.get(jugador as string)) + `\n\n${tablero.string}`,
                attachFiles: new MessageAttachment(await mapaCanvas(tablero.array, client.imagenes, true), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        partida.on('empate', async (jugadores, tablero) => {
            partidas.delete(message.guild.id)
            client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe.draw(users.get(jugadores[0]), users.get(jugadores[1])),
                attachFiles: new MessageAttachment(await mapaCanvas(tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        partida.on('finalizado', async (_jugadores, tablero) => {
            partidas.delete(message.guild.id)
            client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe.game_over + `\n\n${tablero.string}`,
                attachFiles: new MessageAttachment(await mapaCanvas(tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        if (partida.turno.jugador != client.user.id)
            await client.sendEmbed({
                description: langjson.commands.tictactoe.start(partida.turno.ficha, users.get(partida.turno.jugador)) + `\n\n${partida.tablero.string}`,
                channel: message.channel,
                attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });

        if (partida.turno.jugador == client.user.id) {
            const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
            const jugada = disponibles[Math.floor(Math.random() * disponibles.length)];
            partida.elegir(jugada)
            await client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe.turn(users.get(partida.turno.jugador) + ` [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`),
                attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            })
        }

        const colector = message.channel.createMessageCollector((msg: light.Message) => msg.author.id === partida.turno.jugador && parseInt(msg.content) && (Number(msg.content) >= 1 && Number(msg.content) <= 9) && partida.disponible(parseInt(msg.content)) && !partida.finalizado, { time: (10 * 60) * 1000 });

        colector.on('collect', async (msg) => {
            partida.elegir(msg.content);
            if (partida.finalizado) {
                colector.stop();
                return;
            }

            if (partida.turno.jugador != client.user.id)
                await client.sendEmbed({
                    channel: msg.channel,
                    description: langjson.commands.tictactoe.turn(users.get(partida.turno.jugador)) + ` [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`,
                    attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
                    imageURL: 'attachment://tictactoe.gif'
                })

            if (!partida.finalizado && partida.turno.jugador == client.user.id) {
                const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
                const jugada = disponibles[Math.floor(Math.random() * disponibles.length)]
                partida.elegir(jugada)
                if (!partida.finalizado) {
                    await client.sendEmbed({
                        channel: msg.channel,
                        description: langjson.commands.tictactoe.turn(users.get(partida.turno.jugador)) + ` [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`,
                        attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
                        imageURL: 'attachment://tictactoe.gif'
                    })
                }
            }

        });
        colector.on('end', () => !partida || partida.finalizado ? null : partida.emit('finalizado', partida.jugadores, partida.tablero, partida.paso))
        return true;
    }
}