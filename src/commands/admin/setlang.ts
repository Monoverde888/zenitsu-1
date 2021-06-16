import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import * as light from '@lil_marcrock22/eris-light';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import lang from '../../models/lang.js';

class Comando extends Command {

  constructor() {
    super();
    this.name = "setlang"
    this.alias = []
    this.category = 'admin'
    this.memberPermissions = { guild: ['manageGuild'], channel: [] }
  }

  async run({ message, args, langjson, prefix }: command): Promise<light.Message> {

    const selectLang = args[0] ? args[0].toLowerCase() : null;

    switch (selectLang) {

      case 'es': {

        const data = await lang.findOneAndUpdate({ id: message.guild.id }, { lang: 'es' }, { new: true, upsert: true }).lean();

        await this.client.redis.set(message.guildID, JSON.stringify(data), 'lang_');

        return message.channel.createMessage({
          embed:
            new MessageEmbed()
              .setColor(this.client.color)
              .setDescription(`🇪🇸 | Establecido al español :D.`)
              .setAuthor(message.author.username, message.author.dynamicAvatarURL())
        });
      }

      case 'en': {

        const data = await lang.findOneAndUpdate({ id: message.guild.id }, { lang: 'en' }, { new: true, upsert: true }).lean();

        await this.client.redis.set(message.guildID, JSON.stringify(data), 'lang_');

        return message.channel.createMessage({
          embed:
            new MessageEmbed()
              .setColor(this.client.color)
              .setDescription(`🇺🇸 | Established in English.`)
              .setAuthor(message.author.username, message.author.dynamicAvatarURL())
        });

      }

      default:
        return message.channel.createMessage({
          embed:
            new MessageEmbed()
              .setColor(this.client.color)
              .setDescription(langjson.commands.setlang.invalid)
              .setAuthor(`${prefix}setlang (es|en)`)
        });


    }

  }

}

export default Comando;
