import redis from '../../utils/managers/redis.js';
import c4 from '@lil_marcrock22/connect4-ai';
import { IDS } from '../../utils/const.js';
const { Connect4AI } = c4
import Collector from '../../utils/collectors/button.js';
import detritus from 'detritus-client'
const games: Map<string, c4.Connect4AI<Player>> = new Map();
import BaseCommand from '../../utils/classes/command.js';
import getUser from '../../utils/functions/getuser.js';
import json from '../../utils/lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../utils/functions/getguild.js';
import parseArgs from '../../utils/functions/parseargs.js';
import model, { USER } from '../../database/models/user.js';
import Button from '../../utils/buttons/normal.js';
import Component from '../../utils/buttons/component.js';
import fetch from 'node-fetch';
import { Flags } from '../../utils/const.js';
const zenitsuGif = `https://media1.tenor.com/images/07622a68b0145d04d1fa5536aa62faee/tenor.gif?itemid=17636946`

interface Player {
  id: string;
  turn: number;
}

function generateButtons(partida: c4.Connect4AI<Player>, text: string, forceDisable: boolean) {

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
  ratelimits: [
    { duration: 10 * 1000, limit: 1, type: 'user' },
  ],
  permissionsClient: [Flags.ATTACH_FILES, Flags.EMBED_LINKS],
  async run(ctx, { arg }) {

    const ArrayOfArrayOfNumbers: [number, number, string][] = [];
    const DATAPROFILE = await getUser(ctx.message.author.id);
    const DATAGUILD = await getGuild(ctx.guildId)
    const langjson = json[DATAGUILD.lang];
    const args = parseArgs(arg);

    const CHANNEL = (ctx.channel.type != 11) && ctx.guild.features.has("THREADS_ENABLED") && ctx.guild.me.can(Flags.MANAGE_THREADS) ? await ctx.message.createThread({ name: `Game of ${ctx.user.tag}`, autoArchiveDuration: 1440 }) : ctx.channel;

    if (CHANNEL.type != 11 && DATAGUILD.onlythreads) {
      const embed = new MessageEmbed()
        .setColor(0xff0000)
        .setDescription(langjson.commands.connect4.enable_threads(ctx.prefix))
        .setThumbnail(zenitsuGif);
      return ctx.reply({ embed });
    }

    if (games.get(CHANNEL.id)) {
      const embed = new MessageEmbed()
        .setColor(0xff0000)
        .setDescription(langjson.commands.connect4.curso)
      return ctx.reply({ embed });
    }

    args[0] = args[0] ? args[0].toLowerCase() : null;

    const difficulty = args[0] as 'easy' | 'medium' | 'hard' | null;
    const usuario = ['easy', 'medium', 'hard'].includes(args[0]) ? ctx.client.user : ctx.message.mentions.filter(user => !user.bot)[0];

    if ((!usuario) || (usuario.id == ctx.message.author.id) || (usuario.bot && usuario.id != ctx.client.user.id)) {
      const embed = new MessageEmbed()
        .setDescription(langjson.commands.connect4.mention)
        .setFooter(langjson.commands.connect4.footer)
        .setColor(0xff0000)

      return ctx.reply({ embed });
    }

    const findTurn = (user: string) => games.get(CHANNEL.id) && games.get(CHANNEL.id).players ? games.get(CHANNEL.id).players.find(item => item.id == user) : null;

    if (usuario.id != ctx.client.user.id)
      if (findTurn(usuario.id)) {
        return ctx.reply(langjson.commands.connect4.user_active(usuario.username));
      }

    if (findTurn(ctx.message.author.id)) {
      return ctx.reply(langjson.commands.connect4.author_active);
    }

    const poto = new Connect4AI<Player>({
      lengthArr: 6,
      columns: 7
    }, getTURNS(ctx.userId, usuario.id, ctx.client.userId));
    poto.createBoard();

    games.set(CHANNEL.id, poto)

    if (usuario.id != ctx.client.user.id) {

      const Buttons = [
        new Button('primary')
          .setCustomID('c4_yes')
          .setEmoji({ name: '✅', id: undefined }),
        new Button('danger')
          .setCustomID('c4_no')
          .setEmoji({ name: '❌', id: undefined })
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
          { channelID: CHANNEL.id, messageID: wait.id, guildID: ctx.guildId });
      });

      const respuesta = res;

      if (!respuesta) {
        games.delete(CHANNEL.id)
        return ctx.reply(langjson.commands.connect4.dont_answer(usuario.username))
      }

      if (respuesta == 'c4_no') {
        games.delete(CHANNEL.id)
        return ctx.reply(langjson.commands.connect4.deny(usuario.username))
      }

      if (findTurn(usuario.id)) {
        games.delete(CHANNEL.id)
        return ctx.reply(langjson.commands.connect4.user_active(usuario.username));
      }

      if (findTurn(ctx.message.author.id)) {
        games.delete(CHANNEL.id)
        return ctx.reply(langjson.commands.connect4.author_active);
      }

    }

    const embedStart = new MessageEmbed()
      .setDescription(langjson.commands.connect4.start(findTurn(ctx.message.author.id).turn == 1 ? ctx.message.author.username : usuario.username))
      .setColor(0xff0000)
      .setImage('attachment://party.gif');
    const bufParty = await displayConnectFourBoard(games.get(CHANNEL.id))

    const messageParty = await ctx.client.rest.createMessage(CHANNEL.id, { file: { value: bufParty, filename: 'party.gif' }, embed: embedStart, components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false) });

    async function sendCoso(embed: MessageEmbed, value: Buffer) {

      if (ArrayOfArrayOfNumbers.length) {

        const data = await model.findOneAndUpdate({ id: ctx.client.userId }, { $push: { c4Maps: { maps: ArrayOfArrayOfNumbers, users: [ctx.userId, usuario.id], dif: args[0] } } }, { new: true, upsert: true });
        await redis.set(ctx.client.userId, JSON.stringify(data));

        embed.setFooter(ctx.prefix + 'connect4view ' + JSON.parse(JSON.stringify(data.c4Maps[data.c4Maps.length - 1]))._id);

      }

      return ctx.client.rest.createMessage(CHANNEL.id, { embed, file: { filename: 'party.gif', value }, components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, true) });

    }

    function easyAwaitAnswer(MESSAGEID: string) {
      awaitAnswer(MESSAGEID, sendCoso, ctx, findTurn, ArrayOfArrayOfNumbers, args, DATAPROFILE, usuario, langjson, difficulty, easyAwaitAnswer, CHANNEL);
    }

    return easyAwaitAnswer(messageParty.id);

  },
});

async function displayConnectFourBoard(game: c4.Connect4AI<Player>) {
  const buffer = await fetch(
    `${process.env.DISPLAYCONNECT4}/${encodeURIComponent(JSON.stringify({ game }))}.gif`
    , {
      headers:
        { 'authorization': process.env.APIKEY }
    }).then(x => x.buffer());

  return buffer;
}

async function modificar(data: USER, dif: string, tipo: 'ganadas' | 'empates' | 'perdidas', nombre: string) {

  const coso = `c4${dif}` as 'c4easy' | 'c4medium' | 'c4hard';
  data[coso] = data[coso] || { ganadas: 0, empates: 0, perdidas: 0 };
  data[coso][tipo] = data[coso][tipo] ? data[coso][tipo] + 1 : 1;
  data.cacheName = nombre;
  const res = await model.findOneAndUpdate({ id: data.id }, data, { new: true });
  return res;

}

function getTURNS(author: string, mention: string, clientID: string): [Player, Player] {

  if (mention != clientID) {
    const user1 = Math.floor(Math.random() * 2) + 1 == 2 ? 2 : 1
    const user2 = user1 == 2 ? 1 : 2
    return [{
      id: mention,
      turn: user1
    },
    {
      id: author,
      turn: user2
    }]
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

function awaitAnswer(MESSAGEID: string,
  sendCoso: (embed: MessageEmbed, value: Buffer) => Promise<detritus.Structures.Message>,
  ctx: detritus.Command.Context,
  findTurn: (user: string) => Player,
  ArrayOfArrayOfNumbers: [number, number, string][],
  args: string[],
  DATAPROFILE: USER,
  usuario: detritus.Structures.Member | detritus.Structures.User,
  langjson: typeof json.es | typeof json.en,
  difficulty: 'easy' | 'medium' | 'hard',
  easyAnswer: (id: string) => any,
  CHANNEL: { id: string },
) {

  Collector.add({
    async onCollect(interaction) {

      const collector = Collector._listeners.find(item => item.messageID == MESSAGEID);

      if (interaction.data.customId === 'c4_surrender')
        return Collector.stop('surrender', collector, true);

      games.get(CHANNEL.id).play(parseInt(interaction.data.customId.split('c4_')[1]))

      const game = games.get(CHANNEL.id);
      const board = game.map[(parseInt(interaction.data.customId.split('c4_')[1]))];
      let temp = findTurn(interaction.userId).turn == 1 ? 'red' : 'yellow';
      ArrayOfArrayOfNumbers.push([board.filter(x => x.key).length - 1, parseInt(interaction.data.customId.split('c4_')[1]), temp]);

      if (games.get(CHANNEL.id).solution) {
        const embed = new MessageEmbed()
          .setDescription(langjson.commands.connect4.win(interaction.user.username))
          .setColor(0xff0000)
          .setImage('attachment://party.gif');
        const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
        sendCoso(embed, buf);

        if (usuario.id == ctx.client.user.id) {

          const a = await model.findOne({ id: ctx.message.author.id }).lean();
          const res = await modificar(a, args[0].toLowerCase(), 'ganadas', ctx.user.username);
          await redis.set(ctx.message.author.id, JSON.stringify(res));

          if (args[0] == 'hard' && a.c4hard) {

            if ((a.c4hard.ganadas >= 10) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL1))) {

              const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: IDS.ACHIEVEMENTS.C4LEVEL1 } }, { new: true }).lean();
              await redis.set(ctx.message.author.id, JSON.stringify(data));

            }

            else if ((a.c4hard.ganadas >= 15) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL2))) {

              const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: IDS.ACHIEVEMENTS.C4LEVEL2 } }, { new: true }).lean();
              await redis.set(ctx.message.author.id, JSON.stringify(data));

            }

            else if ((a.c4hard.ganadas >= 25) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL3))) {

              const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: IDS.ACHIEVEMENTS.C4LEVEL3 } }, { new: true }).lean();
              await redis.set(ctx.message.author.id, JSON.stringify(data));

            }

            else if ((a.c4hard.ganadas >= 50) && !(DATAPROFILE.achievements.includes(IDS.ACHIEVEMENTS.C4LEVEL4))) {

              const data = await model.findOneAndUpdate({ id: ctx.message.author.id }, { $addToSet: { achievements: IDS.ACHIEVEMENTS.C4LEVEL4 } }, { new: true }).lean();
              await redis.set(ctx.message.author.id, JSON.stringify(data));

            }

          }

        }

        games.delete(CHANNEL.id);
        return Collector.stop('win', collector);

      }

      else if (games.get(CHANNEL.id).tie) {
        const embed = new MessageEmbed()
          .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.message.author.username))
          .setColor(0xff0000)
          .setImage('attachment://party.gif');
        const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
        sendCoso(embed, buf);

        if (usuario.id == ctx.client.user.id) {
          const da = await model.findOne({ id: ctx.message.author.id }).lean();
          const res = await modificar(da, args[0].toLowerCase(), 'empates', ctx.user.username);
          await redis.set(ctx.userId, JSON.stringify(res));
        }
        games.delete(CHANNEL.id);
        return Collector.stop('win', collector);
      }

      if (usuario.id == ctx.client.user.id) {
        const old = games.get(CHANNEL.id);
        const played = old.playAI(difficulty);
        const board = games.get(CHANNEL.id).map;
        temp = findTurn(ctx.client.user.id).turn == 1 ? 'red' : 'yellow';
        ArrayOfArrayOfNumbers.push([board[played].filter(x => x.key).length - 1, played, temp]);

        if (games.get(CHANNEL.id).solution) {
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.win(usuario.username))
            .setColor(0xff0000)
            .setImage('attachment://party.gif');
          const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
          sendCoso(embed, buf);

          const da = await model.findOne({ id: ctx.message.author.id }).lean();
          const res = await modificar(da, args[0].toLowerCase(), 'perdidas', ctx.user.username);
          await redis.set(ctx.userId, JSON.stringify(res));
          games.delete(CHANNEL.id);
          return Collector.stop('win', collector);
        }

        else if (games.get(CHANNEL.id).tie) {
          const embed = new MessageEmbed()
            .setDescription(langjson.commands.connect4.draw(usuario.username, ctx.message.author.username))
            .setColor(0xff0000)
            .setImage('attachment://party.gif');
          const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
          sendCoso(embed, buf);

          const da = await model.findOne({ id: ctx.message.author.id }).lean();
          const res = await modificar(da, args[0].toLowerCase(), 'empates', ctx.user.username);
          await redis.set(ctx.userId, JSON.stringify(res));
          games.delete(CHANNEL.id);
          return Collector.stop('win', collector);
        }

        const embed = new MessageEmbed()
          .setDescription(langjson.commands.connect4.turn(ctx.message.author.username, '🔴'))
          .setFooter(args[0])
          .setColor(0xff0000)
          .setImage('attachment://party.gif');
        const buf = await displayConnectFourBoard(games.get(CHANNEL.id))

        const { id } = await ctx.client.rest.createMessage(CHANNEL.id, { file: { value: buf, filename: 'party.gif' }, embed, components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false) })
        return easyAnswer(id);

      }

      if ((usuario.id != ctx.client.user.id) && (games.get(CHANNEL.id))) {
        const embed = new MessageEmbed()
          .setDescription(langjson.commands.connect4.turn(
            findTurn(ctx.message.author.id).turn == findTurn(interaction.userId).turn ? usuario.username : ctx.message.author.username,
            findTurn(interaction.userId).turn == 2 ? `🔴` : `🟡`
          ))
          .setFooter(args[0])
          .setColor(0xff0000)
          .setImage('attachment://party.gif');
        const buf = await displayConnectFourBoard(games.get(CHANNEL.id))

        const { id } = await ctx.client.rest.createMessage(CHANNEL.id, { file: { value: buf, filename: 'party.gif' }, embed, components: generateButtons(games.get(CHANNEL.id), langjson.commands.connect4.surrender, false) })
        return easyAnswer(id);

      }
    },
    async onStop(reason, x) {

      if (reason != 'surrender') {
        if (x && x.running) Collector.stop('max', x);
        if (reason == 'max') return;
      };

      if (reason === 'surrender' && games.get(CHANNEL.id)) {
        if (usuario.id == ctx.client.user.id) {
          const da = await model.findOne({ id: ctx.message.author.id }).lean();
          const res = await modificar(da, args[0].toLowerCase(), 'perdidas', ctx.user.username);
          await redis.set(ctx.userId, JSON.stringify(res));
        }
        const embed = new MessageEmbed()
          .setDescription(langjson.commands.connect4.game_over)
          .setColor(0xff0000)
          .setImage('attachment://party.gif');
        const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
        sendCoso(embed, buf);

        return games.delete(CHANNEL.id);
      }

      else if (reason === 'idle' && games.get(CHANNEL.id)) {
        if (usuario.id == ctx.client.user.id) {
          const da = await model.findOne({ id: ctx.message.author.id }).lean();
          const res = await modificar(da, args[0].toLowerCase(), 'perdidas', ctx.user.username);
          await redis.set(ctx.userId, JSON.stringify(res));
        }
        const embed = new MessageEmbed()
          .setDescription(langjson.commands.connect4.time_over)
          .setColor(0xff0000)
          .setImage(`attachment://4enraya.gif`)
          .setImage('attachment://party.gif');
        const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
        sendCoso(embed, buf);

        return games.delete(CHANNEL.id);

      }

      else if (reason == 'time' && games.get(CHANNEL.id)) {
        if (usuario.id == ctx.client.user.id) {
          const da = await model.findOne({ id: ctx.message.author.id }).lean();
          const res = await modificar(da, args[0].toLowerCase(), 'perdidas', ctx.user.username);
          await redis.set(ctx.userId, JSON.stringify(res));
        }
        const embed = new MessageEmbed()
          .setDescription(langjson.commands.connect4.game_over2)
          .setColor(0xff0000)
          .setImage('attachment://party.gif');
        const buf = await displayConnectFourBoard(games.get(CHANNEL.id))
        sendCoso(embed, buf);

        return games.delete(CHANNEL.id);
      }
      else return games.delete(CHANNEL.id)

    }
  }, (interaction) => {

    if (!ctx.canReply) return false;
    if (!games.get(CHANNEL.id).players.some(item => item.id == interaction.userId)) {
      interaction.createResponse({ data: { content: langjson.commands.connect4.wait, flags: 64 }, type: 4 });
      return false;
    }
    if (!findTurn(interaction.userId)) return;
    if (usuario.id != ctx.client.user.id) {

      if (!games.get(CHANNEL.id)) return false;

      return ['c4_1', 'c4_2', 'c4_3', 'c4_4', 'c4_5', 'c4_6', 'c4_0', 'c4_surrender'].includes(interaction.data.customId)
        && findTurn(interaction.userId).turn === games.get(CHANNEL.id).turn
        && !games.get(CHANNEL.id).finished
        || ((games.get(CHANNEL.id).players.some(item => item.id == interaction.userId) && interaction.data.customId == 'c4_surrender'))

    }

    else {
      return interaction.userId == ctx.message.author.id
        && findTurn(interaction.userId).turn === games.get(CHANNEL.id).turn
        && ['c4_1', 'c4_2', 'c4_3', 'c4_4', 'c4_5', 'c4_6', 'c4_0', 'c4_surrender'].includes(interaction.data.customId)
        && !games.get(CHANNEL.id).finished
        || ((games.get(CHANNEL.id).players.some(item => item.id == interaction.userId) && interaction.data.customId == 'c4_surrender'))
    }
  }, { idle: ((3 * 60) * 1000), time: 0, max: 1 }, { channelID: CHANNEL.id, messageID: MESSAGEID, guildID: ctx.guildId });

}
