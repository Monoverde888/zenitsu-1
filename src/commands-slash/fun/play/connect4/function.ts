import detritus from 'detritus-client';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import redis from '../../../../utils/managers/redis.js';
import c4 from '@lil_marcrock22/connect4-ai';
import { IDS } from '../../../../utils/const.js';
import getUser from '../../../../utils/functions/getuser.js';
import json from '../../../../utils/lang/langs.js';
import getGuild from '../../../../utils/functions/getguild.js';
import model, { USER } from '../../../../database/models/user.js';
import fetch from 'node-fetch';
import mongoose from 'mongoose';
import ButtonCollector, { INTERACTION } from '../../../../utils/collectors/buttoncollector.js';
import { users } from '../../../../utils/maps.js';

const { Connect4AI } = c4;
const games: Map<string, c4.Connect4AI<Player>> = new Map();
const { Constants: { Permissions: Flags } } = detritus;

interface Player {
    id: string;
    turn: number;
}

function generateButtons(partida: c4.Connect4AI<Player>, text: string, forceDisable: boolean) {

    const buttons = [
        new detritus.Utils.ComponentButton()
            .setCustomId('c4_0')
            .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
            .setLabel('1'),
        new detritus.Utils.ComponentButton()
            .setCustomId('c4_1')
            .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
            .setLabel('2'),
        new detritus.Utils.ComponentButton()
            .setCustomId('c4_2')
            .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
            .setLabel('3'),
        new detritus.Utils.ComponentButton()
            .setCustomId('c4_3')
            .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
            .setLabel('4'),
        new detritus.Utils.ComponentButton()
            .setCustomId('c4_4')
            .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
            .setLabel('5'),
        new detritus.Utils.ComponentButton()
            .setCustomId('c4_5')
            .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
            .setLabel('6'),
        new detritus.Utils.ComponentButton()
            .setCustomId('c4_6')
            .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
            .setLabel('7'),
        new detritus.Utils.ComponentButton()
            .setCustomId('c4_surrender')
            .setStyle(detritus.Constants.MessageComponentButtonStyles.DANGER)
            .setLabel(text)
    ];

    if (!forceDisable) {

        for (let i = 0; i < 7; i++) {
            if (!partida) {
                buttons[i].setDisabled(true);
                continue;
            }
            if (!partida.canPlay(i))
                buttons[i].setDisabled(true);
        }

        if (!partida) buttons[7].setDisabled(true);

    } else {

        for (const i of buttons) {
            i.setDisabled(true);
        }

    }

    const cp1 = new detritus.Utils.ComponentActionRow({ components: buttons.slice(0, 5) }),
        cp2 = new detritus.Utils.ComponentActionRow({ components: buttons.slice(5) });

    return [cp1, cp2];

}

async function displayConnectFourBoard(game: c4.Connect4AI<Player>) {
    return await fetch(
        `${process.env.DISPLAYCONNECT4}/${encodeURIComponent(JSON.stringify({ game }))}.gif`
        , {
            headers:
                { 'authorization': process.env.APIKEY }
        }).then(x => x.buffer());
}

async function modificar(data: mongoose.LeanDocument<USER>, dif: string, tipo: 'ganadas' | 'empates' | 'perdidas', nombre: string) {

    const coso = `c4${dif}` as 'c4easy' | 'c4medium' | 'c4hard';
    data[coso] = data[coso] || { ganadas: 0, empates: 0, perdidas: 0 };
    data[coso][tipo] = data[coso][tipo] ? data[coso][tipo] + 1 : 1;
    data.cacheName = nombre;
    return model.findOneAndUpdate({ id: data.id }, data, { new: true }).lean();

}

function getTURNS(author: string, mention: string, clientID: string): [Player, Player] {

    if (mention != clientID) {
        const user1 = Math.floor(Math.random() * 2) + 1 == 2 ? 2 : 1;
        const user2 = user1 == 2 ? 1 : 2;
        return [{
            id: mention,
            turn: user1
        },
        {
            id: author,
            turn: user2
        }];
    }

    return [{
        id: mention,
        turn: 2
    },
    {
        id: author,
        turn: 1
    }];

}

function awaitAnswer(MESSAGE: detritus.Structures.Message,
    sendCoso: (embed: MessageEmbed, value: Buffer, interaction?: INTERACTION) => Promise<detritus.Structures.Message>,
    ctx: detritus.Interaction.InteractionContext,
    findTurn: (user: string, CHANNEL: string) => Player,
    ArrayOfArrayOfNumbers: [number, number, string][],
    args: { user: detritus.Structures.MemberOrUser; difficulty: 'easy' | 'medium' | 'hard' },
    DATAPROFILE: mongoose.LeanDocument<USER>,
    usuario: detritus.Structures.Member | detritus.Structures.User,
    langjson: typeof json.es | typeof json.en,
    difficulty: 'easy' | 'medium' | 'hard',
    easyAnswer: (id: detritus.Structures.Message, lastMessage?: detritus.Structures.Message) => void,
    CHANNEL: { id: string; type: number },
    lastMessage?: detritus.Structures.Message
) {

    const partyCollector = new ButtonCollector(MESSAGE, {
        filter: (interaction) => {

            if (!games.get(CHANNEL.id).players.some(item => item.id == interaction.userId))
                return false;

            if (!findTurn(interaction.userId, CHANNEL.id)) return;
            if (usuario.id != ctx.client.user.id) {

                if (!games.get(CHANNEL.id)) return false;

                return ['c4_1', 'c4_2', 'c4_3', 'c4_4', 'c4_5', 'c4_6', 'c4_0', 'c4_surrender'].includes(interaction.data.customId)
                    && findTurn(interaction.userId, CHANNEL.id).turn === games.get(CHANNEL.id).turn
                    && !games.get(CHANNEL.id).finished
                    || ((games.get(CHANNEL.id).players.some(item => item.id == interaction.userId) && interaction.data.customId == 'c4_surrender'));

            } else {
                return interaction.userId == ctx.user.id
                    && findTurn(interaction.userId, CHANNEL.id).turn === games.get(CHANNEL.id).turn
                    && ['c4_1', 'c4_2', 'c4_3', 'c4_4', 'c4_5', 'c4_6', 'c4_0', 'c4_surrender'].includes(interaction.data.customId)
                    && !games.get(CHANNEL.id).finished
                    || ((games.get(CHANNEL.id).players.some(item => item.id == interaction.userId) && interaction.data.customId == 'c4_surrender'));
            }
        },
        timeIdle: ((3 * 60) * 1000), max: 1,
    }, ctx.client);

    partyCollector.on('end', async (reason) => {

        if (reason != 'surrender') {
            if (partyCollector.running) partyCollector.stop('max');
            if (reason == 'max') return;
        }

        if (reason === 'surrender' && games.get(CHANNEL.id)) {
            if (usuario.id == ctx.client.user.id) {
                const da = await model.findOne({ id: ctx.user.id }).lean();
                const res = await modificar(da, args.difficulty, 'perdidas', ctx.user.username);
                await redis.set(ctx.userId, JSON.stringify(res));
            }
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.game_over)
                .setColor(14720566)
                .setImage('attachment://party.gif');
            const buf = await displayConnectFourBoard(games.get(CHANNEL.id));
            await sendCoso(embed, buf);

            games.delete(CHANNEL.id);
            users.delete(ctx.userId);
            return users.delete(usuario.id);
        } else if (reason === 'idle' && games.get(CHANNEL.id)) {
            if (usuario.id == ctx.client.user.id) {
                const da = await model.findOne({ id: ctx.user.id }).lean();
                const res = await modificar(da, args.difficulty, 'perdidas', ctx.user.username);
                await redis.set(ctx.userId, JSON.stringify(res));
            }
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.time_over)
                .setColor(14720566)
                .setImage('attachment://4enraya.gif')
                .setImage('attachment://party.gif');
            const buf = await displayConnectFourBoard(games.get(CHANNEL.id));
            await sendCoso(embed, buf);

            games.delete(CHANNEL.id);
            users.delete(ctx.userId);
            return users.delete(usuario.id);

        } else if (reason == 'time' && games.get(CHANNEL.id)) {
            if (usuario.id == ctx.client.user.id) {
                const da = await model.findOne({ id: ctx.user.id }).lean();
                const res = await modificar(da, args.difficulty, 'perdidas', ctx.user.username);
                await redis.set(ctx.userId, JSON.stringify(res));
            }
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.game_over2)
                .setColor(14720566)
                .setImage('attachment://party.gif');
            const buf = await displayConnectFourBoard(games.get(CHANNEL.id));
            await sendCoso(embed, buf);

            games.delete(CHANNEL.id);
            users.delete(ctx.userId);
            return users.delete(usuario.id);
        } else {
            games.delete(CHANNEL.id);
            users.delete(ctx.userId);
            return users.delete(usuario.id);
        }

    }).on('collect', async (interaction) => {

        if (interaction.data.customId === 'c4_surrender')
            return partyCollector.emit('end', 'surrender');

        games.get(CHANNEL.id).play(parseInt(interaction.data.customId.split('c4_')[1]));

        const game = games.get(CHANNEL.id);
        const board = game.map[(parseInt(interaction.data.customId.split('c4_')[1]))];
        let temp = findTurn(interaction.userId, CHANNEL.id).turn == 1 ? 'red' : 'yellow';
        ArrayOfArrayOfNumbers.push([board.filter(x => x.key).length - 1, parseInt(interaction.data.customId.split('c4_')[1]), temp]);

        if (games.get(CHANNEL.id).solution) {
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.win(interaction.user.username))
                .setColor(14720566)
                .setImage('attachment://party.gif');
            await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
            const buf = await displayConnectFourBoard(games.get(CHANNEL.id));
            await sendCoso(embed, buf, interaction);

            if (usuario.id == ctx.client.user.id) {

                const a = await model.findOne({ id: ctx.user.id }).lean();
                const res = await modificar(a, args.difficulty, 'ganadas', ctx.user.username);
                await redis.set(ctx.user.id, JSON.stringify(res));

                if (args.difficulty == 'hard' && a.c4hard) {

                    if ((a.c4hard.ganadas >= 10) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL1))) {

                        const data = await model.findOneAndUpdate({ id: ctx.user.id }, { $addToSet: { achievements: IDS.ACHIEVEMENTS.C4LEVEL1 } }, { new: true }).lean();
                        await redis.set(ctx.user.id, JSON.stringify(data));

                    } else if ((a.c4hard.ganadas >= 15) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL2))) {

                        const data = await model.findOneAndUpdate({ id: ctx.user.id }, { $addToSet: { achievements: IDS.ACHIEVEMENTS.C4LEVEL2 } }, { new: true }).lean();
                        await redis.set(ctx.user.id, JSON.stringify(data));

                    } else if ((a.c4hard.ganadas >= 25) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL3))) {

                        const data = await model.findOneAndUpdate({ id: ctx.user.id }, { $addToSet: { achievements: IDS.ACHIEVEMENTS.C4LEVEL3 } }, { new: true }).lean();
                        await redis.set(ctx.user.id, JSON.stringify(data));

                    } else if ((a.c4hard.ganadas >= 50) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL4))) {

                        const data = await model.findOneAndUpdate({ id: ctx.user.id }, { $addToSet: { achievements: IDS.ACHIEVEMENTS.C4LEVEL4 } }, { new: true }).lean();
                        await redis.set(ctx.user.id, JSON.stringify(data));

                    }

                }

            }

            games.delete(CHANNEL.id);
            users.delete(ctx.userId);
            users.delete(usuario.id);
            return partyCollector.stop('win');

        } else if (games.get(CHANNEL.id).tie) {
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.user.username))
                .setColor(14720566)
                .setImage('attachment://party.gif');
            const buf = await displayConnectFourBoard(games.get(CHANNEL.id));
            await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
            await sendCoso(embed, buf, interaction);

            if (usuario.id == ctx.client.user.id) {
                const da = await model.findOne({ id: ctx.user.id }).lean();
                const res = await modificar(da, args.difficulty, 'empates', ctx.user.username);
                await redis.set(ctx.userId, JSON.stringify(res));
            }
            games.delete(CHANNEL.id);
            users.delete(ctx.userId);
            users.delete(usuario.id);
            return partyCollector.stop('win');
        }

        if (usuario.id == ctx.client.user.id) {
            const old = games.get(CHANNEL.id);
            const played = old.playAI(difficulty);
            const board = games.get(CHANNEL.id).map;
            temp = findTurn(ctx.client.user.id, CHANNEL.id).turn == 1 ? 'red' : 'yellow';
            ArrayOfArrayOfNumbers.push([board[played].filter(x => x.key).length - 1, played, temp]);

            if (games.get(CHANNEL.id).solution) {
                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4.win(usuario.username))
                    .setColor(14720566)
                    .setImage('attachment://party.gif');
                await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
                const buf = await displayConnectFourBoard(games.get(CHANNEL.id));
                await sendCoso(embed, buf, interaction);

                const da = await model.findOne({ id: ctx.user.id }).lean();
                const res = await modificar(da, args.difficulty, 'perdidas', ctx.user.username);
                await redis.set(ctx.userId, JSON.stringify(res));
                games.delete(CHANNEL.id);
                users.delete(ctx.userId);
                users.delete(usuario.id);
                return partyCollector.stop('win');
            } else if (games.get(CHANNEL.id).tie) {
                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.user.username))
                    .setColor(14720566)
                    .setImage('attachment://party.gif');
                await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
                const buf = await displayConnectFourBoard(games.get(CHANNEL.id));
                await sendCoso(embed, buf, interaction);

                const da = await model.findOne({ id: ctx.user.id }).lean();
                const res = await modificar(da, args.difficulty, 'empates', ctx.user.username);
                await redis.set(ctx.userId, JSON.stringify(res));
                games.delete(CHANNEL.id);
                users.delete(ctx.userId);
                users.delete(usuario.id);
                return partyCollector.stop('win');
            }

            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.turn(ctx.user.username, '🔴'))
                .setFooter(args.difficulty)
                .setColor(14720566)
                .setImage('attachment://party.gif');
            await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
            const buf = await displayConnectFourBoard(games.get(CHANNEL.id));
            try {
                if (!lastMessage?.deleted && !([10, 11, 12].includes(CHANNEL.type))) await lastMessage.delete();
            } catch {
                //do something
            }
            lastMessage = await interaction.editOrRespond({
                file: {
                    value: buf,
                    filename: 'party.gif'
                },
                embed,
                components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false)
            });

            return easyAnswer(lastMessage, lastMessage);

        }

        if ((usuario.id != ctx.client.user.id) && (games.get(CHANNEL.id))) {
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.turn(
                    findTurn(ctx.user.id, CHANNEL.id).turn == findTurn(interaction.userId, CHANNEL.id).turn ? usuario.username : ctx.user.username,
                    findTurn(interaction.userId, CHANNEL.id).turn == 2 ? '🔴' : '🟡'
                ))
                .setFooter(args.difficulty)
                .setColor(14720566)
                .setImage('attachment://party.gif');
            await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
            const buf = await displayConnectFourBoard(games.get(CHANNEL.id));

            try {
                if (!lastMessage?.deleted && !([10, 11, 12].includes(CHANNEL.type))) await lastMessage.delete();
            } catch {
                //do something
            }
            lastMessage = await interaction.editOrRespond({
                file: {
                    value: buf,
                    filename: 'party.gif'
                },
                embed,
                components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false)
            });

            return easyAnswer(lastMessage, lastMessage);

        }
    });

}

export async function FUNCTION(
    ctx: detritus.Interaction.InteractionContext,
    args: { user: detritus.Structures.MemberOrUser; difficulty: 'easy' | 'medium' | 'hard', needtoconnect?: string }
) {

    await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
    const ArrayOfArrayOfNumbers: [number, number, string][] = [];
    const DATAPROFILE = await getUser(ctx.user.id);
    const DATAGUILD: { lang: 'es' | 'en' } = ctx.guildId ? await getGuild(ctx.guildId) : {
        lang: 'en',
    };
    const langjson = json[DATAGUILD.lang];
    const difficulty = args.difficulty;
    const usuario = difficulty ? ctx.client.user : args.user;

    if (users.has(ctx.userId))
        return ctx.editOrRespond(langjson.commands.connect4.author_active);

    if (users.has(usuario.id) && (usuario.id !== ctx.client.userId))
        return ctx.editOrRespond(langjson.commands.connect4.user_active(usuario.username));

    if (games.get(ctx.channelId))
        return ctx.editOrRespond(langjson.commands.connect4.curso);

    if (!difficulty) {
        if ((!usuario) || (usuario.id == ctx.user.id) || (usuario.bot)) {
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.mention)
                .setFooter(langjson.commands.connect4.footer)
                .setColor(14720566);

            return ctx.editOrRespond({ embed });
        }
    }

    const findTurn = (user: string, CHANNEL: string) => games.get(CHANNEL) && games.get(CHANNEL).players ? games.get(CHANNEL).players.find(item => item.id == user) : null;

    const poto = new Connect4AI<Player>({
        lengthArr: 6,
        columns: 7,
        necessaryToWin: parseInt(args.needtoconnect) || 4
    }, getTURNS(ctx.userId, usuario.id, ctx.client.userId), 10);
    poto.createBoard();

    const CHANNEL: { id: string; type: number } = ctx.channel && ctx.guild && !ctx.channel.isGuildThread && ctx.guild.features.has('THREADS_ENABLED') && ctx.channel.can(Flags.MANAGE_THREADS) ? await ctx.channel.createThread({
        name: `Game of ${ctx.user.tag} vs ${usuario.tag}`,
        autoArchiveDuration: 1440,
        type: 11,
        reason: `Game of ${ctx.user.tag} vs ${usuario.tag}`
    }) : { id: ctx.channelId, type: ctx.channel?.type };

    users.add(usuario.id);
    users.add(ctx.userId);
    games.set(CHANNEL.id, poto);

    if (usuario.id != ctx.client.user.id) {

        const Buttons = [
            new detritus.Utils.ComponentButton()
                .setCustomId('c4_yes')
                .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
                .setEmoji({ name: '✅', id: undefined }),
            new detritus.Utils.ComponentButton()
                .setCustomId('c4_no')
                .setStyle(detritus.Constants.MessageComponentButtonStyles.DANGER)
                .setEmoji({ name: '❌', id: undefined })
        ];

        const wait = await ctx.editOrRespond({
            content: langjson.commands.connect4.wait_user(usuario.mention),
            components: [new detritus.Utils.ComponentActionRow({ components: Buttons })]
        });

        const respuesta: string | undefined = await new Promise(resolve => {

            const col = new ButtonCollector(wait, {
                filter: interaction => interaction.userId == usuario.id && ['c4_yes', 'c4_no'].some(item => item == interaction.data.customId),
                timeLimit: (60) * 1000
            }, ctx.client);

            col.on('end', () => resolve(undefined))
                .on('collect', interaction => resolve(interaction.data.customId));

        });
        if (!respuesta) {
            Buttons[0].setDisabled(true);
            Buttons[1].setDisabled(true);
            games.delete(CHANNEL.id);
            users.delete(ctx.userId);
            users.delete(usuario.id);
            return ctx.editOrRespond({
                content: langjson.commands.connect4.dont_answer(usuario.username),
                components: [new detritus.Utils.ComponentActionRow({ components: Buttons })]
            });
        }

        if (respuesta == 'c4_no') {
            Buttons[0].setDisabled(true);
            Buttons[1].setDisabled(true);
            games.delete(CHANNEL.id);
            users.delete(ctx.userId);
            users.delete(usuario.id);
            return ctx.editOrRespond({
                content: langjson.commands.connect4.deny(usuario.username),
                components: [new detritus.Utils.ComponentActionRow({ components: Buttons })]
            });
        }

    } else await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

    const embedStart = new MessageEmbed()
        .setDescription(langjson.commands.connect4.start(findTurn(ctx.user.id, CHANNEL.id).turn == 1 ? ctx.user.username : usuario.username))
        .setColor(14720566)
        .setImage('attachment://party.gif');
    const bufParty = await displayConnectFourBoard(games.get(CHANNEL.id));

    const messageParty = CHANNEL.id !== ctx.channelId ? await ctx.client.rest.createMessage(CHANNEL.id, {
        file: {
            value: bufParty,
            filename: 'party.gif'
        },
        embed: embedStart,
        content: '\u200b',
        components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false)
    }) : await ctx.editOrRespond({
        file: {
            value: bufParty,
            filename: 'party.gif'
        },
        embed: embedStart,
        content: '\u200b',
        components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false)
    });

    async function sendCoso(embed: MessageEmbed, value: Buffer, interaction?: INTERACTION) {

        if (ArrayOfArrayOfNumbers.length) {

            const data = await model.findOneAndUpdate({ id: ctx.client.userId }, {
                $push: {
                    c4Maps: {
                        maps: ArrayOfArrayOfNumbers,
                        users: [ctx.userId, usuario.id],
                        dif: args.difficulty
                    }
                }
            }, { new: true, upsert: true }).lean();
            await redis.set(ctx.client.userId, JSON.stringify(data));

            embed.setFooter('/connect4 view ' + JSON.parse(JSON.stringify(data.c4Maps[data.c4Maps.length - 1]))._id);

        }

        return interaction ? interaction.editOrRespond({
            embed,
            file: { filename: 'party.gif', value },
            components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, true)
        }) : ctx.client.rest.createMessage(CHANNEL.id, {
            embed,
            file: { filename: 'party.gif', value },
            components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, true)
        });

    }

    function easyAwaitAnswer(MESSAGE: detritus.Structures.Message, lastMessage?: detritus.Structures.Message) {
        awaitAnswer(MESSAGE, sendCoso, ctx, findTurn, ArrayOfArrayOfNumbers, args, DATAPROFILE, usuario, langjson, difficulty, easyAwaitAnswer, CHANNEL, lastMessage);
    }

    return easyAwaitAnswer(messageParty, messageParty);

}