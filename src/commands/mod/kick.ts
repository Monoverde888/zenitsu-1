import run from "../../Utils/Interfaces/run.js";
import Command from '../../Utils/Classes/command.js';
import light from 'eris-pluris';
import canMod from "../../Utils/Functions/canMod.js";
import MessageEmbed from "../../Utils/Classes/Embed.js";
function getHighest(member: light.Member): light.Role {

    const memberRole = Array.from(member.roleList).map(e => e[1]);

    memberRole.push(member.guild.roles.get(member.guild.id))

    const memberRoleSort = memberRole.sort((a, b) => b.position - a.position)[0];

    return memberRoleSort

}


export default class Comando extends Command {
    constructor() {
        super()
        this.name = "kick"
        this.category = 'mod';
        this.botPermissions.guild = ['kickMembers'];
        this.cooldown = 6;
        this.memberPermissions.guild = ['kickMembers'];
    }

    run({ args, message, langjson, client, embedResponse }: run): Promise<light.Message> {


        const user = message.mentions.filter(member => member.id != message.author.id)[0];
        const member = message.guild.members.get(user?.id);
        if (!member) return embedResponse(langjson.commands.kick.mention);
        if (!canMod(member, client, 'kick')) return embedResponse(langjson.commands.kick.cannt_kick(`**${client.unMarkdown(member.user.username)}**`))
        if (message.author.id !== message.guild.ownerID) {
            if (getHighest(message.member).position < getHighest(member).position) return embedResponse(langjson.commands.kick.user_cannt_kick(`**${client.unMarkdown(member.user.username)}**`))
        }

        const reason = args.join(' ')?.replace('<@!' + member.id + '>', '').slice(0, 500) || null;
        return member.kick(reason).then(() => {

            const embed = new MessageEmbed()
                .setColor(0x2ecc71)
                .setDescription(langjson.commands.kick.kick(`**${client.unMarkdown(user.username)}**`, reason))
                .setFooter(message.author.username, message.author.dynamicAvatarURL())

            return message.channel.createMessage({ embed })

        })
            .catch((error) => {

                const embed = new MessageEmbed()
                    .setColor(0xff0000)
                    .setDescription(`Error: ${error?.message || error?.toString() || error}`)
                    .setFooter(message.author.username, message.author.dynamicAvatarURL())

                return message.channel.createMessage({ embed })

            })
    }
}