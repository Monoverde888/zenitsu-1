import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import light from 'discord.js-light';
const { MessageEmbed } = light;

class Comando extends Command {

    constructor() {
        super();
        this.name = "setlang"
        this.alias = []
        this.category = 'admin'
        this.botPermissions = { guild: [], channel: ['EMBED_LINKS'] }
        this.memberPermissions = { guild: ['MANAGE_GUILD'], channel: [] }
    }

    async run({ client, message, args, langjson }: commandinterface): Promise<light.Message> {

        const selectLang = args[0] ? args[0].toLowerCase() : null;

        switch (selectLang) {

            case 'es':
                await client.lang.set(message.guild.id, 'es')
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`🇪🇸 | Establecido al español :D.`)
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
                );

            case 'en':
                await client.lang.set(message.guild.id, 'en')
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`🇺🇸 | Established in English.`)
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true, format: 'png' }))
                );

            default:
                return message.channel.send(
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(langjson.commands.setlang.invalid)
                        .setAuthor(`${client.prefix.cache.get(message.guild.id).prefix}setlang (es|en)`)
                );


        }

    }

}

export default Comando;