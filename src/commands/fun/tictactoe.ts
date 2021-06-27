import BaseCommand from '../../Utils/Classes/Command.js';
import json from '../../Utils/Lang/langs.js';
import getGuild from '../../Utils/Functions/getGuild.js';
import Collector, { Fixed } from '../../Utils/Collectors/Button.js';
import AI from 'ai-tic-tac-toe';
import tresenraya from 'tresenraya';
const users: Map<string, string> = new Map();
import detritus from 'detritus-client';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import Button from '../../Utils/Buttons/Normal.js';
import Components from '../../Utils/Buttons/Component.js';
import { estilos } from '../../Utils/Buttons/types.js';

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

const colors: {
  [x: string]: estilos
} = {
  '❌': 'danger',
  '⭕': 'primary'
};

const emojis: {
  [x: string]: string
} = {
  '❌': '<:x_tic:849685084236021790>',
  '⭕': '<:o_tic:849685083967586304>'
}

function AIplay(partida: tresenraya.partida) {
  return (AI.getmove(partida.tablero.array.map(item => item == '❌' ? 'x' : item == '⭕' ? 'o' : ''), partida.turno.ficha == '❌' ? 'x' : 'o')) + 1;
}

function resolveMarkdown(user: detritus.Structures.User | detritus.Structures.Member, partida: tresenraya.partida) {

  return partida.turno.jugador == user.id ? `**${user.username}** ${emojis[partida.turno.ficha]}` : user.username

}

function generateButtons(partida: tresenraya.partida, forceDisable = false, empate = '') {

  const res = [];

  for (const i in partida.tablero.array) {

    const but = partida.tablero.array[i]
    const check = ['❌', '⭕'].find(item => but == item);
    const number = parseInt(i) + 1;

    const temp = new Button(colors[check] ? colors[check] : 'secondary')
      .setCustomID(`tictactoe_${number}`)
      .setDisabled(forceDisable || !!check)

    if (check) temp.setEmoji({ id: but == '❌' ? '849685084236021790' : '849685083967586304', name: but == '❌' ? 'x_tic' : 'o_tic' });
    else temp.setLabel('~')

    res.push(temp);

  }

  const buttons1 = res.slice(0, 3);
  const buttons2 = res.slice(3, 6);
  const buttons3 = res.slice(6);

  if (empate) buttons2.push(
    new Button('success')
      .setCustomID('tictactoe_repeat')
      .setEmoji({ name: '🔁', id: undefined })
      .setLabel(empate)
  );

  return [new Components(...buttons1), new Components(...buttons2), new Components(...buttons3)];

}

const partidas: Set<string> = new Set();

async function jugar(firstp: detritus.Structures.User | detritus.Structures.Member, secondp: detritus.Structures.User | detritus.Structures.Member, ctx: detritus.Command.Context, channel: detritus.Structures.Channel, langjson: typeof json.es | typeof json.en) {

  if (partidas.has(channel.guildId))
    return ctx.reply(langjson.commands.tictactoe.curso);

  let msgRepuesta: detritus.Structures.Message;

  if (ctx.client.user.id != secondp.id) {
    msgRepuesta = await ctx.reply({
      content: langjson.commands.tictactoe.wait_user(secondp.username),
      components: [{
        type: 1,
        components: [
          new Button('primary')
            .setCustomID('tictactoe_yes')
            .setEmoji({ name: '✅', id: undefined }),
          new Button('primary')
            .setCustomID('tictactoe_no')
            .setEmoji({ name: '❌', id: undefined })
        ]
      }]
    });
  }

  const partida = new tresenraya.partida({ jugadores: [firstp.id, secondp.id] });

  partidas.add(channel.guildId);

  if (ctx.client.user.id != secondp.id) {

    const res: string | undefined = await new Promise(resolve => {

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
          idle: 0, time: (1 * 60) * 1000, max: 0
        }, {
        channelID: channel.id,
        messageID: msgRepuesta.id,
        guildID: msgRepuesta.guildId
      })

    });

    const respuesta = res;

    if (!respuesta) {
      ctx.reply(langjson.commands.tictactoe.dont_answer(secondp.username))
      return partidas.delete(channel.guildId)
    }

    if (respuesta == 'tictactoe_no') {
      ctx.reply(langjson.commands.tictactoe.deny(secondp.username))
      return partidas.delete(channel.guildId)
    }
  }

  users.set(secondp.id, secondp.username)
  users.set(firstp.id, firstp.username)

  partida.jugadores = [firstp.id, secondp.id]

  partida.on('ganador', async (jugador) => {
    partidas.delete(channel.guildId);
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setDescription(langjson.commands.tictactoe.win(users.get(jugador as string)))

    const positions = pos.find(p => p.every(x => partida.tablero.array[x] == '❌')) || pos.find(p => p.every(x => partida.tablero.array[x] == '⭕')),
      botones = generateButtons(partida, true),
      pasaber = [...botones[0].components, ...botones[1].components, ...botones[2].components]

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

    channel.createMessage({ embed, components: botones });
    users.delete(firstp.id);
    users.delete(secondp.id);

  });

  partida.on('empate', async (jugadores) => {
    partidas.delete(channel.guildId)
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setDescription(langjson.commands.tictactoe.draw(users.get(jugadores[0]), users.get(jugadores[1])))

    const col = Collector._listeners.find(item => item.messageID == msg.id);
    Collector.stop('NO', col);

    users.delete(firstp.id)
    users.delete(secondp.id)

    const empate = await channel.createMessage({ embed, components: generateButtons(partida, true, langjson.commands.tictactoe.rematch) })

    const res: Fixed | false = await new Promise(resolve => {

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
          idle: 0, time: (1 * 30) * 1000, max: 0
        }, {
        channelID: channel.id,
        messageID: empate.id,
        guildID: empate.guildId
      })

    });

    if (res) {
      const temp = [res.member.id != firstp.id ? secondp : firstp, res.member.id == firstp.id ? secondp : firstp]
      return jugar(temp[0], temp[1], ctx, channel, langjson);
    }

  });

  partida.on('finalizado', async () => {
    partidas.delete(channel.guildId)
    const embed = new MessageEmbed()
      .setColor(0xff0000)
      .setDescription(langjson.commands.tictactoe.game_over);

    const col = Collector._listeners.find(item => item.messageID == msg.id);
    Collector.stop('NO', col);

    channel.createMessage({ embed, components: generateButtons(partida, true) })
    users.delete(firstp.id)
    users.delete(secondp.id)
  });

  let msg: detritus.Structures.Message;

  if (partida.turno.jugador != ctx.client.user.id) {
    msg = await channel.createMessage({ content: `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}\n\n${langjson.commands.tictactoe.start(partida.turno.jugador == firstp.id ? firstp.username : secondp.username, emojis[partida.turno.ficha])}`, components: generateButtons(partida) })
  }

  else {
    const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
    const jugada = AIplay(partida) || disponibles[Math.floor(Math.random() * disponibles.length)]
    partida.elegir(jugada)
    msg = await channel.createMessage({ content: `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}`, components: generateButtons(partida) })
  }

  Collector.add({
    onStop(r) {
      if (['channelDelete', 'messageDelete', 'guildDelete'].includes(r)) return partidas.delete(ctx.guildId);
      if ((r != 'NO')) {
        return !partida || partida.finalizado ? null : partida.emit('finalizado', partida.jugadores, partida.tablero, partida.paso);
      }
    },
    async onCollect(m) {

      const check = await m.respond({ data: { flags: 64 }, type: 5 }).catch(() => false).then(() => true);

      if (!check) return check;

      partida.elegir(parseInt(m.data.customId.split('tictactoe_')[1]));

      if (partida.finalizado) {
        const col = Collector._listeners.find(item => item.messageID == msg.id);
        Collector.stop('', col);
        return;
      }

      await msg.edit({ content: `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}`, components: generateButtons(partida) });

      if (!partida.finalizado && partida.turno.jugador == ctx.client.user.id) {

        await new Promise((r) => {
          setTimeout(() => { r(true) }, 5000)
        })

        const disponibles = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(a => partida.disponible(a));
        const jugada = AIplay(partida) || disponibles[Math.floor(Math.random() * disponibles.length)]
        partida.elegir(jugada)
        if (!partida.finalizado) {

          await msg.edit({ content: `${resolveMarkdown(firstp, partida)} vs ${resolveMarkdown(secondp, partida)}`, components: generateButtons(partida) });

        }
      }
    },
  },
    (m) => {
      return partida
        && partida.jugadores.includes(m.userId)
        && m.userId === partida.turno.jugador
        && partida.disponible(parseInt(m.data.customId.split('tictactoe_')[1]) || 1)
        && !partida.finalizado
    },
    {
      idle: 0, time: (10 * 60) * 1000, max: 0
    }, {
    channelID: msg.id,
    messageID: msg.id,
    guildID: msg.guildId
  })

  return true;

}


export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [
        `${prefix}ttt @Zenitsu.`,
        `${prefix}ttt @User`
      ]
    },
    category: 'fun'
  },
  name: 'tictactoe',
  aliases: ['ttt', 'tresenraya'],
  onBeforeRun(ctx) {
    return !!ctx.message.mentions.first();
  },
  async run(ctx) {

    const langjson = await getGuild(ctx.guildId).then(x => json[x.lang]);

    const usuario = ctx.message.mentions.first();

    return jugar(ctx.message.member, usuario, ctx, ctx.channel, langjson);

  },
});
