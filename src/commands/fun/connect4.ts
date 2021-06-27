import redis from '../../utils/managers/redis.js';
import c4 from 'connect4-ai';
const { Connect4AI } = c4
import Collector from '../../utils/collectors/button.js';
const games: Map<string, c4.Connect4AI> = new Map();
import BaseCommand from '../../utils/classes/command.js';
import getUser from '../../utils/functions/getuser.js';
import json from '../../utils/lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../utils/functions/getguild.js';
import parseArgs from '../../utils/functions/parseargs.js';
import model from '../../database/models/user.js';
import Button from '../../utils/buttons/normal.js';
import Component from '../../utils/buttons/component.js';

function generateButtons(partida: c4.Connect4AI, text: string) {

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

  for (let i = 0; i < 7; i++) {
    if (!partida) {
      buttons[i].setDisabled(true);
      continue;
    }
    if (!partida.canPlay(i))
      buttons[i].setDisabled(true);
  }

  if (!partida) buttons[7].setDisabled(true);

  return [
    new Component(...buttons.slice(0, 5)),
    new Component(...buttons.slice(5))
  ];

}

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
      return ctx.reply({
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

      return ctx.reply({
        embed
      });
    }

    const findTurn = (user: string) => games.get(ctx.message.guildId) && games.get(ctx.message.guildId).jugadores ? games.get(ctx.message.guildId).jugadores.find(item => item.id == user) : null;

    if (usuario.id != ctx.client.user.id)
      if (findTurn(usuario.id)) {
        return ctx.reply(langjson.commands.connect4.user_active(usuario.username));
      }

    if (findTurn(ctx.message.author.id)) {
      return ctx.reply(langjson.commands.connect4.author_active);
    }

    const poto = new Connect4AI();

    games.set(ctx.guildId, poto)

    if (usuario.id != ctx.client.user.id) {

      const Buttons = [
        new Button('primary')
          .setCustomID('c4_yes')
          .setLabel('Yes'),
        new Button('danger')
          .setCustomID('c4_no')
          .setLabel('No')
      ];

      const wait = await ctx.reply({ content: langjson.commands.connect4.wait_user(usuario.username), components: [new Component(...Buttons)] });

      const res: string | undefined = await new Promise(resolve => {
        Collector.add({
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
        return ctx.reply(langjson.commands.connect4.dont_answer(usuario.username))
      }

      if (respuesta == 'c4_no') {
        games.delete(ctx.guildId)
        return ctx.reply(langjson.commands.connect4.deny(usuario.username))
      }

      if (findTurn(usuario.id)) {
        games.delete(ctx.guildId)
        return ctx.reply(langjson.commands.connect4.user_active(usuario.username));
      }

      if (findTurn(ctx.message.author.id)) {
        games.delete(ctx.guildId)
        return ctx.reply(langjson.commands.connect4.author_active);
      }

    }

    if (usuario.id != ctx.client.user.id) {

      const user1 = Math.floor(Math.random() * 2) + 1 == 2 ? 2 : 1
      const user2 = user1 == 2 ? 1 : 2

      poto.jugadores = [{
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

      poto.jugadores = [{
        id: usuario.id,
        turn: user1
      },
      {
        id: ctx.message.author.id,
        turn: user2
      }]

    }


    const embedStart = new MessageEmbed()
      .setDescription(langjson.commands.connect4.start(findTurn(ctx.message.author.id).turn == 1 ? ctx.message.author.username : usuario.username))
      .setColor(0xff0000)
      .setImage(displayConnectFourBoard(games.get(ctx.guildId).ascii(), games.get(ctx.guildId)))

    const messageParty = await ctx.reply({ embed: embedStart, components: generateButtons(games.get(ctx.guildId), langjson.commands.connect4.surrender) });

    async function sendCoso(embed: MessageEmbed) {

      if (ArrayOfArrayOfNumbers.length) {

        const data = await model.findOneAndUpdate({ id: ctx.userId }, { $push: { c4Maps: { maps: ArrayOfArrayOfNumbers, users: [ctx.userId, usuario.id], dif: args[0] } } }, { new: true });
        await redis.set(ctx.userId, JSON.stringify(data));

        const data_user = await model.findOneAndUpdate({ id: usuario.id }, { $push: { c4Maps: { maps: ArrayOfArrayOfNumbers, users: [ctx.userId, usuario.id], dif: args[0] } } }, { new: true });
        await redis.set(usuario.id, JSON.stringify(data_user));

        embed.setFooter(ctx.prefix + 'connect4view ' + JSON.parse(JSON.stringify(data.c4Maps[data.c4Maps.length - 1]))._id);

      }

      return messageParty.edit({
        embed, components: generateButtons(games.get(ctx.guildId), langjson.commands.connect4.surrender)
      });

    }

    Collector.add({
      async onCollect(interaction) {

        const collector = Collector.listeners.find(item => item.messageID == messageParty.id);

        if (interaction.data.customId === 'c4_surrender')
          return Collector.stop('surrender', collector);

        games.get(ctx.guildId).play(parseInt(interaction.data.customId.split('c4_')[1]))

        const game = games.get(ctx.message.guildId);
        const board = game.board[(parseInt(interaction.data.customId.split('c4_')[1]))];
        let temp = findTurn(interaction.userId).turn == 1 ? 'red' : 'yellow';
        ArrayOfArrayOfNumbers.push([board.length - 1, parseInt(interaction.data.customId.split('c4_')[1]), temp]);

        if (games.get(interaction.guildId).gameStatus().gameOver && games.get(ctx.guildId).gameStatus().solution) {
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.win(interaction.user.username))
            .setColor(0xff0000)
            .setImage(displayConnectFourBoard(games.get(ctx.guildId).ascii(), games.get(ctx.guildId)))
          sendCoso(embed);

          if (usuario.id == ctx.client.user.id) {
            const a = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $inc: { [`c4${args[0]}.ganadas`]: 1 }, $set: { cacheName: ctx.message.author.username } }, { upsert: true, new: true });

            if (args[0] == 'hard' && a.c4hard) {

              if ((a.c4hard.ganadas >= 10) && !(DATAPROFILE.achievements.includes('c4level1'))) {

                const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: 'c4level1' } }, { new: true }).lean();
                await redis.set(ctx.message.author.id, JSON.stringify(data));

              }

              if ((a.c4hard.ganadas >= 25) && !(DATAPROFILE.achievements.includes('c4level2'))) {

                const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: 'c4level2' } }, { new: true }).lean();
                await redis.set(ctx.message.author.id, JSON.stringify(data));

              }

              if ((a.c4hard.ganadas >= 50) && !(DATAPROFILE.achievements.includes('c4level3'))) {

                const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: 'c4level3' } }, { new: true }).lean();
                await redis.set(ctx.message.author.id, JSON.stringify(data));

              }

              if ((a.c4hard.ganadas >= 100) && !(DATAPROFILE.achievements.includes('c4top'))) {

                const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: 'c4top' } }, { new: true }).lean();
                await redis.set(ctx.message.author.id, JSON.stringify(data));

              }

            }

          }
          return Collector.stop('win', collector);
        }

        else if (games.get(interaction.guildId).gameStatus().gameOver) {
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.message.author.username))
            .setColor(0xff0000)
            .setImage('attachment://4enraya.gif')
            .setImage(displayConnectFourBoard(games.get(interaction.guildId).ascii(), games.get(ctx.guildId)))

          messageParty.edit({ embed, components: generateButtons(games.get(ctx.guildId), langjson.commands.connect4.surrender) })
          if (usuario.id == ctx.client.user.id) await model.findOneAndUpdate({ id: ctx.message.author.id }, { $inc: { [`c4${args[0]}.empates`]: 1 }, $set: { cacheName: ctx.message.author.username } }, { upsert: true });
          return Collector.stop('win', collector);
        }

        if (usuario.id == ctx.client.user.id) {
          const old = games.get(ctx.guildId);
          const oldBoard = JSON.parse(JSON.stringify(old.board)) as { [x: string]: number[] };
          old.playAI(args[0]);
          const board = games.get(ctx.guildId).board;
          const index = Object.values(board).findIndex((arr, y) => arr.find((item, i) => item != Object.values(oldBoard)[y][i]))
          temp = findTurn(ctx.client.user.id).turn == 1 ? 'red' : 'yellow';
          ArrayOfArrayOfNumbers.push([board[index].length - 1, index, temp]);

          if (games.get(ctx.guildId).gameStatus().gameOver && games.get(ctx.guildId).gameStatus().solution) {
            const embed = new MessageEmbed()
              .setDescription(langjson.commands.connect4.win(usuario.username))
              .setColor(0xff0000)
              .setImage(displayConnectFourBoard(games.get(interaction.guildId).ascii(), games.get(ctx.guildId)))
            sendCoso(embed);
            await model.findOneAndUpdate({ id: ctx.message.author.id }, { $inc: { [`c4${args[0]}.perdidas`]: 1 }, $set: { cacheName: ctx.message.author.username } }, { upsert: true });
            return Collector.stop('win', collector);
          }

          else if ((games.get(ctx.guildId)).gameStatus().gameOver) {
            const embed = new MessageEmbed()
              .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.message.author.username))
              .setColor(0xff0000)
              .setImage(displayConnectFourBoard(games.get(interaction.guildId).ascii(), games.get(ctx.guildId)))

            sendCoso(embed);
            await model.findOneAndUpdate({ id: ctx.message.author.id }, { $inc: { [`c4${args[0]}.empates`]: 1 }, $set: { cacheName: ctx.message.author.username } }, { upsert: true });
            return Collector.stop('win', collector);
          }

          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.turn(ctx.message.author.username, '🔴'))
            .setColor(0xff0000)
            .setImage(displayConnectFourBoard(games.get(interaction.guildId).ascii(), games.get(ctx.guildId)))
            .setFooter(args[0])

          messageParty.edit({ embed, components: generateButtons(games.get(ctx.guildId), langjson.commands.connect4.surrender) })

        }

        if ((usuario.id != ctx.client.user.id) && (games.get(ctx.guildId))) {
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.turn(
              findTurn(ctx.message.author.id).turn == findTurn(interaction.userId).turn ? usuario.username : ctx.message.author.username,
              findTurn(interaction.userId).turn == 2 ? `🔴` : `🟡`
            ))
            .setImage(displayConnectFourBoard(games.get(interaction.guildId).ascii(), games.get(ctx.guildId)))
            .setColor(0xff0000);

          await messageParty.edit({ embed, components: generateButtons(games.get(ctx.guildId), langjson.commands.connect4.surrender) })

        }
      },
      async onStop(reason) {

        if (reason === 'surrender' && games.get(ctx.guildId)) {
          if (usuario.id == ctx.client.user.id) await model.findOneAndUpdate({ id: ctx.message.author.id }, { $inc: { [`c4${args[0]}.perdidas`]: 1 }, $set: { cacheName: ctx.message.author.username } }, { upsert: true });
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.game_over)
            .setColor(0xff0000)
            .setImage(`attachment://4enraya.gif`)
            .setImage(displayConnectFourBoard(games.get(ctx.guildId).ascii(), games.get(ctx.guildId)))

          sendCoso(embed);

          return games.delete(ctx.guildId);
        }

        else if (reason === 'idle' && games.get(ctx.guildId)) {
          if (usuario.id == ctx.client.user.id) await model.findOneAndUpdate({ id: ctx.message.author.id }, { $inc: { [`c4${args[0]}.perdidas`]: 1 }, $set: { cacheName: ctx.message.author.username } }, { upsert: true });
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.time_over)
            .setColor(0xff0000)
            .setImage(`attachment://4enraya.gif`)
            .setImage(displayConnectFourBoard(games.get(ctx.guildId).ascii(), games.get(ctx.guildId)))

          sendCoso(embed);

          return games.delete(ctx.guildId);

        }

        else if (reason == 'time' && games.get(ctx.guildId)) {
          if (usuario.id == ctx.client.user.id) await model.findOneAndUpdate({ id: ctx.message.author.id }, { $inc: { [`c4${args[0]}.perdidas`]: 1 }, $set: { cacheName: ctx.message.author.username } }, { upsert: true });
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.game_over2)
            .setColor(0xff0000)
            .setImage(displayConnectFourBoard(games.get(ctx.guildId).ascii(), games.get(ctx.guildId)));

          sendCoso(embed);

          return games.delete(ctx.guildId);
        }
        else return games.delete(ctx.message.guildId)

      }
    }, (interaction) => {

      if (!games.get(interaction.guildId).jugadores.some(item => item.id == interaction.userId)) {
        interaction.createResponse({ data: { content: langjson.commands.connect4.wait, flags: 64 }, type: 4 });
        return false;
      }
      if (!findTurn(interaction.userId)) return;
      if (usuario.id != ctx.client.user.id) {

        if (!games.get(interaction.guildId)) return false;

        return ['c4_1', 'c4_2', 'c4_3', 'c4_4', 'c4_5', 'c4_6', 'c4_0', 'c4_surrender'].includes(interaction.data.customId)
          && findTurn(interaction.userId).turn === games.get(interaction.guildId).gameStatus().currentPlayer
          && !games.get(ctx.guildId).gameStatus().gameOver
          || ((games.get(ctx.guildId).jugadores.some(item => item.id == interaction.userId) && interaction.data.customId == 'c4_surrender'))

      }

      else return interaction.userId == ctx.message.author.id
        && findTurn(interaction.userId).turn === games.get(interaction.guildId).gameStatus().currentPlayer
        && ['c4_1', 'c4_2', 'c4_3', 'c4_4', 'c4_5', 'c4_6', 'c4_0', 'c4_surrender'].includes(interaction.data.customId)
        && !games.get(ctx.guildId).gameStatus().gameOver
        || ((games.get(ctx.guildId).jugadores.some(item => item.id == interaction.userId) && interaction.data.customId == 'c4_surrender'))

    }, { idle: ((3 * 60) * 1000), time: ((30 * 60) * 1000), max: 0 }, { channelID: ctx.channelId, messageID: messageParty.id, guildID: ctx.guildId });

  },
});

function displayConnectFourBoard(ascii: string, game: { solution: any; winner: number }) {
  let str = `https://zenitsu.eastus.cloudapp.azure.com/generateembed/${encodeURIComponent(JSON.stringify({ ascii, solutionAndWinner: game }))}.gif`
  return str;
}
