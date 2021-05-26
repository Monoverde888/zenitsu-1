import c4 from 'connect4-ai';
const { Connect4AI } = c4
import light from '@lil_macrock22/eris-light-pluris';
import run from '../../Utils/Interfaces/run.js';
import displayConnectFourBoard from '../../Utils/Functions/displayConnectFourBoard.js'
import Command from '../../Utils/Classes/command.js';
const games: Map<string, c4.Connect4AI> = new Map();
import model from '../../models/c4top.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';

export default class Comando extends Command {

    constructor() {
        super()
        this.name = "connect4"
        this.alias = [`conecta4`, 'fourinrow', '4enlinea', 'c4']
        this.category = 'fun'
        this.botPermissions.channel = ['attachFiles']
    }

    async run({ client, message, args, langjson, embedResponse }: run): Promise<light.Message> {

        const DATAPROFILE = await client.profile.cacheOrFetch(message.author.id);

        if (games.get(message.guild.id)) {
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.connect4.curso)
            return message.channel.createMessage({
                embed
            })
        }

        args[0] = args[0]?.toLowerCase();

        const usuario = ['easy', 'medium', 'hard'].includes(args[0]) ? client.user : message.mentions.filter(user => !user.bot)[0];

        if (!usuario || usuario.id == message.author.id || (usuario.bot && usuario.id != client.user.id)) {
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.mention)
                .setFooter(langjson.commands.connect4.footer)

            return message.channel.createMessage({
                embed
            });
        }

        const findTurn = (user: string) => (games.get(message.guildID)?.jugadores?.find(item => item.id == user));

        if (usuario.id != client.user.id)
            if (findTurn(usuario.id)) {
                return embedResponse(langjson.commands.connect4.user_active(usuario.username), message.channel, client.color);
            }

        if (findTurn(message.author.id)) {
            return embedResponse(langjson.commands.connect4.author_active, message.channel, client.color);
        }

        const poto = new Connect4AI();

        games.set(message.guild.id, poto)

        if (usuario.id != client.user.id) {

            await embedResponse(langjson.commands.connect4.wait_user(usuario.username), message.channel, client.color);

            const res = await message.channel.awaitMessages({ filter: (m: light.Message) => m.author.id == usuario.id && ['s', 'n'].some(item => item == m.content), timeout: (1 * 60) * 1000, count: 1 }).then(item => item.collected)

            const respuesta = res.map(item => item)[0]?.content

            if (!respuesta) {
                games.delete(message.guild.id)
                return embedResponse(langjson.commands.connect4.dont_answer(usuario.username), message.channel, client.color)
            }

            if (respuesta == 'n') {
                games.delete(message.guild.id)
                return embedResponse(langjson.commands.connect4.deny(usuario.username), message.channel, client.color)
            }

            if (findTurn(usuario.id)) {
                games.delete(message.guild.id)
                return embedResponse(langjson.commands.connect4.user_active(usuario.username), message.channel, client.color);
            }

            if (findTurn(message.author.id)) {
                games.delete(message.guild.id)
                return embedResponse(langjson.commands.connect4.author_active, message.channel, client.color);
            }

        }

        if (usuario.id != client.user.id) {

            const user1 = Math.floor(Math.random() * 2) + 1 == 2 ? 2 : 1
            const user2 = user1 == 2 ? 1 : 2

            poto.jugadores = [{
                id: usuario.id,
                turn: user1
            },
            {
                id: message.author.id,
                turn: user2
            }]

        }

        else {

            const user1 = 2
            const user2 = 1

            poto.jugadores = [{
                id: usuario.id,
                turn: user1
            },
            {
                id: message.author.id,
                turn: user2
            }]

        }

        const res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes);

        const embedStart = new MessageEmbed()
            .setDescription(langjson.commands.connect4.start(findTurn(message.author.id)?.turn == 1 ? message.author.username : usuario.username))
            .setColor(client.color)
            .setImage('attachment://4enraya.gif')
        message.channel.createMessage({ embed: embedStart }, [{ name: '4enraya.gif', file: res }]);
        const TIME_IDLE = ((3 * 60) * 1000);

        client.listener.add({
            channelID: message.channel.id,
            max: 0,
            code: 'user:' + message.author.id + 'guild:' + message.guild.id + 'date:' + Date.now() + 'random:' + Math.random(),
            filter(msg) {

                if (usuario.id != client.user.id) {

                    if (!games.get(msg.guildID)) return false;

                    return games.get(msg.guild.id).jugadores?.some(item => item.id == msg.author.id)
                        && findTurn(msg.author.id)?.turn === games.get(msg.guild.id).gameStatus().currentPlayer
                        && !isNaN(Number(msg.content))
                        && (Number(msg.content) >= 1
                            && Number(msg.content) <= 7)
                        && games.get(msg.guild.id).canPlay(parseInt(msg.content) - 1)
                        && !games.get(msg.guild.id).gameStatus().gameOver || games.get(msg.guild.id)?.jugadores?.some(item => item.id == msg.author.id)
                        && msg.content == 'surrender'

                }

                else return msg.author.id == message.author.id
                    && findTurn(msg.author.id)?.turn === games.get(message.guild.id).gameStatus().currentPlayer
                    && !isNaN(Number(msg.content))
                    && (Number(msg.content) >= 1
                        && Number(msg.content) <= 7)
                    && games.get(message.guild.id).canPlay(parseInt(msg.content) - 1)
                    && !games.get(message.guild.id).gameStatus().gameOver
                    || (games.get(message.guild.id)?.jugadores?.some(item => item.id == msg.author.id) && msg.content == 'surrender')

            },
            idle: TIME_IDLE,
            async onStop(_, reason) {
                if (reason === 'surrender' && games.get(message.guild.id)) {
                    if (usuario.id == client.user.id) await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                    const embed = new MessageEmbed()
                        .setDescription(langjson.commands.connect4.game_over)
                        .setColor(client.color)
                        .setImage(`attachment://4enraya.gif`)

                    message.channel.createMessage({ embed }, [{ name: '4enraya.gif', file: await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes) }])
                    return games.delete(message.guild.id);
                }

                else if (reason === 'idle' && games.get(message.guild.id)) {
                    if (usuario.id == client.user.id) await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                    const embed = new MessageEmbed()
                        .setDescription(langjson.commands.connect4.time_over)
                        .setColor(client.color)
                        .setImage(`attachment://4enraya.gif`)

                    message.channel.createMessage({ embed }, [{ name: '4enraya.gif', file: await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes) }])
                    return games.delete(message.guild.id)
                }

                else if (reason == 'time' && games.get(message.guild.id)) {
                    if (usuario.id == client.user.id) await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                    const embed = new MessageEmbed()
                        .setDescription(langjson.commands.connect4.game_over2)
                        .setColor(client.color)
                        .setImage(`attachment://4enraya.gif`)

                    message.channel.createMessage({ embed }, [{ name: '4enraya.gif', file: await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes) }])
                    return games.delete(message.guild.id)
                }
                else return games.delete(message.guildID)
            },
            async onCollect(msg, colector) {

                if (msg.content === 'surrender') {
                    return client.listener.stop(colector, 'surrender');
                }

                games.get(message.guild.id).play(parseInt(msg.content) - 1)
                if (games.get(msg.guild.id).gameStatus().gameOver && games.get(msg.guild.id).gameStatus().solution) {
                    const res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(msg.guild.id), client.imagenes);
                    const embed = new MessageEmbed()
                        .setDescription(langjson.commands.connect4.win(msg.author.username))
                        .setColor(client.color)
                        .setImage('attachment://4enraya.gif')

                    message.channel.createMessage({ embed }, [{ file: res, name: '4enraya.gif' }])
                    if (usuario.id == client.user.id) {
                        const data = await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { ganadas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true, new: true });

                        if (args[0] == 'hard') {

                            if ((data.ganadas >= 10) && !(DATAPROFILE.achievements.includes('c4level1')))
                                await client.profile.add(message.author.id, 'achievements', 'c4level1')

                            if ((data.ganadas >= 25) && !(DATAPROFILE.achievements.includes('c4level2')))
                                await client.profile.add(message.author.id, 'achievements', 'c4level2')

                            if ((data.ganadas >= 50) && !(DATAPROFILE.achievements.includes('c4level3')))
                                await client.profile.add(message.author.id, 'achievements', 'c4level3')

                            if ((data.ganadas >= 100) && !(DATAPROFILE.achievements.includes('c4top')))
                                await client.profile.add(message.author.id, 'achievements', 'c4top')

                        }

                    }
                    return client.listener.stop(colector, 'win');
                }

                else if (games.get(msg.guild.id).gameStatus().gameOver) {
                    const res = await displayConnectFourBoard(displayBoard(games.get(msg.guild.id).ascii()), games.get(msg.guild.id), client.imagenes);

                    const embed = new MessageEmbed()
                        .setDescription(langjson.commands.connect4.draw(usuario.username, message.author.username))
                        .setColor(client.color)
                        .setImage('attachment://4enraya.gif')

                    message.channel.createMessage({ embed }, [{ file: res, name: '4enraya.gif' }])
                    if (usuario.id == client.user.id) await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { empates: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                    return client.listener.stop(colector, 'win');
                }

                if (usuario.id == client.user.id) {
                    games.get(message.guild.id).playAI(args[0]);

                    if (games.get(message.guild.id).gameStatus().gameOver && games.get(message.guild.id).gameStatus().solution) {
                        const res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes);

                        const embed = new MessageEmbed()
                            .setDescription(langjson.commands.connect4.win(usuario.username))
                            .setColor(client.color)
                            .setImage('attachment://4enraya.gif')
                        message.channel.createMessage({ embed }, [{ file: res, name: '4enraya.gif' }]);

                        await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { perdidas: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                        return client.listener.stop(colector, 'win');
                    }

                    else if ((games.get(message.guild.id)).gameStatus().gameOver) {
                        const res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes);
                        const embed = new MessageEmbed()
                            .setDescription(langjson.commands.connect4.draw(usuario.username, message.author.username))
                            .setColor(client.color)
                            .setImage('attachment://4enraya.gif')

                        message.channel.createMessage({ embed }, [{ file: res, name: '4enraya.gif' }])
                        await model.findOneAndUpdate({ id: message.author.id, difficulty: args[0] }, { $inc: { empates: 1 }, $set: { cacheName: message.author.username } }, { upsert: true });
                        return client.listener.stop(colector, 'win');
                    }

                    const res = await displayConnectFourBoard(displayBoard(games.get(message.guild.id).ascii()), games.get(message.guild.id), client.imagenes);
                    const embed = new MessageEmbed()
                        .setDescription(langjson.commands.connect4.turn(message.author.username, '🔴'))
                        .setColor(client.color)
                        .setImage('attachment://4enraya.gif')
                        .setFooter(args[0])

                    message.channel.createMessage({ embed }, [{ file: res, name: '4enraya.gif' }])

                }

                if ((usuario.id != client.user.id) && (games.get(message.guild.id))) {
                    const res = await displayConnectFourBoard(displayBoard(games.get(msg.guild.id).ascii()), games.get(msg.guild.id), client.imagenes);
                    const embed = new MessageEmbed()
                        .setDescription(langjson.commands.connect4.turn(
                            findTurn(message.author.id)?.turn == findTurn(msg.author.id)?.turn ? usuario.username : message.author.username,
                            findTurn(msg.author.id)?.turn == 2 ? `🔴` : `🟡`
                        ))
                        .setImage(`attachment://4enraya.gif`)
                        .setColor(client.color);

                    await message.channel.createMessage({ embed }, [{ file: res, name: '4enraya.gif' }])

                }
            },
            timeLimit: ((30 * 60) * 1000)
        });
    }
}

function displayBoard(board: string) {
    /*
        RegEx: https://portalmybot.com/code/D519u4BFb0
    */
    const regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    const res = board
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