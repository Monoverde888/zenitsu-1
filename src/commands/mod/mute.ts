import run from "../../Utils/Interfaces/run.js";
import Command from '../../Utils/Classes/command.js';
import light from 'eris-pluris';
import MessageEmbed from "../../Utils/Classes/Embed.js";
import settings from "../../models/settings.js";
import getHighest from '../../Utils/Functions/getHighest.js';
import canMod from "../../Utils/Functions/canMod.js";

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "mute"
        this.category = 'mod';
        this.botPermissions.guild = ['manageRoles'];
        this.cooldown = 6;
        this.memberPermissions.guild = ['kickMembers'];
    }

    async run({ message, langjson, client, embedResponse }: run): Promise<light.Message> {

        const data = await settings.findOne({ id: message.guildID });
        const ROLE_BOT = getHighest(message.guild.members.get(client.user.id));
        const role = message.guild.roles.get(data?.muterole);

        if (!role)
            return embedResponse(langjson.commands.mute.no_role(client.prefix.cache.get(message.guild.id)?.prefix));

        if (role.position >= ROLE_BOT.position)
            return embedResponse(langjson.commands.mute.cant_role(role.mentionable ? role.name : role.mention))

        const user = message.mentions.filter(user => user.id != message.author.id || user.id != message.guild.ownerID)[0];
        const member = message.guild.members.get(user?.id);

        if (!member) return embedResponse(langjson.commands.mute.mention);
        if (member.roles.includes(role.id)) return embedResponse(langjson.commands.mute.already_muted(client.unMarkdown(member.username)));
        if (message.author.id != message.guild.ownerID) {
            if (getHighest(message.member).position < getHighest(member).position) return embedResponse(langjson.commands.mute.user_cannt_mute(`**${client.unMarkdown(member.user.username)}**`))
        }

        return member.addRole(role.id)
            .then(() => {

                const embed = new MessageEmbed()
                    .setColor(0x2ecc71)
                    .setDescription(langjson.commands.mute.mute(client.unMarkdown(member.username)))
                    .setFooter(message.author.username, message.author.dynamicAvatarURL())

                return message.channel.createMessage({ embed })

            })
            .catch((error) => {

                const embed = new MessageEmbed()
                    .setColor(0xff0000)
                    .setDescription(`Error: ${error?.message || error?.toString() || error}`)
                    .setFooter(message.author.username, message.author.dynamicAvatarURL())

                return message.channel.createMessage({ embed })

            });
    }
}