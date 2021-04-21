import mapaCanvas from '../../Utils/Functions/mapaCanvas';
import awaitMessage from '../../Utils/Functions/awaitMessage';
import tresenraya from 'tresenraya';
import { MessageAttachment, Message, Collection } from 'discord.js-light'
const users: Map<string, string> = new Map();
import Command from '../../Utils/Classes/command'
import run from '../../Utils/Interfaces/run';
const partidas: Set<string> = new Set();
export default class Comando extends Command {
    constructor() {
        super()
        this.name = "tictactoe"
        this.alias = ['ttt', 'tresenraya']
        this.category = 'diversion'
    }
    async run({ message, client, lang, langjson }: run) {

        const miembro = message.mentions.members.first()

        if (!miembro || miembro.id == message.author.id || (miembro.user.bot && miembro.id != client.user.id)) return client.sendEmbed({
            channel: message.channel,
            description: langjson.commands.tictactoe[lang + '_game']
        });

        const usuario = miembro.user;

        if (partidas.has(message.guild.id))
            return client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe[lang + '_curso']
            })

        if (client.user.id != usuario.id) {
            client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe[lang + '_wait_user'].replace('{USER}', usuario.username)
            });
        }

        const partida = new tresenraya.partida({ jugadores: [message.author.id, usuario.id] });
        partidas.add(message.guild.id)

        let respuesta: Collection<string, Message> | void;

        if (client.user.id != usuario.id) {
            respuesta = await awaitMessage({ channel: message.channel, filter: (m) => m.author.id == usuario.id && ['s', 'n'].some(item => item == m.content), time: (1 * 60) * 1000, max: 1 }).catch(() => { })

            if (!respuesta) {
                client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.tictactoe[lang + '_dont_answer'].replace('{USER}', usuario.username)
                })
                return partidas.delete(message.guild.id)
            }

            if (respuesta.first().content == 'n') {
                client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.tictactoe[lang + '_deny'].replace('{USER}', usuario.username)
                })
                return partidas.delete(message.guild.id)
            }
        }

        users.set(usuario.id, usuario.username)
        users.set(message.author.id, message.author.username)

        partida.on('ganador', async (jugador, tablero, paso) => {
            partidas.delete(message.guild.id)
            client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe[lang + '_win'].replace('{USER}', users.get(jugador)) + `\n\n${tablero.string}`,
                attachFiles: new MessageAttachment(await mapaCanvas(tablero.array, client.imagenes, true), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        partida.on('empate', async (jugadores, tablero, paso) => {
            partidas.delete(message.guild.id)
            client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe[lang + '_draw'].replace(`{USER_TICTACTOE_AI_FIRST_USER_PLAYER}`, users.get(jugadores[0])).replace(`{USER_TICTACTOE_AI_SECOND_USER_PLAYER}`, users.get(jugadores[1])),
                attachFiles: new MessageAttachment(await mapaCanvas(tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        partida.on('finalizado', async (jugadores, tablero, paso) => {
            partidas.delete(message.guild.id)
            client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe[lang + '_game_over'] + `\n\n${tablero.string}`,
                attachFiles: new MessageAttachment(await mapaCanvas(tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });
            users.delete(message.author.id)
            users.delete(usuario.id)
        });

        if (partida.turno.jugador != client.user.id)
            await client.sendEmbed({
                description: langjson.commands.tictactoe[lang + '_start'].replace('{FICHA}', partida.turno.ficha).replace(`{USER}`, users.get(partida.turno.jugador)) + `\n\n${partida.tablero.string}`,
                channel: message.channel,
                attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            });

        if (partida.turno.jugador == client.user.id) {
            let disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
            let jugada = disponibles[Math.floor(Math.random() * disponibles.length)];
            partida.elegir(jugada)
            await client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.tictactoe[lang + '_turn'].replace('{USER}', users.get(partida.turno.jugador)) + ` [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`,
                attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
                imageURL: 'attachment://tictactoe.gif'
            })
        }

        const colector = message.channel.createMessageCollector(msg => msg.author.id === partida.turno.jugador && !isNaN(msg.content) && (Number(msg.content) >= 1 && Number(msg.content) <= 9) && partida.disponible(msg.content) && !partida.finalizado, { time: (10 * 60) * 1000 });

        colector.on('collect', async (msg) => {
            partida.elegir(msg.content);
            if (partida.finalizado) {
                colector.stop();
                return;
            }

            if (partida.turno.jugador != client.user.id)
                await client.sendEmbed({
                    channel: msg.channel,
                    description: langjson.commands.tictactoe[lang + '_turn'].replace('{USER}', users.get(partida.turno.jugador)) + ` [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`,
                    attachFiles: new MessageAttachment(await mapaCanvas(partida.tablero.array, client.imagenes), 'tictactoe.gif'),
                    imageURL: 'attachment://tictactoe.gif'
                })

            if (!partida.finalizado && partida.turno.jugador == client.user.id) {
                let disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
                let jugada = disponibles[Math.floor(Math.random() * disponibles.length)]
                partida.elegir(jugada)
                if (!partida.finalizado) {
                    await client.sendEmbed({
                        channel: msg.channel,
                        description: langjson.commands.tictactoe[lang + '_turn'].replace('{USER}', users.get(partida.turno.jugador)) + ` [\`${partida.turno.ficha}\`]\n\n${partida.tablero.string}`,
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