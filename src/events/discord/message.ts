import { WebhookClient, Collection, Message, MessageEmbed, TextChannel, NewsChannel, DMChannel, ChannelResolvable } from 'discord.js-light';
import model from '../../models/music'
import Comando from '../../Utils/Classes/command';
import Zenitsu from '../../Utils/Classes/client';
const cooldowns: Collection<string, Collection<string, number>> = new Collection();
import * as langjson from '../../Utils/lang.json';
import { default as ms } from '@fabricio-191/ms';

async function event(client: Zenitsu, message: Message): Promise<any> {

    if (!message.guild || !message.author || !message.member || message.author.bot) return;

    if (!(message.channel instanceof TextChannel) && !(message.channel instanceof NewsChannel))
        return;

    //const data = await model.findOne({ guild: message.guild.id });

    if (!((message.channel as TextChannel).permissionsFor(message.guild.me).has('SEND_MESSAGES')) || !((message.channel as TextChannel).permissionsFor(message.guild.me).has('EMBED_LINKS')))
        return;

    /*if (data && (data.channel == message.channel.id) && (message.guild.me.voice.channel ? message.member.voice.channelID == message.guild.me.voice.channelID : message.member.voice.channelID)) {
        client.music.play(message, message.content).catch(() => {

        })
            .then(() => {
                message.delete().catch(() => { })
            })
        return;
    }*/

    const requestLang = await client.lang.cacheOrFetch(message.guild.id);
    const lang: 'es' | 'en' = requestLang.lang

    const afk = await client.afk.cacheOrFetch(message.author.id)
    if (afk.status) {
        await client.afk.delete(message.author.id);
        let texto = langjson.messages[`${lang}_afk_volver`];
        return message.reply(texto)
    }

    for (let user of message.mentions.members.array().filter(user => !user.user.bot)) {

        let cacheAfk = await client.afk.cacheOrFetch(user.id);
        if (cacheAfk && cacheAfk.status) {

            let embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor(user.user.tag, user.user.displayAvatarURL({ dynamic: true, size: 2048 }))
                .setDescription(cacheAfk.reason)
                .setFooter('AFK | ' + ms(Date.now() - cacheAfk.date, { language: lang, long: true }))

            message.channel.send({ embed }).catch(() => { })
            break;
        }
    }


    const requestPrefix = await client.prefix.cacheOrFetch(message.guild.id);
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
                const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now);
                    return message.reply(langjson.messages[lang + '_cooldown'].replace('{TIME}', ms(timeLeft, { long: true, language: lang })).replace('{COMMAND}', command));
                }
            }

            else {
                timestamps.set(message.author.id, now);
                setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
            }
        }

        let check = [];

        check = comando.botPermissions.channel.filter(perm => !((message.channel as TextChannel).permissionsFor(message.guild.me).has(perm)))

        if (check.length) {

            const texto: string = langjson.messages[lang + '_permisos_bot_channel'];

            let embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(texto.replace('{PERMISOS}', `\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.send({ embed: embed })
        }

        check = comando.memberPermissions.channel.filter(perm => !((message.channel as TextChannel).permissionsFor(message.member).has(perm)))

        if (check.length) {

            const texto: string = langjson.messages[lang + '_permisos_user_channel'];

            let embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(texto.replace('{PERMISOS}', `\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.send({ embed: embed })
        }

        check = comando.botPermissions.guild.filter(perm => !(message.guild.me.hasPermission(perm)));

        if (check.length) {

            const texto: string = langjson.messages[lang + '_permisos_bot_guild'];

            let embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(texto.replace('{PERMISOS}', `\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.send({ embed: embed })
        }

        check = comando.memberPermissions.guild.filter(perm => !(message.member.hasPermission(perm)));

        if (check.length) {

            const texto: string = langjson.messages[lang + '_permisos_user_guild'];

            let embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(texto.replace('{PERMISOS}', `\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.send({ embed: embed })
        }

        async function embedResponse(descriptionHere: string, option: ChannelResolvable) {

            let embed = new MessageEmbed()
                .setDescription(descriptionHere)
                .setTimestamp()
                .setColor(client.color);

            let canal: TextChannel | NewsChannel | DMChannel = (client.channels.resolve(option) as TextChannel) || message.channel;

            return canal.send({ embed: embed })

        }

        try {
            await comando.run({ message, args, embedResponse, Hora, client, lang, langjson })
        }

        catch (e) {
            console.log(e);
            new WebhookClient(process.env.WEBHOOKID, process.env.WEBHOOKTOKEN).send(
                new MessageEmbed()
                    .setColor(client.color)
                    .setTimestamp()
                    .setDescription((e.stack || e.message || e)?.slice(0, 2048) || e)
                    .addField('Comando usado', command)
                    .setAuthor(message.content.slice(0, 1000))
            )
            return message.channel.send(langjson.messages[lang + '_error'].replace('{ERROR}', (e.message || e?.toString() || e)));
        }

    }

    return;
}

export default event;

function Hora(date = Date.now(), dia = false) {

    let fecha = new Date(date - ms('4h'))

    let hora = fecha.getHours();

    let minutos = fecha.getMinutes();

    let segundos = fecha.getSeconds();

    let horaS: string,
        minutosS: string,
        segundosS: string

    if (hora < 10) {
        horaS = '0' + hora
    }

    if (minutos < 10) {
        minutosS = '0' + minutos
    }
    if (segundos < 10) {
        segundosS = "0" + segundos
    }
    if (!dia)
        return horaS + ":" + minutosS + ":" + segundosS

    else {

        let dia = new Date(date - ms('4h')).getDay() + 1,
            mes = new Date(date - ms('4h')).getMonth() + 1,
            año = new Date(date - ms('4h')).getFullYear()

        return `${horaS}: ${minutosS}: ${segundosS} - ${dia} /${mes}/${año} `

    }

}