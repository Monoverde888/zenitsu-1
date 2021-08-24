import detritus                from "detritus-client";
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import redis                   from '../../../../utils/managers/redis.js';
import c4                      from '@lil_marcrock22/connect4-ai';
import {IDS}                   from '../../../../utils/const.js';
import Collector, {Fixed}      from '../../../../utils/collectors/button.js';
import getUser                 from '../../../../utils/functions/getuser.js';
import json                    from '../../../../utils/lang/langs.js';
import getGuild                from '../../../../utils/functions/getguild.js';
import model, {USER}           from '../../../../database/models/user.js';
import Button                  from '../../../../utils/buttons/normal.js';
import Component               from '../../../../utils/buttons/component.js';
import fetch                   from 'node-fetch';

const {Connect4AI} = c4
const games : Map<string, c4.Connect4AI<Player>> = new Map();
const {Constants : {Permissions : Flags}} = detritus;
const zenitsuGif = `https://media1.tenor.com/images/07622a68b0145d04d1fa5536aa62faee/tenor.gif?itemid=17636946`

interface Player {
    id : string;
    turn : number;
}

function generateButtons(partida : c4.Connect4AI<Player>, text : string, forceDisable : boolean) {

    const buttons = [
        new Button('primary')
            .setCustomID('c4_0')
            .setLabel('1'),
        new Button('primary')
            .setCustomID('c4_1')
            .setLabel('2'),
        new Button('primary')
            .setCustomID('c4_2')
            .setLabel('3'),
        new Button('primary')
            .setCustomID('c4_3')
            .setLabel('4'),
        new Button('primary')
            .setCustomID('c4_4')
            .setLabel('5'),
        new Button('primary')
            .setCustomID('c4_5')
            .setLabel('6'),
        new Button('primary')
            .setCustomID('c4_6')
            .setLabel('7'),
        new Button('danger')
            .setCustomID('c4_surrender')
            .setLabel(text)
    ]

    if (!forceDisable) {

        for (let i = 0 ; i < 7 ; i++) {
            if (!partida) {
                buttons[i].setDisabled(true);
                continue;
            }
            if (!partida.canPlay(i))
                buttons[i].setDisabled(true);
        }

        if (!partida) buttons[7].setDisabled(true);

    }
    else {

        for (const i of buttons) {
            i.setDisabled(true);
        }

    }

    return [
        new Component(...buttons.slice(0, 5)),
        new Component(...buttons.slice(5))
    ];

}

async function displayConnectFourBoard(game : c4.Connect4AI<Player>) {
    return await fetch(
        `${process.env.DISPLAYCONNECT4}/${encodeURIComponent(JSON.stringify({game}))}.gif`
        , {
            headers :
                {'authorization' : process.env.APIKEY}
        }).then(x => x.buffer());
}

async function modificar(data : USER, dif : string, tipo : 'ganadas' | 'empates' | 'perdidas', nombre : string) {

    const coso = `c4${dif}` as 'c4easy' | 'c4medium' | 'c4hard';
    data[coso] = data[coso] || {ganadas : 0, empates : 0, perdidas : 0};
    data[coso][tipo] = data[coso][tipo] ? data[coso][tipo] + 1 : 1;
    data.cacheName = nombre;
    return model.findOneAndUpdate({id : data.id}, data, {new : true});

}

function getTURNS(author : string, mention : string, clientID : string) : [Player, Player] {

    if (mention != clientID) {
        const user1 = Math.floor(Math.random() * 2) + 1 == 2 ? 2 : 1
        const user2 = user1 == 2 ? 1 : 2
        return [{
            id : mention,
            turn : user1
        },
            {
                id : author,
                turn : user2
            }]
    }

    return [{
        id : mention,
        turn : 2
    },
        {
            id : author,
            turn : 1
        }];

}

function awaitAnswer(MESSAGEID : string,
                     sendCoso : (embed : MessageEmbed, value : Buffer, interaction? : Fixed) => Promise<detritus.Structures.Message>,
                     ctx : detritus.Interaction.InteractionContext,
                     findTurn : (user : string, CHANNEL : string) => Player,
                     ArrayOfArrayOfNumbers : [number, number, string][],
                     args : { user : detritus.Structures.MemberOrUser; difficulty : 'easy' | 'medium' | 'hard' },
                     DATAPROFILE : USER,
                     usuario : detritus.Structures.Member | detritus.Structures.User,
                     langjson : typeof json.es | typeof json.en,
                     difficulty : 'easy' | 'medium' | 'hard',
                     easyAnswer : (id : string) => any,
                     CHANNEL : { id : string },
) {

    Collector.add({
        async onCollect(interaction) {

            const collector = Collector._listeners.find(item => item.messageID == MESSAGEID);

            if (interaction.data.customId === 'c4_surrender')
                return Collector.stop('surrender', collector, true);

            games.get(CHANNEL.id).play(parseInt(interaction.data.customId.split('c4_')[1]))

            const game = games.get(CHANNEL.id);
            const board = game.map[(parseInt(interaction.data.customId.split('c4_')[1]))];
            let temp = findTurn(interaction.userId, CHANNEL.id).turn == 1 ? 'red' : 'yellow';
            ArrayOfArrayOfNumbers.push([board.filter(x => x.key).length - 1, parseInt(interaction.data.customId.split('c4_')[1]), temp]);

            if (games.get(CHANNEL.id).solution) {
                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4.win(interaction.user.username))
                    .setColor(0xff0000)
                    .setImage('attachment://party.gif');
                await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
                const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
                await sendCoso(embed, buf, interaction);

                if (usuario.id == ctx.client.user.id) {

                    const a = await model.findOne({id : ctx.user.id}).lean();
                    const res = await modificar(a, args.difficulty, 'ganadas', ctx.user.username);
                    await redis.set(ctx.user.id, JSON.stringify(res));

                    if (args.difficulty == 'hard' && a.c4hard) {

                        if ((a.c4hard.ganadas >= 10) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL1))) {

                            const data = await model.findOneAndUpdate({id : ctx.user.id}, {$addToSet : {achievements : IDS.ACHIEVEMENTS.C4LEVEL1}}, {new : true}).lean();
                            await redis.set(ctx.user.id, JSON.stringify(data));

                        }

                        else if ((a.c4hard.ganadas >= 15) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL2))) {

                            const data = await model.findOneAndUpdate({id : ctx.user.id}, {$addToSet : {achievements : IDS.ACHIEVEMENTS.C4LEVEL2}}, {new : true}).lean();
                            await redis.set(ctx.user.id, JSON.stringify(data));

                        }

                        else if ((a.c4hard.ganadas >= 25) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL3))) {

                            const data = await model.findOneAndUpdate({id : ctx.user.id}, {$addToSet : {achievements : IDS.ACHIEVEMENTS.C4LEVEL3}}, {new : true}).lean();
                            await redis.set(ctx.user.id, JSON.stringify(data));

                        }

                        else if ((a.c4hard.ganadas >= 50) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL4))) {

                            const data = await model.findOneAndUpdate({id : ctx.user.id}, {$addToSet : {achievements : IDS.ACHIEVEMENTS.C4LEVEL4}}, {new : true}).lean();
                            await redis.set(ctx.user.id, JSON.stringify(data));

                        }

                    }

                }

                games.delete(CHANNEL.id);
                return Collector.stop('win', collector);

            }

            else if (games.get(CHANNEL.id).tie) {
                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.user.username))
                    .setColor(0xff0000)
                    .setImage('attachment://party.gif');
                const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
                await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
                await sendCoso(embed, buf, interaction);

                if (usuario.id == ctx.client.user.id) {
                    const da = await model.findOne({id : ctx.user.id}).lean();
                    const res = await modificar(da, args.difficulty, 'empates', ctx.user.username);
                    await redis.set(ctx.userId, JSON.stringify(res));
                }
                games.delete(CHANNEL.id);
                return Collector.stop('win', collector);
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
                        .setColor(0xff0000)
                        .setImage('attachment://party.gif');
                    await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
                    const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
                    await sendCoso(embed, buf, interaction);

                    const da = await model.findOne({id : ctx.user.id}).lean();
                    const res = await modificar(da, args.difficulty, 'perdidas', ctx.user.username);
                    await redis.set(ctx.userId, JSON.stringify(res));
                    games.delete(CHANNEL.id);
                    return Collector.stop('win', collector);
                }

                else if (games.get(CHANNEL.id).tie) {
                    const embed = new MessageEmbed()
                        .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.user.username))
                        .setColor(0xff0000)
                        .setImage('attachment://party.gif');
                    await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
                    const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
                    await sendCoso(embed, buf, interaction);

                    const da = await model.findOne({id : ctx.user.id}).lean();
                    const res = await modificar(da, args.difficulty, 'empates', ctx.user.username);
                    await redis.set(ctx.userId, JSON.stringify(res));
                    games.delete(CHANNEL.id);
                    return Collector.stop('win', collector);
                }

                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4.turn(ctx.user.username, '🔴'))
                    .setFooter(args.difficulty)
                    .setColor(0xff0000)
                    .setImage('attachment://party.gif');
                await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
                const buf = await displayConnectFourBoard(games.get(CHANNEL.id))

                const {id} = await interaction.editOrRespond({
                    file : {
                        value : buf,
                        filename : 'party.gif'
                    },
                    embed,
                    components : generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false)
                })

                return easyAnswer(id);

            }

            if ((usuario.id != ctx.client.user.id) && (games.get(CHANNEL.id))) {
                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4.turn(
                        findTurn(ctx.user.id, CHANNEL.id).turn == findTurn(interaction.userId, CHANNEL.id).turn ? usuario.username : ctx.user.username,
                        findTurn(interaction.userId, CHANNEL.id).turn == 2 ? `🔴` : `🟡`
                    ))
                    .setFooter(args.difficulty)
                    .setColor(0xff0000)
                    .setImage('attachment://party.gif');
                await interaction.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
                const buf = await displayConnectFourBoard(games.get(CHANNEL.id));

                const {id} = await interaction.editOrRespond({
                    file : {
                        value : buf,
                        filename : 'party.gif'
                    },
                    embed,
                    components : generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false)
                })
                return easyAnswer(id);

            }
        },
        async onStop(reason, x) {

            if (reason != 'surrender') {
                if (x && x.running) Collector.stop('max', x);
                if (reason == 'max') return;
            }

            if (reason === 'surrender' && games.get(CHANNEL.id)) {
                if (usuario.id == ctx.client.user.id) {
                    const da = await model.findOne({id : ctx.user.id}).lean();
                    const res = await modificar(da, args.difficulty, 'perdidas', ctx.user.username);
                    await redis.set(ctx.userId, JSON.stringify(res));
                }
                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4.game_over)
                    .setColor(0xff0000)
                    .setImage('attachment://party.gif');
                const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
                await sendCoso(embed, buf);

                return games.delete(CHANNEL.id);
            }

            else if (reason === 'idle' && games.get(CHANNEL.id)) {
                if (usuario.id == ctx.client.user.id) {
                    const da = await model.findOne({id : ctx.user.id}).lean();
                    const res = await modificar(da, args.difficulty, 'perdidas', ctx.user.username);
                    await redis.set(ctx.userId, JSON.stringify(res));
                }
                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4.time_over)
                    .setColor(0xff0000)
                    .setImage(`attachment://4enraya.gif`)
                    .setImage('attachment://party.gif');
                const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
                await sendCoso(embed, buf);

                return games.delete(CHANNEL.id);

            }

            else if (reason == 'time' && games.get(CHANNEL.id)) {
                if (usuario.id == ctx.client.user.id) {
                    const da = await model.findOne({id : ctx.user.id}).lean();
                    const res = await modificar(da, args.difficulty, 'perdidas', ctx.user.username);
                    await redis.set(ctx.userId, JSON.stringify(res));
                }
                const embed = new MessageEmbed()
                    .setDescription(langjson.commands.connect4.game_over2)
                    .setColor(0xff0000)
                    .setImage('attachment://party.gif');
                const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
                await sendCoso(embed, buf);

                return games.delete(CHANNEL.id);
            }
            else return games.delete(CHANNEL.id)

        }
    }, (interaction) => {

        if (!games.get(CHANNEL.id).players.some(item => item.id == interaction.userId)) {
            void interaction.respond({data : {content : langjson.commands.connect4.wait, flags : 64}, type : 4});
            return false;
        }
        if (!findTurn(interaction.userId, CHANNEL.id)) return;
        if (usuario.id != ctx.client.user.id) {

            if (!games.get(CHANNEL.id)) return false;

            return ['c4_1', 'c4_2', 'c4_3', 'c4_4', 'c4_5', 'c4_6', 'c4_0', 'c4_surrender'].includes(interaction.data.customId)
                && findTurn(interaction.userId, CHANNEL.id).turn === games.get(CHANNEL.id).turn
                && !games.get(CHANNEL.id).finished
                || ((games.get(CHANNEL.id).players.some(item => item.id == interaction.userId) && interaction.data.customId == 'c4_surrender'))

        }

        else {
            return interaction.userId == ctx.user.id
                && findTurn(interaction.userId, CHANNEL.id).turn === games.get(CHANNEL.id).turn
                && ['c4_1', 'c4_2', 'c4_3', 'c4_4', 'c4_5', 'c4_6', 'c4_0', 'c4_surrender'].includes(interaction.data.customId)
                && !games.get(CHANNEL.id).finished
                || ((games.get(CHANNEL.id).players.some(item => item.id == interaction.userId) && interaction.data.customId == 'c4_surrender'))
        }
    }, {idle : ((3 * 60) * 1000), time : 0, max : 1}, {
        channelID : CHANNEL.id,
        messageID : MESSAGEID,
        guildID : ctx.guildId
    });

}

export async function FUNCTION(
    ctx : detritus.Interaction.InteractionContext,
    args : { user : detritus.Structures.MemberOrUser; difficulty : 'easy' | 'medium' | 'hard', needtoconnect? : string }
) {

    await ctx.respond(detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE);
    const ArrayOfArrayOfNumbers : [number, number, string][] = [];
    const DATAPROFILE = await getUser(ctx.user.id);
    const DATAGUILD : { lang : 'es' | 'en'; onlythreads : boolean } = ctx.guildId ? await getGuild(ctx.guildId) : {
        lang : 'en',
        onlythreads : false
    }
    const langjson = json[DATAGUILD.lang];

    if (games.get(ctx.channelId)) {
        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setDescription(langjson.commands.connect4.curso)
        return ctx.editOrRespond({embed});
    }

    const difficulty = args.difficulty
    let usuario = difficulty ? ctx.client.user : args.user;

    if (!difficulty) {
        if ((!usuario) || (usuario.id == ctx.user.id) || (usuario.bot)) {
            const embed = new MessageEmbed()
                .setDescription(langjson.commands.connect4.mention)
                .setFooter(langjson.commands.connect4.footer)
                .setColor(0xff0000)

            return ctx.editOrRespond({embed});
        }
    }

    const findTurn = (user : string, CHANNEL : string) => games.get(CHANNEL) && games.get(CHANNEL).players ? games.get(CHANNEL).players.find(item => item.id == user) : null;

    const poto = new Connect4AI<Player>({
        lengthArr : 6,
        columns : 7,
        necessaryToWin : parseInt(args.needtoconnect) || 4
    }, getTURNS(ctx.userId, usuario.id, ctx.client.userId), 10);
    poto.createBoard();
    console.log(poto.necessaryToWin);
    const CHANNEL : { id : string; type? : number } = ctx.channel && ctx.guild && !ctx.channel.isGuildThread && ctx.guild.features.has("THREADS_ENABLED") && ctx.channel.can(Flags.MANAGE_THREADS) ? await ctx.channel.createThread({
        name : `Game of ${ctx.user.tag} vs ${usuario.tag}`,
        autoArchiveDuration : 1440,
        type : 11,
        reason : `Game of ${ctx.user.tag} vs ${usuario.tag}`
    }) : {id : ctx.channelId};

    if (CHANNEL.type != 11 && DATAGUILD.onlythreads && !ctx.channel?.isGuildThread) {
        const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setDescription(langjson.commands.connect4.enable_threads('/'))
            .setThumbnail(zenitsuGif);
        return ctx.editOrRespond({embed});
    }

    games.set(CHANNEL.id, poto)

    if (usuario.id != ctx.client.user.id) {

        const Buttons = [
            new Button('primary')
                .setCustomID('c4_yes')
                .setEmoji({name : '✅', id : undefined}),
            new Button('danger')
                .setCustomID('c4_no')
                .setEmoji({name : '❌', id : undefined})
        ];

        const wait = await ctx.editOrRespond({
            content : langjson.commands.connect4.wait_user(usuario.username),
            components : [new Component(...Buttons)]
        });

        const respuesta : string | undefined = await new Promise(resolve => {
            Collector.add({
                    onCollect(interaction) {
                        resolve(interaction.data.customId);
                    },
                    onStop() {
                        resolve(undefined);
                    }
                },
                (interaction) => interaction.userId == usuario.id && ['c4_yes', 'c4_no'].some(item => item == interaction.data.customId),
                {time : (60) * 1000, max : 2, idle : 0},
                {channelID : CHANNEL.id, messageID : wait.id, guildID : ctx.guildId});
        });

        if (!respuesta) {
            games.delete(CHANNEL.id)
            return ctx.editOrRespond(langjson.commands.connect4.dont_answer(usuario.username))
        }

        if (respuesta == 'c4_no') {
            games.delete(CHANNEL.id)
            return ctx.editOrRespond(langjson.commands.connect4.deny(usuario.username))
        }

    }

    const embedStart = new MessageEmbed()
        .setDescription(langjson.commands.connect4.start(findTurn(ctx.user.id, CHANNEL.id).turn == 1 ? ctx.user.username : usuario.username))
        .setColor(0xff0000)
        .setImage('attachment://party.gif');
    const bufParty = await displayConnectFourBoard(games.get(CHANNEL.id))

    const messageParty = await ctx.client.rest.createMessage(CHANNEL.id, {
        file : {
            value : bufParty,
            filename : 'party.gif'
        },
        embed : embedStart,
        components : generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false)
    });

    async function sendCoso(embed : MessageEmbed, value : Buffer, interaction? : Fixed) {

        if (ArrayOfArrayOfNumbers.length) {

            const data = await model.findOneAndUpdate({id : ctx.client.userId}, {
                $push : {
                    c4Maps : {
                        maps : ArrayOfArrayOfNumbers,
                        users : [ctx.userId, usuario.id],
                        dif : args.difficulty
                    }
                }
            }, {new : true, upsert : true});
            await redis.set(ctx.client.userId, JSON.stringify(data));

            embed.setFooter('/connect4 view ' + JSON.parse(JSON.stringify(data.c4Maps[data.c4Maps.length - 1]))._id);

        }

        return interaction ? interaction.editOrRespond({
            embed,
            file : {filename : 'party.gif', value},
            components : generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, true)
        }) : ctx.client.rest.createMessage(CHANNEL.id, {
            embed,
            file : {filename : 'party.gif', value},
            components : generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, true)
        });

    }

    function easyAwaitAnswer(MESSAGEID : string) {
        awaitAnswer(MESSAGEID, sendCoso, ctx, findTurn, ArrayOfArrayOfNumbers, args, DATAPROFILE, usuario, langjson, difficulty, easyAwaitAnswer, CHANNEL);
    }

    return easyAwaitAnswer(messageParty.id);

}
