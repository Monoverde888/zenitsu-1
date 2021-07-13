import redis from '../../utils/managers/redis.js';
//Fixed version https://www.npmjs.com/package/@lil_marcrock22/connect4-ai
import c4 from '@lil_marcrock22/connect4-ai';
import fetch from 'node-fetch';
const { Connect4AI } = c4
import ButtonCollector from '../../utils/collectors/button.js';
import Collector from '../../utils/collectors/message.js';
interface PLAYER {
  id: string;
  turn: number
}
const games: Map<string, c4.Connect4AI<PLAYER>> = new Map();
import BaseCommand from '../../utils/classes/command.js';
import getUser from '../../utils/functions/getuser.js';
import json from '../../utils/lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../utils/functions/getguild.js';
import parseArgs from '../../utils/functions/parseargs.js';
import model, { USER } from '../../database/models/user.js';
import Button from '../../utils/buttons/normal.js';
import Component from '../../utils/buttons/component.js';

/*function generateButtons(partida: c4.Connect4AI<PLAYER>, text: string, forceDisable: boolean) {

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

  return [
    new Component(...buttons.slice(0, 5)),
    new Component(...buttons.slice(5))
  ];

}*/

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [
        `${prefix}connect4 <easy/medium/hard>`,
        `${prefix}connect4 @User`
      ]
    },
    category: 'fun'
  },
  name: 'connect4',
  aliases: ['fourinrow', '4enlinea', 'c4'],
  async run(ctx, { arg }) {

    const ArrayOfArrayOfNumbers: [number, number, string][] = [];
    const DATAPROFILE = await getUser(ctx.message.author.id);
    const langjson = await getGuild(ctx.guildId).then(x => json[x.lang]);
    const args = parseArgs(arg);

    if (games.get(ctx.guildId)) {
      const embed = new MessageEmbed()
        .setColor(0xff0000)
        .setDescription(langjson.commands.connect4.curso)
      return ctx.message.channel.createMessage({
        embed
      });
    }

    args[0] = args[0] ? args[0].toLowerCase() : null;

    const usuario = ['easy', 'medium', 'hard'].includes(args[0]) ? ctx.client.user : ctx.message.mentions.filter(user => !user.bot)[0];

    if ((!usuario) || (usuario.id == ctx.message.author.id) || (usuario.bot && usuario.id != ctx.client.user.id)) {
      const embed = new MessageEmbed()
        .setDescription(langjson.commands.connect4.mention)
        .setFooter(langjson.commands.connect4.footer)
        .setColor(0xff0000)

      return ctx.message.channel.createMessage({
        embed
      });
    }

    const CODE = `${ctx.userId}${ctx.guildId}${Math.random()}${Date.now()}`;

    const findTurn = (user: string) => games.get(ctx.message.guildId) && games.get(ctx.message.guildId).players ? games.get(ctx.message.guildId).players.find(item => item.id == user) : null;

    if (usuario.id != ctx.client.user.id)
      if (findTurn(usuario.id)) {
        return ctx.message.channel.createMessage(langjson.commands.connect4.user_active(usuario.username));
      }

    if (findTurn(ctx.message.author.id)) {
      return ctx.message.channel.createMessage(langjson.commands.connect4.author_active);
    }

    const THEGAME = new Connect4AI<PLAYER>({ lengthArr: 6, columns: 7 }, []);
    THEGAME.createBoard();
    games.set(ctx.guildId, THEGAME)

    if (usuario.id != ctx.client.user.id) {

      const Buttons = [
        new Button('primary')
          .setCustomID('c4_yes')
          .setEmoji({ name: '✅', id: undefined }),
        new Button('danger')
          .setCustomID('c4_no')
          .setEmoji({ name: '❌', id: undefined })
      ];

      const wait = await ctx.message.channel.createMessage({ content: langjson.commands.connect4.wait_user(usuario.username), components: [new Component(...Buttons)] });

      const res: string | undefined = await new Promise(resolve => {
        ButtonCollector.add({
          onCollect(interaction) {
            resolve(interaction.data.customId);
          },
          onStop() {
            resolve(undefined);
          }
        },
          (interaction) => interaction.userId == usuario.id && ['c4_yes', 'c4_no'].some(item => item == interaction.data.customId),
          { time: (1 * 60) * 1000, max: 2, idle: 0 },
          { channelID: ctx.channelId, messageID: wait.id, guildID: ctx.guildId });
      });

      const respuesta = res;

      if (!respuesta) {
        games.delete(ctx.guildId)
        return ctx.message.channel.createMessage(langjson.commands.connect4.dont_answer(usuario.username))
      }

      if (respuesta == 'c4_no') {
        games.delete(ctx.guildId)
        return ctx.message.channel.createMessage(langjson.commands.connect4.deny(usuario.username))
      }

      if (findTurn(usuario.id)) {
        games.delete(ctx.guildId)
        return ctx.message.channel.createMessage(langjson.commands.connect4.user_active(usuario.username));
      }

      if (findTurn(ctx.message.author.id)) {
        games.delete(ctx.guildId)
        return ctx.message.channel.createMessage(langjson.commands.connect4.author_active);
      }

    }

    if (usuario.id != ctx.client.user.id) {

      const user1 = Math.floor(Math.random() * 2) + 1 == 2 ? 2 : 1
      const user2 = user1 == 2 ? 1 : 2

      THEGAME.players = [{
        id: usuario.id,
        turn: user1
      },
      {
        id: ctx.message.author.id,
        turn: user2
      }]

    }

    else {

      const user1 = 2
      const user2 = 1

      THEGAME.players = [{
        id: usuario.id,
        turn: user1
      },
      {
        id: ctx.message.author.id,
        turn: user2
      }];

    }


    const embedStart = new MessageEmbed()
      .setDescription(langjson.commands.connect4.start(findTurn(ctx.message.author.id).turn == 1 ? ctx.message.author.username : usuario.username))
      .setColor(0xff0000)
      .setImage('attachment://file.gif');

    await ctx.message.channel.createMessage({ embed: embedStart, files: [{ value: await displayConnectFourBoard(games.get(ctx.guildId)), filename: 'file.gif' }] });

    async function sendCoso(embed: MessageEmbed, buf: Buffer) {

      if (ArrayOfArrayOfNumbers.length) {

        const data = await model.findOneAndUpdate({ id: ctx.client.userId }, { $push: { c4Maps: { maps: ArrayOfArrayOfNumbers, users: [ctx.userId, usuario.id], dif: args[0] } } }, { new: true, upsert: true });
        await redis.set(ctx.client.userId, JSON.stringify(data));

        embed.setFooter(ctx.prefix + 'connect4view ' + JSON.parse(JSON.stringify(data.c4Maps[data.c4Maps.length - 1]))._id);

      }

      return ctx.message.channel.createMessage({ embed, files: [{ filename: 'file.gif', value: buf }] });

    }

    Collector.add({
      async onCollect(interaction) {

        const message = interaction.message;

        const collector = Collector.listeners.find(item => item.CODE == CODE);

        if (message.content === 'surrender')
          return Collector.stop('surrender', collector);

        games.get(ctx.guildId).play(parseInt(message.content) - 1)

        const game = games.get(ctx.message.guildId);
        const board = game.array[parseInt(interaction.message.content) - 1];
        let temp = findTurn(message.author.id).turn == 1 ? 'red' : 'yellow';
        ArrayOfArrayOfNumbers.push([board.length - 1, parseInt(message.content) - 1, temp]);

        if (games.get(message.guildId).finished && games.get(ctx.guildId).solution) {
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.win(interaction.message.author.username))
            .setColor(0xff0000)
            .setImage('attachment://file.gif')
          sendCoso(embed, await displayConnectFourBoard(games.get(ctx.guildId)));;

          if (usuario.id == ctx.client.user.id) {

            const a = await model.findOne({ id: ctx.message.author.id }).lean();
            const res = await modificar(a, args[0].toLowerCase(), 'ganadas', ctx.user.username);
            await redis.set(ctx.message.author.id, JSON.stringify(res));

            if (args[0] == 'hard' && a.c4hard) {

              if ((a.c4hard.ganadas >= 10) && !(DATAPROFILE.achievements.includes('c4level1'))) {

                const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: 'c4level1' } }, { new: true }).lean();
                await redis.set(ctx.message.author.id, JSON.stringify(data));

              }

              else if ((a.c4hard.ganadas >= 15) && !(DATAPROFILE.achievements.includes('c4level2'))) {

                const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: 'c4level2' } }, { new: true }).lean();
                await redis.set(ctx.message.author.id, JSON.stringify(data));

              }

              else if ((a.c4hard.ganadas >= 25) && !(DATAPROFILE.achievements.includes('c4level3'))) {

                const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: 'c4level3' } }, { new: true }).lean();
                await redis.set(ctx.message.author.id, JSON.stringify(data));

              }

              else if ((a.c4hard.ganadas >= 50) && !(DATAPROFILE.achievements.includes('c4top'))) {

                const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: 'c4top' } }, { new: true }).lean();
                await redis.set(ctx.message.author.id, JSON.stringify(data));

              }

            }

          }
          return Collector.stop('win', collector);
        }

        else if (games.get(message.guildId).tie) {
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.message.author.username))
            .setColor(0xff0000)
            .setImage('attachment://4enraya.gif')
            .setImage('attachment://file.gif')

          sendCoso(embed, await displayConnectFourBoard(games.get(ctx.guildId)));;

          if (usuario.id == ctx.client.user.id) {
            const da = await model.findOne({ id: ctx.message.author.id }).lean();
            const res = await modificar(da, args[0].toLowerCase(), 'empates', ctx.user.username);
            await redis.set(ctx.userId, JSON.stringify(res));
          }
          return Collector.stop('win', collector);
        }

        if (usuario.id == ctx.client.user.id) {
          const old = games.get(ctx.guildId);
          const index = old.playAI(args[0] as 'easy');
          const board = games.get(ctx.guildId).map;
          temp = findTurn(ctx.client.user.id).turn == 1 ? 'red' : 'yellow';
          ArrayOfArrayOfNumbers.push([board[index].length - 1, index, temp]);

          if (games.get(ctx.guildId).finished && games.get(ctx.guildId).solution) {
            const embed = new MessageEmbed()
              .setDescription(langjson.commands.connect4.win(usuario.username))
              .setColor(0xff0000)
              .setImage('attachment://file.gif')
            sendCoso(embed, await displayConnectFourBoard(games.get(ctx.guildId)));;
            const da = await model.findOne({ id: ctx.message.author.id }).lean();
            const res = await modificar(da, args[0].toLowerCase(), 'perdidas', ctx.user.username);
            await redis.set(ctx.userId, JSON.stringify(res));
            return Collector.stop('win', collector);
          }

          else if ((games.get(ctx.guildId)).tie) {
            const embed = new MessageEmbed()
              .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.message.author.username))
              .setColor(0xff0000)
              .setImage('attachment://file.gif')

            sendCoso(embed, await displayConnectFourBoard(games.get(ctx.guildId)));;
            const da = await model.findOne({ id: ctx.message.author.id }).lean();
            const res = await modificar(da, args[0].toLowerCase(), 'empates', ctx.user.username);
            await redis.set(ctx.userId, JSON.stringify(res));
            return Collector.stop('win', collector);
          }

          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.turn(ctx.message.author.username, '🔴'))
            .setColor(0xff0000)
            .setFooter(args[0])
            .setImage('attachment://file.gif');

          await ctx.message.channel.createMessage({ embed: embed, files: [{ value: await displayConnectFourBoard(games.get(ctx.guildId)), filename: 'file.gif' }] });

        }

        if ((usuario.id != ctx.client.user.id) && (games.get(ctx.guildId))) {
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.turn(
              findTurn(ctx.message.author.id).turn == findTurn(message.author.id).turn ? usuario.username : ctx.message.author.username,
              findTurn(message.author.id).turn == 2 ? `🔴` : `🟡`
            ))
            .setColor(0xff0000)
            .setImage('attachment://file.gif');

          await ctx.message.channel.createMessage({ embed: embed, files: [{ value: await displayConnectFourBoard(games.get(ctx.guildId)), filename: 'file.gif' }] });

        }
      },
      async onStop(reason) {

        if (reason === 'surrender' && games.get(ctx.guildId)) {
          if (usuario.id == ctx.client.user.id) {
            const da = await model.findOne({ id: ctx.message.author.id }).lean();
            const res = await modificar(da, args[0].toLowerCase(), 'perdidas', ctx.user.username);
            await redis.set(ctx.userId, JSON.stringify(res));
          }
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.game_over)
            .setColor(0xff0000)
            .setImage(`attachment://4enraya.gif`)
            .setImage('attachment://file.gif')

          sendCoso(embed, await displayConnectFourBoard(games.get(ctx.guildId)));;

          return games.delete(ctx.guildId);
        }

        else if (reason === 'idle' && games.get(ctx.guildId)) {
          if (usuario.id == ctx.client.user.id) {
            const da = await model.findOne({ id: ctx.message.author.id }).lean();
            const res = await modificar(da, args[0].toLowerCase(), 'perdidas', ctx.user.username);
            await redis.set(ctx.userId, JSON.stringify(res));
          }
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.time_over)
            .setColor(0xff0000)
            .setImage(`attachment://4enraya.gif`)
            .setImage('attachment://file.gif')

          sendCoso(embed, await displayConnectFourBoard(games.get(ctx.guildId)));;

          return games.delete(ctx.guildId);

        }

        else if (reason == 'time' && games.get(ctx.guildId)) {
          if (usuario.id == ctx.client.user.id) {
            const da = await model.findOne({ id: ctx.message.author.id }).lean();
            const res = await modificar(da, args[0].toLowerCase(), 'perdidas', ctx.user.username);
            await redis.set(ctx.userId, JSON.stringify(res));
          }
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.game_over2)
            .setColor(0xff0000)
            .setImage('attachment://file.gif');

          sendCoso(embed, await displayConnectFourBoard(games.get(ctx.guildId)));

          return games.delete(ctx.guildId);
        }
        else return games.delete(ctx.message.guildId)

      }
    }, (interaction) => {

      const message = interaction.message;

      if (!games.get(ctx.guildId).canPlay(parseInt(message.content) - 1) && message.content != 'surrender')
        return;

      if (!games.get(message.guildId).players.some(item => item.id == message.author.id)) {
        return false;
      }
      if (!findTurn(message.author.id)) return;
      if (usuario.id != ctx.client.user.id) {

        if (!games.get(message.guildId)) return false;

        return findTurn(message.author.id).turn === games.get(message.guildId).turn
          && !games.get(ctx.guildId).finished
          || ((games.get(ctx.guildId).players.some(item => item.id == message.author.id) && message.content == 'surrender'))

      }

      else return message.author.id == ctx.message.author.id
        && findTurn(message.author.id).turn === games.get(message.guildId).turn
        && !games.get(ctx.guildId).finished
        || ((games.get(ctx.guildId).players.some(item => item.id == message.author.id) && message.content == 'surrender'))

    }, { idle: ((3 * 60) * 1000), time: ((30 * 60) * 1000), max: 0, CODE }, { channelID: ctx.channelId, guildID: ctx.guildId });

  },
});

async function displayConnectFourBoard(game: c4.Connect4AI<PLAYER>) {
  let str = `${process.env.DISPLAYCONNECT4}/${encodeURIComponent(JSON.stringify({ game }))}.gif`;
  const res = await fetch(str, {
    headers: { 'authorization': process.env.APIKEY }
  }).then(x => x.buffer());
  console.log(res);
  return res;
}

async function modificar(data: USER, dif: string, tipo: 'ganadas' | 'empates' | 'perdidas', nombre: string) {

  const coso = `c4${dif}` as 'c4easy' | 'c4medium' | 'c4hard';
  data[coso] = data[coso] || { ganadas: 0, empates: 0, perdidas: 0 };
  data[coso][tipo] = data[coso][tipo] ? data[coso][tipo] + 1 : 1;
  data.cacheName = nombre;
  const res = await model.findOneAndUpdate({ id: data.id }, data, { new: true });
  return res;

}
