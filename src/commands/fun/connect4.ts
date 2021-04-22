import { Connect4AI } from 'connect4-ai'
import { MessageAttachment, Message } from 'discord.js-light'
const turnosPorId: Map<string, Map<string, (0 | 1 | 2)>> = new Map();
import run from '../../Utils/Interfaces/run';
import displayConnectFourBoard from '../../Utils/Functions/displayConnectFourBoard'
import awaitMessage from '../../Utils/Functions/awaitMessage';
import Command from '../../Utils/Classes/command';
const games: Map<string, Connect4AI> = new Map();
import model from '../../models/c4top';

function obtenerTurno(obj: { member: string, guild: string }) {

    return turnosPorId.get(obj.guild) ? turnosPorId.get(obj.guild).get(obj.member) : null

}

export default class Comando extends Command {

    constructor() {
        super()
        this.name = "conecta4"
        this.alias = [`connect4`, 'fourinrow', '4enlinea', 'c4']
        this.category = 'fun'
    }

    async run({ client, message, args, lang, langjson }: run) {

        if (games.has(message.guild.id))
            return client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.connect4[lang + '_curso']
            })

        args[0] = args[0]?.toLowerCase();

        let usuario = ['easy', 'medium', 'hard'].includes(args[0]) ? client.user : message.mentions.members.first()?.user;

        if (!usuario || usuario.id == message.author.id || (usuario.bot && usuario.id != client.user.id))
            return client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.connect4[lang + '_mention'],
                footerText: langjson.commands.connect4[lang + '_footer']
            });

        let turno = (id: string) => obtenerTurno({ guild: message.guild.id, member: id })

        if (usuario.id != client.user.id)
            if (obtenerTurno({ guild: message.guild.id, member: usuario.id })) {
                return client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.connect4[lang + '_user_active'].replace('{USER}', usuario.tag)
                });
            }

        if (obtenerTurno({ guild: message.guild.id, member: message.author.id })) {
            return client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.connect4[lang + '_author_active']
            });
        }

        const poto = new Connect4AI();
        poto.jugadores = [message.author.id, usuario.id];

        games.set(message.guild.id, poto)

        let obj = new Map();
        turnosPorId.set(message.guild.id, obj)

        if (usuario.id != client.user.id) {

            await client.sendEmbed({
                channel: message.channel,
                description: langjson.commands.connect4[lang + '_wait_user'].replace('{USER}', usuario.id)
            });

            let respuesta = await awaitMessage({ channel: message.channel, filter: (m: Message) => m.author.id == usuario.id && ['s', 'n'].some(item => item == m.content), time: (1 * 60) * 1000, max: 1 }).catch(() => { })

            if (!respuesta) {
                games.delete(message.guild.id)
                turnosPorId.delete(message.guild.id)
                return client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.connect4[lang + '_dont_answer']
                })
            }

            if (respuesta.first().content == 'n') {
                games.delete(message.guild.id)
                turnosPorId.delete(message.guild.id)
                return client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.connect4[lang + '_deny'].replace('{USER}', usuario.tag)
                })
            }

            if (obtenerTurno({ guild: message.guild.id, member: usuario.id })) {
                games.delete(message.guild.id)
                return client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.connect4[lang + '_user_active'].replace('{USER}', usuario.tag)
                });
            }

            if (obtenerTurno({ guild: message.guild.id, member: message.author.id })) {
                games.delete(message.guild.id)
                return client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.connect4[lang + '_author_active']
                });
            }

        }

        if (usuario.id != client.user.id) {

            let temp = turnosPorId.get(message.guild.id);
            temp.set(usuario.id, Math.floor(Math.random() * 2) + 1 == 2 ? 2 : 1);
            temp.set(message.author.id, temp.get(usuario.id) == 2 ? 1 : 2);

        }

        else {
            let temp = turnosPorId.get(message.guild.id);
            temp.set(usuario.id, 2);
            temp.set(message.author.id, 1);
        }

        let res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes);
        let att = new MessageAttachment(res, '4enraya.gif')

        client.sendEmbed({
            attachFiles: att,
            channel: message.channel,
            imageURL: 'attachment://4enraya.gif',
            description: langjson.commands.connect4[lang + '_start'].replace('{USER}', (turno(message.author.id)) == 1 ? message.author.tag : usuario.tag)
        })

        const colector = message.channel.createMessageCollector(function (msg: Message) {

            if (usuario.id != client.user.id) {

                return games.get(msg.guild.id).jugadores.includes(msg.author.id)
                    && turno(msg.author.id) === games.get(msg.guild.id).gameStatus().currentPlayer
                    && !isNaN(Number(msg.content))
                    && (Number(msg.content) >= 1
                        && Number(msg.content) <= 7)
                    && games.get(msg.guild.id).canPlay(parseInt(msg.content) - 1)
                    && !games.get(msg.guild.id).gameStatus().gameOver || games.get(msg.guild.id).jugadores.includes(msg.author.id)
                    && msg.content == 'surrender'

            }

            else return msg.author.id == message.author.id
                && turno(msg.author.id) === games.get(message.guild.id).gameStatus().currentPlayer
                && !isNaN(Number(msg.content))
                && (Number(msg.content) >= 1
                    && Number(msg.content) <= 7)
                && games.get(message.guild.id).canPlay(parseInt(msg.content) - 1)
                && !games.get(message.guild.id).gameStatus().gameOver
                || (games.get(message.guild.id).jugadores.includes(msg.author.id) && msg.content == 'surrender')

        }, {
            idle: ((3 * 60) * 1000), time: ((30 * 60) * 1000)
        });

        colector.on('collect', async (msg: Message) => {

            if (msg.content === 'surrender') {
                return colector.stop('SURRENDER');
            }

            games.get(message.guild.id).play(parseInt(msg.content) - 1)

            if (games.get(msg.guild.id).gameStatus().gameOver && games.get(msg.guild.id).gameStatus().solution) {
                let res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(msg.guild.id), client.imagenes);
                let att = new MessageAttachment(res, '4enraya.gif')
                client.sendEmbed({
                    description: langjson.commands.connect4[lang + '_win'].replace('{USER}', msg.author.tag),
                    channel: msg.channel,
                    attachFiles: att,
                    imageURL: 'attachment://4enraya.gif'
                })
                turnosPorId.delete(message.guild.id)
                games.delete(message.guild.id)
                if (usuario.id == client.user.id) await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { ganadas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                return colector.stop();
            }

            else if (games.get(msg.guild.id).gameStatus().gameOver) {
                let res = await displayConnectFourBoard(displayBoard(games.get(msg.guild.id).ascii()), games.get(msg.guild.id), client.imagenes);
                let att = new MessageAttachment(res, '4enraya.gif')
                client.sendEmbed({
                    channel: msg.channel,
                    description: langjson.commands.connect4[lang + '_draw'].replace('{USER_CONNECT4_AI_FIRST_USER_PLAYER}', usuario.tag).replace('{USER_CONNECT4_AI_SECOND_USER_PLAYER}', message.author.tag),
                    attachFiles: att,
                    imageURL: 'attachment://4enraya.gif'
                })
                turnosPorId.delete(message.guild.id)
                games.delete(msg.guild.id)
                if (usuario.id == client.user.id) await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { empates: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                return colector.stop();
            }

            if (usuario.id == client.user.id) {
                games.get(message.guild.id).playAI(args[0]);
                if (games.get(message.guild.id).gameStatus().gameOver && games.get(message.guild.id).gameStatus().solution) {
                    let res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes);
                    let att = new MessageAttachment(res, '4enraya.gif')
                    client.sendEmbed({
                        description: langjson.commands.connect4[lang + '_win'].replace('{USER}', client.user.tag),
                        channel: msg.channel,
                        attachFiles: att,
                        imageURL: 'attachment://4enraya.gif',
                        footerText: args[0]
                    })
                    await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                    turnosPorId.delete(message.guild.id);
                    games.delete(message.guild.id)
                    return colector.stop();
                }

                else if ((games.get(message.guild.id)).gameStatus().gameOver) {
                    let res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes);
                    let att = new MessageAttachment(res, '4enraya.gif')
                    client.sendEmbed({
                        channel: msg.channel,
                        description: langjson.commands.connect4[lang + '_draw'].replace('{USER_CONNECT4_AI_FIRST_USER_PLAYER}', usuario.tag).replace('{USER_CONNECT4_AI_SECOND_USER_PLAYER}', message.author.tag),
                        attachFiles: att,
                        imageURL: 'attachment://4enraya.gif',
                        footerText: args[0]
                    })
                    await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { empates: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                    turnosPorId.delete(message.guild.id);
                    games.delete(message.guild.id)
                    return colector.stop();
                }

                let res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes);
                let att = new MessageAttachment(res, '4enraya.gif')

                await client.sendEmbed({
                    channel: msg.channel,
                    attachFiles: att,
                    description: langjson.commands.connect4[lang + '_turn'].replace('{USER}', message.author.tag).replace('GAME_USER_CONNECT4_AI_PLAYER_TURNS', '🔴'),
                    imageURL: 'attachment://4enraya.gif',
                    footerText: args[0]
                })

            }

            let res = await displayConnectFourBoard(displayBoard(games.get(msg.guild.id).ascii()), games.get(msg.guild.id), client.imagenes);
            let att = new MessageAttachment(res, '4enraya.gif')

            if (usuario.id != client.user.id)
                await client.sendEmbed({
                    channel: msg.channel,
                    attachFiles: att,
                    description: langjson.commands.connect4[lang + '_turn']
                        .replace('{USER}', turno(message.author.id) == turno(msg.author.id) ? usuario.tag : message.author.tag)
                        .replace('{GAME_USER_CONNECT4_AI_PLAYER_TURNS}', turno(msg.author.id) == 2 ? `🔴` : `🟡`),
                    imageURL: 'attachment://4enraya.gif'
                })
        })

        colector.on('end', async (_, r) => {

            if (r === 'SURRENDER' && games.get(message.guild.id)) {
                if (usuario.id == client.user.id) await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.connect4[lang + '_game_over'],
                    attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes), '4enraya.gif'),
                    imageURL: 'attachment://4enraya.gif'
                })
                turnosPorId.delete(message.guild.id)
                return games.delete(message.guild.id);
            }

            else if (r === 'idle' && games.get(message.guild.id)) {
                if (usuario.id == client.user.id) await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.connect4[lang + '_time_over'],
                    attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes), '4enraya.gif'),
                    imageURL: 'attachment://4enraya.gif'
                })
                turnosPorId.delete(message.guild.id)
                return games.delete(message.guild.id)
            }

            else if (games.get(message.guild.id) && r === 'time') {
                if (usuario.id == client.user.id) await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                client.sendEmbed({
                    channel: message.channel,
                    description: langjson.commands.connect4[lang + '_game_over2'],
                    attachFiles: new MessageAttachment(await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes), '4enraya.gif'),
                    imageURL: 'attachment://4enraya.gif'
                })
                turnosPorId.delete(message.guild.id)
                return games.delete(message.guild.id)
            }
        })
    }
}

function displayBoard(board: string) {
    /*
        RegEx: https://portalmybot.com/code/D519u4BFb0
    */
    let regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    let res = board
        .split('1').join('🟢')
        .split('2').join('🟡')
        .split(' - ').join('⬛')
        .split('---------------------')
        .join('')
        .split('[0]')[0]
        .split(' ').join('')
        .split('\n')
        .filter(item => item.length)
        .map(a => a.match(regex))
    return res;

}