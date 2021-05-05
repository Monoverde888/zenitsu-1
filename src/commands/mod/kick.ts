import run from "../../Utils/Interfaces/run.js";
import Command from '../../Utils/Classes/command.js';
import light from 'discord.js-light';
const { MessageEmbed } = light;

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "kick"
        this.category = 'mod';
        this.botPermissions.guild = ['KICK_MEMBERS'];
        this.cooldown = 6;
        this.memberPermissions.guild = ['KICK_MEMBERS'];
    }

    run({ args, message, langjson, client, embedResponse }: run): Promise<light.Message> {


        const member = message.mentions.members.filter(member => member.id != message.author.id).first();
        if (!member) return embedResponse(langjson.commands.kick.mention);
        if (!member.kickable) return embedResponse(langjson.commands.kick.cannt_kick(`**${client.unMarkdown(member.user.username)}**`))
        if (message.author.id !== message.guild.ownerID) {
            if (member.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) return embedResponse(langjson.commands.kick.user_cannt_kick(`**${client.unMarkdown(member.user.username)}**`))
        }

        const reason = args.join(' ')?.replace('<@!' + member.id + '>', '').slice(0, 500) || null;
        return member.kick(reason).then((kicked) => {

            const embed = new MessageEmbed()
                .setColor('GREEN')
                .setDescription(langjson.commands.kick.kick(`**${client.unMarkdown(kicked.user.username)}**`, reason))
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