import ms from '@fabricio-191/ms';
import * as Eris from '@lil_marcrock22/eris-light';
import Zenitsu from '../Utils/Classes/client.js';
import MessageEmbed from '../Utils/Classes/Embed.js';
import lenguajes from '../Utils/Lang/langs.js';
import Comando from '../Utils/Classes/command.js';
import Collection from '../Utils/Classes/Collection.js';
import langModel, { Lang as LANG } from '../models/lang.js';
import prefixModel, { Prefix as PREFIX } from '../models/prefix.js';
const cooldowns: Collection<string, Collection<string, { cooldown: number, avisado: boolean }>> = new Collection();
const antiabuzzz: Set<[string, number]> = new Set();
const abusadores: Set<string> = new Set();

function check(items: number[]): boolean {
  const sorted = items.sort((a, b) => b - a);
  const filter = sorted.filter(date => (date + (15 * 1000)) > Date.now());
  return filter.length > 8;
}

async function on(client: Zenitsu, message: Eris.Message): Promise<void | Eris.Message> {

  if (!message || !message.guild || !message.author || !message.member || message.author.bot) return;

  if (!(message.channel instanceof Eris.TextChannel) && !(message.channel instanceof Eris.NewsChannel))
    return;

  if (!['sendMessages', 'embedLinks'].every((perm: 'sendMessages' | 'embedLinks') => (message.channel as Eris.TextChannel).permissionsOf(message.guild.me).has(perm)))
    return;

  if (abusadores.has(message.author.id))
    return;

  const requestLang: LANG = await client.redis.get(message.guildID, 'lang_').then(x => typeof x == 'string' ? JSON.parse(x) : null) || await langModel.findOne({ id: message.guildID }).lean() || await langModel.create({ id: message.guildID, lang: 'en' });
  await client.redis.set(message.guildID, JSON.stringify(requestLang), 'lang_');
  const lang = requestLang.lang;
  const json = lenguajes[lang];

  //antiabuzz
  const topush = client.listener.listen(message).filter(item => item.author.id == message.author.id);

  for (const { createdAt } of topush) antiabuzzz.add([message.author.id, createdAt]);

  const filtered = Array.from(antiabuzzz).filter(item => item[0] == message.author.id);

  if (check(filtered.map(e => e[1]))) {
    setTimeout(() => abusadores.delete(message.author.id), (60 * 1000))
    for (const i of filtered) antiabuzzz.delete(i);
    abusadores.add(message.author.id);
    return message.channel.createMessage(json.messages.abuz);
  }
  //antiabuzz

  const requestPrefix: PREFIX = await client.redis.get(message.guildID, 'prefix_').then(x => typeof x == 'string' ? JSON.parse(x) : null) || await prefixModel.findOne({ id: message.guildID }).lean() || await prefixModel.create({ id: message.guildID, prefix: 'z!' });
  await client.redis.set(message.guildID, JSON.stringify(requestPrefix), 'prefix_');
  const prefix = requestPrefix.prefix;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  const filter = (e: Comando) => {
    if (e.dev && !(client.devs.includes(message.author.id))) return false;
    return true;
  };

  const comando = client.commands.filter(filter).find((c) => c.name == command || c.alias.includes(command));

  if (comando) {
    if (!cooldowns.has(comando.name)) {
      cooldowns.set(comando.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(comando.name);
    const cooldownAmount = (comando.cooldown || 0) * 1000;

    if (!client.devs.includes(message.author.id)) {
      if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id).cooldown + cooldownAmount;
        if (now < expirationTime) {
          if (!timestamps.get(message.author.id).avisado) {
            const timeLeft = (expirationTime - now);
            timestamps.get(message.author.id).avisado = true;
            antiabuzzz.add([message.author.id, message.createdAt]);
            return message.channel.createMessage(message.author.mention + ' ,' + json.messages.cooldown(ms(timeLeft, { long: true, language: lang }), command));
          }
          else return;
        }
        else timestamps.set(message.author.id, { cooldown: now, avisado: false });
      }
      else timestamps.set(message.author.id, { cooldown: now, avisado: false });
    }

    const check = comando.cantRun(message);

    switch (check.case) {

      case 5:
        {

          try {
            antiabuzzz.add([message.author.id, message.createdAt]);
            await comando.run({ message, args, embedResponse, lang, langjson: json, prefix })
          }

          catch (e) {

            const embeds = [
              new MessageEmbed()
                .setColor(client.color)
                .setTimestamp()
                .setDescription((e.stack || e.message || e).slice(0, 2048))
                .addField('Comando usado', command)
                .setAuthor(message.content.slice(0, 300))
                .setFooter(message.author.tag, message.author.dynamicAvatarURL())
            ]
            console.log(e);
            client.executeWebhook(process.env.WEBHOOKID, process.env.WEBHOOKTOKEN, {
              embeds,
              wait: true
            });
            return message.channel.createMessage(json.messages.error((e.message || e)));

          }
        }
        break;

      case 1: {

        antiabuzzz.add([message.author.id, message.createdAt]);
        const embed = new MessageEmbed()
          .setColor(client.color)
          .setDescription(json.messages.permisos_bot_channel(`\`${check.perms.join(',')}\``))
          .setTimestamp()
          .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');
        return message.channel.createMessage({ embed: embed })

      }

      case 2: {
        antiabuzzz.add([message.author.id, message.createdAt]);
        const embed = new MessageEmbed()
          .setColor(client.color)
          .setDescription(json.messages.permisos_user_channel(`\`${check.perms.join(',')}\``))
          .setTimestamp()
          .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');
        return message.channel.createMessage({ embed: embed })
      }

      case 3: {
        antiabuzzz.add([message.author.id, message.createdAt]);
        const embed = new MessageEmbed()
          .setColor(client.color)
          .setDescription(json.messages.permisos_bot_guild(`\`${check.perms.join(',')}\``))
          .setTimestamp()
          .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');
        return message.channel.createMessage({ embed: embed })
      }

      case 4: {

        antiabuzzz.add([message.author.id, message.createdAt]);
        const embed = new MessageEmbed()
          .setColor(client.color)
          .setDescription(json.messages.permisos_user_guild(`\`${check.perms.join(',')}\``))
          .setTimestamp()
          .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');
        return message.channel.createMessage({ embed: embed })
      }

    }
  }
}

export default on;

function embedResponse(descriptionHere: string, option: Eris.TextChannel | Eris.NewsChannel | Eris.PrivateChannel, color: number): Promise<Eris.Message> {

  const embed = new MessageEmbed()
    .setDescription(descriptionHere)
    .setTimestamp()
    .setColor(color);
  const canal = option;
  return canal.createMessage({ embed: embed })

}
