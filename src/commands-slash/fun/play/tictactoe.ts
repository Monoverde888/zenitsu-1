import detritus                from "detritus-client";
import {BaseCommandOption}     from "../../../utils/classes/slash.js";
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import json                    from '../../../utils/lang/langs.js';
import getGuild                from '../../../utils/functions/getguild.js';
import Collector, {Fixed}      from '../../../utils/collectors/button.js';
import AI                      from 'tictactoe-complex-ai';
import TheGame                 from '../../../utils/classes/tttgame.js';
import Button                  from '../../../utils/buttons/normal.js';
import Components              from '../../../utils/buttons/component.js';
import {estilos}               from '../../../utils/buttons/types.js';

const users : Map<string, string> = new Map();

const pos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const colors = {
    'X' : 'danger' as estilos,
    'O' : 'primary' as estilos
};

const emojis = {
    'X' : '<:x_tic:849685084236021790>',
    'O' : '<:o_tic:849685083967586304>'
}

function AIplay(partida : TheGame) {
    const instance = AI.createAI({
        ai : partida.ficha,
        player : partida.ficha === 'X' ? 'O' : 'X',
        minResponseTime : 1000,
        maxResponseTime : 3000,
        empty : '',
        level : 'expert'
    });
    return instance.play(partida.map);
}

function resolveMarkdown(user : detritus.Structures.MemberOrUser, partida : TheGame) {

    return partida.player == user.id ? `**${user.username}** ${emojis[partida.ficha]}` : user.username

}

function generateButtons(partida : TheGame, forceDisable = false, empate = '') {

    const res = [];

    for (const i in partida.map) {

        const but = partida.map[i]
        const check = ['X', 'O'].find(item => but == item) as 'X' | 'O';
        const number = parseInt(i);

        const temp = new Button(colors[check] ? colors[check] : 'secondary')
            .setCustomID(`tictactoe_${number}`)
            .setDisabled(forceDisable || !!check)

        if (check) temp.setEmoji({
            id : but == 'X' ? '849685084236021790' : '849685083967586304',
            name : but == 'X' ? 'x_tic' : 'o_tic'
        });
        else temp.setLabel('~')

        res.push(temp);

    }

    const buttons1 = res.slice(0, 3);
    const buttons2 = res.slice(3, 6);
    const buttons3 = res.slice(6);

    if (empate) buttons2.push(
        new Button('success')
            .setCustomID('tictactoe_repeat')
            .setEmoji({name : '🔁', id : undefined})
            .setLabel(empate)
    );

    return [new Components(...buttons1), new Components(...buttons2), new Components(...buttons3)];

}

const partidas : Set<string> = new Set();

async function jugar(firstp : detritus.Structures.MemberOrUser, secondp : detritus.Structures.MemberOrUser, ctx : detritus.Interaction.InteractionContext, langjson : typeof json.es | typeof json.en) {

    if (partidas.has(ctx.channelId))
        return ctx.editOrRespond({content : langjson.commands.tictactoe.curso, embeds : []});

    let msgRepuesta : detritus.Structures.Message;
    let partida = new TheGame([firstp.id, secondp.id], true);

    if (ctx.client.user.id != secondp.id) {
        msgRepuesta = await ctx.editOrRespond({
            embeds : [],
            content : langjson.commands.tictactoe.wait_user(secondp.mention),
            components : [{
                type : 1,
                components : [
                    new Button('primary')
                        .setCustomID('tictactoe_yes')
                        .setEmoji({name : '✅', id : undefined}),
                    new Button('primary')
                        .setCustomID('tictactoe_no')
                        .setEmoji({name : '❌', id : undefined})
                ]
            }]
        });
    }

    partidas.add(ctx.channelId);

    if (ctx.client.user.id != secondp.id) {

        const respuesta : string | undefined = await new Promise(resolve => {

            Collector.add({
                    async onStop() {
                        resolve(undefined);
                    },
                    async onCollect(m) {
                        resolve(m.data.customId);
                    },
                },
                (m) => {
                    return m.userId == secondp.id && ['tictactoe_no', 'tictactoe_yes'].some(item => item == m.data.customId)
                },
                {
                    idle : 0, time : 60 * 1000, max : 0
                }, {
                    channelID : ctx.channelId,
                    messageID : msgRepuesta.id,
                    guildID : msgRepuesta.guildId
                })

        });

        if (!respuesta) {
            await ctx.editOrRespond({
                embeds : [],
                content : langjson.commands.tictactoe.dont_answer(secondp.username), components : [
                    new Button('primary')
                        .setCustomID('tictactoe_yes')
                        .setEmoji({name : '✅', id : undefined})
                        .setDisabled(true),
                    new Button('primary')
                        .setCustomID('tictactoe_no')
                        .setEmoji({name : '❌', id : undefined})
                        .setDisabled(true)
                ]
            })
            return partidas.delete(ctx.channelId)
        }

        if (respuesta == 'tictactoe_no') {
            await ctx.editOrRespond({content : langjson.commands.tictactoe.deny(secondp.username), embeds : [],})
            return partidas.delete(ctx.channelId)
        }
    }

    users.set(secondp.id, secondp.username)
    users.set(firstp.id, firstp.username)

    partida.on('winner', async () => {
        const jugador = partida.player;
        partidas.delete(ctx.channelId);
        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setDescription(langjson.commands.tictactoe.win(users.get(jugador)))

        const positions = pos.find(p => p.every(x => partida.map[x] == 'X')) || pos.find(p => p.every(x => partida.map[x] == 'O')),
              botones   = generateButtons(partida, true),
              pasaber   = [...botones[0].components, ...botones[1].components, ...botones[2].components]

        let fila = 0;

        for (const i in pasaber) {
            const numero = parseInt(i)

            if (numero == 3)
                fila = 1;
            else if (numero == 6)
                fila = 2;

            const check = positions.some(item => item == numero);
            if (check)
                (botones[fila].components[numero % 3] as Button).setStyle('success');

        }

        const col = Collector._listeners.find(item => item.messageID == msg.id);
        Collector.stop('NO', col);

        await ctx.editOrRespond({embed, components : botones});

    });

    partida.on('draw', async () => {
        const jugadores = partida.players;
        partidas.delete(ctx.channelId);
        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setDescription(langjson.commands.tictactoe.draw(users.get(jugadores[0]), users.get(jugadores[1])))

        const col = Collector._listeners.find(item => item.messageID == msg.id);
        Collector.stop('NO', col);

        const empate = await ctx.editOrRespond({
            embed,
            components : generateButtons(partida, true, langjson.commands.tictactoe.rematch)
        })

        const res : Fixed | false = await new Promise(resolve => {

            Collector.add({
                    async onStop() {
                        resolve(false);
                    },
                    async onCollect(m) {
                        resolve(m);
                    },
                },
                (m) => {
                    return jugadores.includes(m.userId) && 'tictactoe_repeat' == m.data.customId
                },
                {
                    idle : 0, time : 30 * 1000, max : 0
                }, {
                    channelID : ctx.channelId,
                    messageID : empate.id,
                    guildID : empate.guildId
                })

        });

        if (res) {
            const temp = [res.member.id != firstp.id ? secondp : firstp, res.member.id == firstp.id ? secondp : firstp];
            return jugar(temp[0], temp[1], ctx, langjson);
        }

    });

    partida.on('end', async () => {
        partidas.delete(ctx.channelId)
        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setDescription(langjson.commands.tictactoe.game_over);

        const col = Collector._listeners.find(item => item.messageID == msg.id);
        Collector.stop('NO', col);

        await ctx.editOrRespond({embed, components : generateButtons(partida, true)});

    });

    let msg : detritus.Structures.Message;

    if (partida.player != ctx.client.user.id) {
        await ctx.editOrRespond({
            content : `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}\n\n${langjson.commands.tictactoe.start(partida.player == firstp.id ? firstp.username : secondp.username, emojis[partida.ficha])}`,
            components : generateButtons(partida),
            embed : {color : 0xff0000, description : '\u200b'},
        });
        msg = await ctx.fetchResponse();
    }

    else {
        partida.play(await AIplay(partida));
        await ctx.editOrRespond({
            content : `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}`,
            components : generateButtons(partida),
            embed : {color : 0xff0000, description : '\u200b'},
        });
        msg = await ctx.fetchResponse();
    }

    Collector.add({
            onStop(r) {
                if (['channelDelete', 'messageDelete', 'guildDelete'].includes(r)) return partidas.delete(ctx.id);
                if ((r != 'NO')) {
                    return !partida || partida.finished ? null : partida.emit('end');
                }
            },
            async onCollect(m) {

                partida.play(parseInt(m.data.customId.split('tictactoe_')[1]));

                if (partida.finished) {
                    const col = Collector._listeners.find(item => item.messageID == msg.id);
                    Collector.stop('', col);
                    return;
                }

                await msg.edit({
                    content : `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}`,
                    components : generateButtons(partida)
                });

                if (!partida.finished && partida.player == ctx.client.user.id) {

                    await m.respond({data : {flags : 64}, type : 5});

                    partida.play(await AIplay(partida));
                    if (!partida.finished) {

                        await msg.edit({
                            content : `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}`,
                            components : generateButtons(partida)
                        });

                    }
                }
            },
        },
        (m) => {
            return m.userId === partida.player && partida.canPlay(parseInt(m.data.customId.split('tictactoe_')[1])) && !partida.finished
        },
        {
            idle : (2 * 60) * 1000, time : (5 * 60) * 1000, max : 0
        }, {
            channelID : msg.id,
            messageID : msg.id,
            guildID : msg.guildId
        })

    return true;

}

const {Constants : {ApplicationCommandOptionTypes}} = detritus;

export function tictactoe() {
    class TicTacToe extends BaseCommandOption {
        constructor() {
            super({
                options : [
                    {
                        name : "user",
                        type : ApplicationCommandOptionTypes.USER,
                        required : true,
                        description : ".",
                    },
                ],
            });
            this.name = "tictactoe";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [
                        `${prefix}play tictactoe @Zenitsu.`,
                        `${prefix}play tictactoe @User`
                    ]
                },
                category : "fun",
            };
        }

        async run(
            ctx : detritus.Interaction.InteractionContext,
            args : { user : detritus.Structures.MemberOrUser }
        ) {

            await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

            const langjson = ctx.guildId ? await getGuild(ctx.guildId).then(x => json[x.lang]) : json.en;

            const usuario = args.user;

            if (usuario.id == ctx.userId)
                return this.onCancelRun(ctx, args);

            if (usuario.bot) {
                if (usuario.id != ctx.client.user.id)
                    return this.onCancelRun(ctx, args);
            }

            return jugar(ctx.user, usuario, ctx, langjson);

        }
    }

    return new TicTacToe();
}
