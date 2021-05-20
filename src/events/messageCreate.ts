import ms from '@fabricio-191/ms';
import Eris from 'eris-pluris';
import Zenitsu from '../Utils/Classes/client.js';
import MessageEmbed from '../Utils/Classes/Embed.js';
import lenguajes from '../Utils/Lang/langs.js';
import Comando from '../Utils/Classes/command.js';
import Collection from '../Utils/Classes/Collection.js';
const cooldowns: Collection<string, Collection<string, { cooldown: number, avisado: boolean }>> = new Collection();
const antiabuzzz: Collection<string, number[]> = new Collection();
const abusadores: Set<string> = new Set();

function check(items: number[]): boolean {
    const sorted = items.sort((a, b) => b - a);
    const filter = sorted.filter(date => (date + (15 * 1000)) > Date.now());
    return filter.length > 8;
}

async function event(client: Zenitsu, message: Eris.Message): Promise<void | Eris.Message> {

    if (abusadores.has(message?.author?.id))
        return;

    if (!((message.channel as Eris.TextChannel).guild) || !message.author || !message.member || message.author.bot) return;

    if (!(message.channel instanceof Eris.TextChannel) && !(message.channel instanceof Eris.NewsChannel))
        return;

    if (!((message.channel as Eris.TextChannel).permissionsOf(client.user.id).has('sendMessages')) || !((message.channel as Eris.TextChannel).permissionsOf(client.user.id).has('embedLinks')))
        return;

    const requestLang = await client.lang.cacheOrFetch(message.channel.guild.id);
    const lang: 'es' | 'en' = requestLang.lang;
    const langjson = lenguajes[lang];
    const afk = await client.afk.cacheOrFetch(message.author.id);

    if (afk.status) {
        await client.afk.delete(message.author.id);
        const texto = langjson.messages.afk_volver;
        return message.channel.createMessage(message.author.mention + ', ' + texto);
    }

    //antiabuzz
    const topush = client.listener.listen(message).filter(item => item?.author?.id == message.author.id);
    if (!antiabuzzz.get(message.author.id)) {
        antiabuzzz.set(message.author.id, []);
    }
    for (const { createdAt } of topush) antiabuzzz.get(message.author.id).push(createdAt);
    if (check(antiabuzzz.get(message.author.id))) {
        setTimeout(() => abusadores.delete(message.author.id), (60 * 1000))
        antiabuzzz.delete(message.author.id);
        abusadores.add(message.author.id);
        return message.channel.createMessage(langjson.messages.abuz);
    }
    //antiabuzz

    for (const user of message.mentions.filter(user => !user.bot)) {

        const cacheAfk = await client.afk.cacheOrFetch(user.id);
        if (cacheAfk && cacheAfk.status) {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor(user.username, user.dynamicAvatarURL())
                .setDescription(cacheAfk.reason)
                .setFooter('AFK | ' + ms(Date.now() - cacheAfk.date, { language: lang, long: true }))
            antiabuzzz.get(message.author.id).push(message.createdAt);
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
                const expirationTime = timestamps.get(message.author.id).cooldown + cooldownAmount;
                if (now < expirationTime) {
                    if (!timestamps.get(message.author.id).avisado) {
                        const timeLeft = (expirationTime - now);
                        timestamps.get(message.author.id).avisado = true;
                        antiabuzzz.get(message.author.id).push(message.createdAt);
                        return message.channel.createMessage(message.author.mention + ' ,' + langjson.messages.cooldown(ms(timeLeft, { long: true, language: lang }), command));
                    }
                    else return;
                }
                else timestamps.set(message.author.id, { cooldown: now, avisado: false });
            }
            else timestamps.set(message.author.id, { cooldown: now, avisado: false });
        }

        let check = comando.botPermissions.channel.filter(perm => !((message.channel as Eris.TextChannel | Eris.NewsChannel).permissionsOf(client.user.id).has(perm)))

        if (check.length) {

            antiabuzzz.get(message.author.id).push(message.createdAt);
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.messages.permisos_bot_channel(`\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');
            return message.channel.createMessage({ embed: embed })

        }

        check = comando.memberPermissions.channel.filter(perm => !((message.channel as Eris.TextChannel | Eris.NewsChannel).permissionsOf(message.member.id).has(perm)))

        if (check.length) {

            antiabuzzz.get(message.author.id).push(message.createdAt);
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.messages.permisos_user_channel(`\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');
            return message.channel.createMessage({ embed: embed })

        }

        check = comando.botPermissions.guild.filter(perm => !((message.channel as Eris.TextChannel).guild.members.get(client.user.id).permissions.has(perm)));

        if (check.length) {

            antiabuzzz.get(message.author.id).push(message.createdAt);
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.messages.permisos_bot_guild(`\`${check.join(',')}\``))
                .setTimestamp()
                .setFooter('\u200b', 'https://media1.tenor.com/images/41334cbe64331dad2e2dc6272334b47f/tenor.gif');
            return message.channel.createMessage({ embed: embed })

        }

        check = comando.memberPermissions.guild.filter(perm => !(message.member.permissions.has(perm)));

        if (check.length) {

            antiabuzzz.get(message.author.id).push(message.createdAt);
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
            antiabuzzz.get(message.author.id).push(message.createdAt);
            await comando.run({ message, args, embedResponse, client, lang, langjson })
        }

        catch (e) {

            const embeds = [
                new MessageEmbed()
                    .setColor(client.color)
                    .setTimestamp()
                    .setDescription((e.stack || e.message || e)?.slice(0, 2048) || e)
                    .addField('Comando usado', command)
                    .setAuthor(message.content.slice(0, 300))
            ]
            console.log(e);
            client.executeWebhook(process.env.WEBHOOKID, process.env.WEBHOOKTOKEN, {
                embeds
            })
            return message.channel.createMessage(langjson.messages.error((e.message || e?.toString() || e)));

        }

    }
}
export default event