import run from "../../Utils/Interfaces/run.js";
import Command from '../../Utils/Classes/command.js';
import light from 'discord.js-light';
const { MessageEmbed } = light;

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "ban"
        this.category = 'mod';
        this.botPermissions.guild = ['BAN_MEMBERS'];
        this.cooldown = 6;
        this.memberPermissions.guild = ['BAN_MEMBERS'];
    }

    run({ args, message, langjson, client, embedResponse }: run) {


        const member = message.mentions.members.filter(member => member.id != message.author.id).first();
        if (!member) return embedResponse(langjson.commands.ban.mention);
        if (!member.bannable) return embedResponse(langjson.commands.ban.cannt_ban(`**${client.unMarkdown(member.user.username)}**`))
        if (message.author.id !== message.guild.ownerID) {
            if (member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) return embedResponse(langjson.commands.ban.user_cannt_ban(`**${client.unMarkdown(member.user.username)}**`))
        }

        const reason = args.join(' ')?.replace('<@!' + member.id + '>', '').slice(0, 500) || null;
        return member.ban({ reason, days: 7 }).then((banned) => {

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(langjson.commands.ban.ban(`**${client.unMarkdown(banned.user.username)}**`, reason))
                .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))

            return message.channel.send({ embed })

        })
            .catch((error) => {

                const embed = new MessageEmbed()
                    .setColor('RED')
                    .setDescription(`Error: ${error?.message || error?.toString() || error}`)
                    .setFooter(message.author.username, message.author.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' }))

                return message.channel.send({ embed })

            })
    }
}