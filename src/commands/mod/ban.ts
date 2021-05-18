import run from "../../Utils/Interfaces/run.js";
import Command from '../../Utils/Classes/command.js';
import light from 'eris-pluris';
import canMod from "../../Utils/Functions/canMod.js";
import MessageEmbed from "../../Utils/Classes/Embed.js";
import getHighest from '../../Utils/Functions/getHighest.js';

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "ban"
        this.category = 'mod';
        this.botPermissions.guild = ['banMembers'];
        this.cooldown = 6;
        this.memberPermissions.guild = ['banMembers'];
    }

    run({ args, message, langjson, client, embedResponse }: run): Promise<light.Message> {

        const user = message.mentions.filter(user => user.id != message.author.id || user.id != message.guild.ownerID)[0];
        const member = message.guild.members.get(user?.id);
        if (!member) return embedResponse(langjson.commands.ban.mention);
        if (!canMod(member, client, 'ban')) return embedResponse(langjson.commands.ban.cannt_ban(`**${client.unMarkdown(member.user.username)}**`))
        if (message.author.id !== message.guild.ownerID) {
            if (getHighest(message.member).position < getHighest(member).position) return embedResponse(langjson.commands.ban.user_cannt_ban(`**${client.unMarkdown(member.user.username)}**`))
        }

        const reason = args.join(' ')?.replace('<@!' + member.id + '>', '').slice(0, 500) || null;
        return member.ban(7, reason).then(() => {

            const embed = new MessageEmbed()
                .setColor(0x2ecc71)
                .setDescription(langjson.commands.ban.ban(`**${client.unMarkdown(user.username)}**`, reason))
                .setFooter(message.author.username, message.author.dynamicAvatarURL())

            return message.channel.createMessage({ embed })

        })
            .catch((error) => {

                const embed = new MessageEmbed()
                    .setColor(0xff000)
                    .setDescription(`Error: ${error?.message || error?.toString() || error}`)
                    .setFooter(message.author.username, message.author.dynamicAvatarURL())

                return message.channel.createMessage({ embed })

            })
    }
}