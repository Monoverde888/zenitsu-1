import detritus from 'detritus-client';
import { BaseCommandOption } from '../../../utils/classes/slash.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import json from '../../../utils/lang/langs.js';
import getGuild from '../../../utils/functions/getguild.js';
import ButtonCollector, { INTERACTION } from '../../../utils/collectors/buttoncollector.js';
import AI from 'tictactoe-complex-ai';
import TheGame from '../../../utils/classes/tttgame.js';

const users: Map<string, string> = new Map();

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
    'X': detritus.Constants.MessageComponentButtonStyles.DANGER,
    'O': detritus.Constants.MessageComponentButtonStyles.PRIMARY
};

const emojis = {
    'X': '<:x_tic:849685084236021790>',
    'O': '<:o_tic:849685083967586304>'
};

function AIplay(partida: TheGame) {
    const instance = AI.createAI({
        ai: partida.ficha,
        player: partida.ficha === 'X' ? 'O' : 'X',
        minResponseTime: 1000,
        maxResponseTime: 3000,
        empty: '',
        level: 'expert'
    });
    return instance.play(partida.map);
}

function resolveMarkdown(user: detritus.Structures.MemberOrUser, partida: TheGame) {

    return partida.player == user.id ? `**${user.username}** ${emojis[partida.ficha]}` : user.username;

}

function generateButtons(partida: TheGame, forceDisable = false, empate = '') {

    const res = [];

    for (const i in partida.map) {

        const but = partida.map[i];
        const check = ['X', 'O'].find(item => but == item) as 'X' | 'O';
        const number = parseInt(i);

        const temp = new detritus.Utils.ComponentButton()
            .setStyle(colors[check] ? colors[check] : detritus.Constants.MessageComponentButtonStyles.SECONDARY)
            .setCustomId(`tictactoe_${number}`)
            .setDisabled(forceDisable || !!check);

        if (check) temp.setEmoji({
            id: but == 'X' ? '849685084236021790' : '849685083967586304',
            name: but == 'X' ? 'x_tic' : 'o_tic'
        });
        else temp.setLabel('~');

        res.push(temp);

    }

    const buttons1 = res.slice(0, 3);
    const buttons2 = res.slice(3, 6);
    const buttons3 = res.slice(6);

    if (empate) buttons2.push(
        new detritus.Utils.ComponentButton()
            .setStyle(detritus.Constants.MessageComponentButtonStyles.SUCCESS)
            .setCustomId('tictactoe_repeat')
            .setEmoji({ name: '🔁', id: undefined })
            .setLabel(empate)
    );

    const cp1 = new detritus.Utils.ComponentActionRow({ components: buttons1 }),
        cp2 = new detritus.Utils.ComponentActionRow({ components: buttons2 }),
        cp3 = new detritus.Utils.ComponentActionRow({ components: buttons3 });

    return [cp1, cp2, cp3];

}

const partidas: Set<string> = new Set();

async function jugar(firstp: detritus.Structures.MemberOrUser, secondp: detritus.Structures.MemberOrUser, ctx: detritus.Interaction.InteractionContext, langjson: typeof json.es | typeof json.en) {

    if (partidas.has(ctx.channelId))
        return ctx.editOrRespond({ content: langjson.commands.tictactoe.curso, embeds: [] });

    let msgRepuesta: detritus.Structures.Message;
    const partida = new TheGame([firstp.id, secondp.id]);

    if (ctx.client.user.id != secondp.id) {
        await ctx.editOrRespond({
            embeds: [],
            content: langjson.commands.tictactoe.wait_user(secondp.mention),
            components: [{
                type: 1,
                components: [
                    new detritus.Utils.ComponentButton()
                        .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
                        .setCustomId('tictactoe_yes')
                        .setEmoji({ name: '✅', id: undefined }),
                    new detritus.Utils.ComponentButton()
                        .setStyle(detritus.Constants.MessageComponentButtonStyles.DANGER)
                        .setCustomId('tictactoe_no')
                        .setEmoji({ name: '❌', id: undefined })
                ]
            }]
        });
        msgRepuesta = await ctx.fetchResponse();
    } else await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);

    partidas.add(ctx.channelId);

    if (ctx.client.user.id != secondp.id) {

        const respuesta: string | undefined = await new Promise(resolve => {
            const collector = new ButtonCollector(msgRepuesta, { timeLimit: 60 * 1000, filter: (m) => m.userId == secondp.id && ['tictactoe_no', 'tictactoe_yes'].some(item => item == m.data.customId) }, ctx.client);

            collector.on('collect', (interaction) => {
                resolve(interaction.data.customId);
            }).on('end', () => {
                resolve(undefined);
            });

        });

        if (!respuesta) {
            if (!msgRepuesta.deleted) await ctx.editOrRespond({
                embeds: [],
                content: langjson.commands.tictactoe.dont_answer(secondp.username), components: [{
                    type: 1,
                    components: [
                        new detritus.Utils.ComponentButton()
                            .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
                            .setCustomId('tictactoe_yes')
                            .setEmoji({ name: '✅', id: undefined })
                            .setDisabled(true),
                        new detritus.Utils.ComponentButton()
                            .setStyle(detritus.Constants.MessageComponentButtonStyles.PRIMARY)
                            .setCustomId('tictactoe_no')
                            .setEmoji({ name: '❌', id: undefined })
                            .setDisabled(true)
                    ]
                }]
            });
            return partidas.delete(ctx.channelId);
        }

        if (respuesta == 'tictactoe_no') {
            if (!msgRepuesta.deleted) await ctx.editOrRespond({ content: langjson.commands.tictactoe.deny(secondp.username), embeds: [], });
            return partidas.delete(ctx.channelId);
        }
    }

    users.set(secondp.id, secondp.username);
    users.set(firstp.id, firstp.username);

    let msg: detritus.Structures.Message;

    if (partida.player != ctx.client.user.id) {
        await ctx.editOrRespond({
            content: `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}\n\n${langjson.commands.tictactoe.start(partida.player == firstp.id ? firstp.username : secondp.username, emojis[partida.ficha])}`,
            components: generateButtons(partida),
            embed: { color: 0xff0000, description: '\u200b' },
        });
        msg = await ctx.fetchResponse();
    } else {
        partida.play(await AIplay(partida));
        await ctx.editOrRespond({
            content: `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}`,
            components: generateButtons(partida),
            embed: { color: 0xff0000, description: '\u200b' },
        });
        msg = await ctx.fetchResponse();
    }

    const collector = new ButtonCollector(msg, {
        timeIdle: (2 * 60) * 1000, timeLimit: (5 * 60) * 1000,
        filter: (m) => m.userId === partida.player && partida.canPlay(parseInt(m.data.customId.split('tictactoe_')[1])) && !partida.finished
    }, ctx.client);

    collector.on('end', r => {
        if (['channelDelete', 'messageDelete', 'guildDelete', 'threadDelete'].includes(r)) return partidas.delete(ctx.channelId);
        if ((r != 'NO')) {
            return !partida || partida.finished ? null : partida.emit('end');
        }
    }).on('collect', async (m) => {

        partida.play(parseInt(m.data.customId.split('tictactoe_')[1]));

        if (partida.finished) {
            collector.stop('');
            return;
        }

        await msg.edit({
            content: `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}`,
            components: generateButtons(partida)
        });

        if (!partida.finished && partida.player == ctx.client.user.id) {

            await m.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_UPDATE_MESSAGE);

            partida.play(await AIplay(partida));
            if (!partida.finished) {

                if (m.deleted) return collector.stop('messageDelete');

                await msg.edit({
                    content: `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}`,
                    components: generateButtons(partida)
                });

            }
        }
    });

    partida.on('winner', async () => {
        const jugador = partida.player;
        partidas.delete(ctx.channelId);
        const embed = new MessageEmbed()
            .setColor(14720566)
            .setDescription(langjson.commands.tictactoe.win(users.get(jugador)));

        const positions = pos.find(p => p.every(x => partida.map[x] == 'X')) || pos.find(p => p.every(x => partida.map[x] == 'O')),
            botones = generateButtons(partida, true),
            pasaber = [...botones[0].components, ...botones[1].components, ...botones[2].components];

        let fila = 0;

        for (const i in pasaber) {
            const numero = parseInt(i);

            if (numero == 3)
                fila = 1;
            else if (numero == 6)
                fila = 2;

            const check = positions.some(item => item == numero);
            if (check)
                (botones[fila].components[numero % 3] as detritus.Utils.ComponentButton).setStyle(detritus.Constants.MessageComponentButtonStyles.SUCCESS);

        }

        collector.stop('NO');

        await ctx.editOrRespond({ embed, components: botones });

    });

    partida.on('draw', async () => {
        const jugadores = partida.players;
        partidas.delete(ctx.channelId);
        const embed = new MessageEmbed()
            .setColor(14720566)
            .setDescription(langjson.commands.tictactoe.draw(users.get(jugadores[0]), users.get(jugadores[1])));

        collector.stop('NO');

        const empate = await ctx.editOrRespond({
            embed,
            components: generateButtons(partida, true, langjson.commands.tictactoe.rematch)
        });

        const res: INTERACTION | false = await new Promise(resolve => {

            const collectorRepeat = new ButtonCollector(empate, {
                timeLimit: 30 * 1000,
                filter: m => jugadores.includes(m.userId) && m.data.customId == 'tictactoe_repeat'
            }, ctx.client);

            collectorRepeat.on('end', () => {
                resolve(false);
            }).on('collect', m => resolve(m));

        });

        if (res) {
            const temp = [res.member.id != firstp.id ? secondp : firstp, res.member.id == firstp.id ? secondp : firstp];
            return jugar(temp[0], temp[1], ctx, langjson);
        }

    });

    partida.on('end', async () => {
        partidas.delete(ctx.channelId);
        const embed = new MessageEmbed()
            .setColor(14720566)
            .setDescription(langjson.commands.tictactoe.game_over);

        collector.stop('NO');

        await ctx.editOrRespond({ embed, components: generateButtons(partida, true) });

    });

    return true;

}

export function tictactoe() {
    class TicTacToe extends BaseCommandOption {
        constructor() {
            super({
                options: [
                    {
                        name: 'user',
                        type: detritus.Constants.ApplicationCommandOptionTypes.USER,
                        required: true,
                        description: 'User to be re-reached',
                    },
                ],
            });
            this.name = 'tictactoe';
            this.description = 'Play tictactoe';
            this.metadata = {
                usage(prefix: string) {
                    return [
                        `${prefix}play tictactoe @Zenitsu.`,
                        `${prefix}play tictactoe @User`
                    ];
                },
                category: 'fun',
            };
        }

        async run(
            ctx: detritus.Interaction.InteractionContext,
            args: { user: detritus.Structures.MemberOrUser }
        ) {

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
