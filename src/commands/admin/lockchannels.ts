import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'
import { TextChannel, MessageEmbed, NewsChannel } from 'discord.js-light';

class Comando extends Command {

    constructor() {
        super();
        this.name = "lockchannel"
        this.alias = []
        this.category = 'admin'
        this.botPermissions = { guild: [], channel: ['MANAGE_CHANNELS', 'EMBED_LINKS'] }
        this.memberPermissions = { guild: [], channel: ['MANAGE_CHANNELS'] }
    };

    run({ client, message, embedResponse, args, Hora, langjson, lang }: commandinterface) {

        const canal = (message.channel as (TextChannel | NewsChannel)),
            permisos = canal.permissionOverwrites.get(message.guild.id);

        if (!permisos || !(permisos.deny.toArray().includes('SEND_MESSAGES'))) {
            return canal.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: false
            }).then(() => {
                let embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(langjson.commands.lockchannel[lang + '_on_block'].replace('{MOD}', message.author.tag))
                    .setTimestamp()
                return canal.send({ embed: embed })
            }).catch(err => {
                let embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(langjson.commands.lockchannel[lang + '_on_block_error'])
                    .setTimestamp()
                    .setFooter(err.message || err)
                return canal.send({ embed: embed })
            })
        }
        else {
            return canal.updateOverwrite(message.guild.id, {
                SEND_MESSAGES: null
            }).then(() => {
                let embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(langjson.commands.lockchannel[lang + '_on_unblock'].replace('{MOD}', message.author.tag))
                    .setTimestamp()
                return canal.send({ embed: embed })
            }).catch(err => {
                let embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(langjson.commands.lockchannel[lang + '_on_unblock_error'])
                    .setTimestamp()
                    .setFooter(err.message || err)
                return canal.send({ embed: embed })
            })
        }

    }

}

export default Comando;