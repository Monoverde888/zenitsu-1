import ms from '@fabricio-191/ms';
import Eris from 'eris-pluris';
import Zenitsu from '../Utils/Classes/client.js';
import MessageEmbed from '../Utils/Classes/Embed.js';
import lenguajes from '../Utils/Lang/langs.js';
import Comando from '../Utils/Classes/command.js';
import Collection from '../Utils/Classes/Collection.js';
const cooldowns: Collection<string, Collection<string, number>> = new Collection();

async function event(client: Zenitsu, message: Eris.Message): Promise<void | Eris.Message> {

    if (!((message.channel as Eris.TextChannel).guild) || !message.author || !message.member || message.author.bot) return;

    if (!(message.channel instanceof Eris.TextChannel) && !(message.channel instanceof Eris.NewsChannel))
        return;

    if (!((message.channel as Eris.TextChannel).permissionsOf(client.user.id).has('sendMessages')) || !((message.channel as Eris.TextChannel).permissionsOf(client.user.id).has('embedLinks')))
        return;

    const requestLang = await client.lang.cacheOrFetch(message.channel.guild.id);
    const lang: 'es' | 'en' = requestLang.lang
    const langjson = lenguajes[lang]
    const afk = await client.afk.cacheOrFetch(message.author.id)

    if (afk.status) {
        await client.afk.delete(message.author.id);
        const texto = langjson.messages.afk_volver;
        return message.channel.createMessage(message.author.mention + ', ' + texto)
    }

    for (const user of message.mentions.filter(user => !user.bot)) {

        const cacheAfk = await client.afk.cacheOrFetch(user.id);
        if (cacheAfk && cacheAfk.status) {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor(user.username, user.dynamicAvatarURL())
                .setDescription(cacheAfk.reason)
                .setFooter('AFK | ' + ms(Date.now() - cacheAfk.date, { language: lang, long: true }))

            message.channel.createMessage({ embed }).catch(() => undefined)
            break;
        }
    }


    const requestPrefix = await client.prefix.cacheOrFetch(message.channel.guild.id);
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
                    return message.channel.createMessage(message.author.mention + ' ,' + langjson.messages.cooldown(ms(timeLeft, { long: true, language: lang }), command));
                }
                else timestamps.set(message.author.id, now);
            }

            else {
                timestamps.set(message.author.id, now);
            }
        }

        let check = comando.botPermissions.channel.filter(perm => !((message.channel as Eris.TextChannel | Eris.NewsChannel).permissionsOf(client.user.id).has(perm)))

        if (check.length) {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.messages.permisos_bot_channel(`\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.createMessage({ embed: embed })
        }

        check = comando.memberPermissions.channel.filter(perm => !((message.channel as Eris.TextChannel | Eris.NewsChannel).permissionsOf(message.member.id).has(perm)))

        if (check.length) {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.messages.permisos_user_channel(`\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.createMessage({ embed: embed })
        }

        check = comando.botPermissions.guild.filter(perm => !((message.channel as Eris.TextChannel).guild.members.get(client.user.id).permissions.has(perm)));

        if (check.length) {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.messages.permisos_bot_guild(`\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.createMessage({ embed: embed })
        }

        check = comando.memberPermissions.guild.filter(perm => !(message.member.permissions.has(perm)));

        if (check.length) {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.messages.permisos_user_guild(`\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');

            return message.channel.createMessage({ embed: embed })
        }

        const embedResponse = (descriptionHere: string, option: Eris.TextChannel): Promise<Eris.Message> => {

            const embed = new MessageEmbed()
                .setDescription(descriptionHere)
                .setTimestamp()
                .setColor(client.color);

            const canal: Eris.TextChannel | Eris.NewsChannel | Eris.PrivateChannel = option || message.channel;

            return canal.createMessage({ embed: embed })

        }

        try {
            await comando.run({ message, args, embedResponse, Hora, client, lang, langjson })
        }

        catch (e) {

            const embeds = [
                new MessageEmbed()
                    .setColor(client.color)
                    .setTimestamp()
                    .setDescription((e.stack || e.message || e)?.slice(0, 2048) || e)
                    .addField('Comando usado', command)
                    .setAuthor(message.content.slice(0, 1000))
            ]

            console.log(e);
            client.executeWebhook(process.env.WEBHOOKID, process.env.WEBHOOKTOKEN, {
                embeds
            })
            return message.channel.createMessage(langjson.messages.error((e.message || e?.toString() || e)));
        }

    }

    return;
}

function Hora(date = Date.now(), dia = false) {

    const fecha = new Date(date - ms('4h'))

    const hora = fecha.getHours();

    const minutos = fecha.getMinutes();

    const segundos = fecha.getSeconds();

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

        const dia = new Date(date - ms('4h')).getDay() + 1,
            mes = new Date(date - ms('4h')).getMonth() + 1,
            año = new Date(date - ms('4h')).getFullYear()

        return `${horaS}: ${minutosS}: ${segundosS} - ${dia} /${mes}/${año} `

    }

}

export default event