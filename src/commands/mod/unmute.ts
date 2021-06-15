import run from "../../Utils/Interfaces/run.js";
import Command from '../../Utils/Classes/command.js';
import * as light from '@lil_marcrock22/eris-light';
import MessageEmbed from "../../Utils/Classes/Embed.js";
import getHighest from '../../Utils/Functions/getHighest.js';
import settings, { Settings as SETTINGS } from "../../models/settings.js";

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "unmute"
        this.category = 'mod';
        this.botPermissions.guild = ['manageRoles'];
        this.cooldown = 6;
        this.memberPermissions.guild = ['kickMembers'];
    }

    async run({ message, langjson, embedResponse, prefix }: run): Promise<light.Message> {

        const data: SETTINGS = await this.client.redis.get(message.guildID, 'settings_').then(x => typeof x == 'string' ? JSON.parse(x) : null) || await settings.findOne({ id: message.guildID }) || await settings.create({
            id: message.guildID,
            muterole: '1'
        });

        await this.client.redis.set(message.guildID, JSON.stringify(data), 'settings_');

        const ROLE_BOT = getHighest(message.guild.me);
        const role = message.guild.roles.get(data ?.muterole);

        if (!role)
            return embedResponse(langjson.commands.unmute.no_role(prefix), message.channel, this.client.color);

        if (role.position >= ROLE_BOT.position)
            return embedResponse(langjson.commands.unmute.cant_role(role.mentionable ? role.name : role.mention), message.channel, this.client.color)

        const user = message.mentions.filter(user => user.id != message.author.id)[0];
        const member = user ?.member;

        if (!member) return embedResponse(langjson.commands.unmute.mention, message.channel, this.client.color);
        if (!member.roles.includes(role.id)) return embedResponse(langjson.commands.unmute.already_unmuted(this.client.unMarkdown(user.username)), message.channel, this.client.color);
        if (message.author.id != message.guild.ownerID) {
            if (getHighest(message.member).position <= getHighest(member).position) return embedResponse(langjson.commands.unmute.user_cannt_unmute(`**${this.client.unMarkdown(user.username)}**`), message.channel, this.client.color)
        }

        return member.removeRole(role.id)
            .then(() => {

                const embed = new MessageEmbed()
                    .setColor(0x2ecc71)
                    .setDescription(langjson.commands.unmute.unmute(this.client.unMarkdown(user.username)))
                    .setFooter(message.author.username, message.author.dynamicAvatarURL())

                return message.channel.createMessage({ embed })

            })
            .catch((error) => {

                const embed = new MessageEmbed()
                    .setColor(0xff0000)
                    .setDescription(`Error: ${error ?.message || error ?.toString() || error}`)
                    .setFooter(message.author.username, message.author.dynamicAvatarURL())

                return message.channel.createMessage({ embed })

            });
    }
}
