import * as  light from '@lil_marcrock22/eris-light';
import run from '../../Utils/Interfaces/run.js';
import Command from '../../Utils/Classes/command.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import profile from '../../models/profile.js';

export default class Comando extends Command {

  constructor() {
    super()
    this.name = "editprofile";
    this.category = 'fun';
  }

  async run({ message, langjson, args, prefix }: run): Promise<light.Message> {

    const [what, ...value] = args

    if (!what) {

      const embed = new MessageEmbed()
        .setColor(this.client.color)
        .setDescription(langjson.commands.editprofile.bad_usage(prefix))
      return message.channel.createMessage({ embed });

    }

    switch (what) {

      case 'color': {

        const newColor = parseInt(value[0], 16);

        if (!newColor && newColor != 0) {

          const embed = new MessageEmbed()
            .setImage(`https://cdn.discordapp.com/attachments/842090973311270914/843166076673327134/G64ZYWcv.gif`)
            .setDescription(langjson.commands.editprofile.invalid)
            .setColor(this.client.color);
          return message.channel.createMessage({ embed });

        }

        return profile.findOneAndUpdate({ id: message.author.id }, { color: newColor.toString(16) }, { new: true, upsert: true }).then(async (d) => {

          await this.client.redis.set(message.author.id, JSON.stringify(d), 'profile_');

          const embed = new MessageEmbed()
            .setColor(newColor)
            .setDescription(langjson.commands.editprofile.new_color)
          return message.channel.createMessage({ embed });

        });

      }

      case 'description': {

        if (!value.join(' ')) {

          const embed = new MessageEmbed()
            .setDescription(langjson.commands.editprofile.description_invalid(prefix))
            .setColor(this.client.color);
          return message.channel.createMessage({ embed });

        }

        return profile.findOneAndUpdate({ id: message.author.id }, { description: value.join(' ') }, { new: true, upsert: true }).then(async (d) => {

          await this.client.redis.set(message.author.id, JSON.stringify(d), 'profile_');

          const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setDescription(langjson.commands.editprofile.description_nice(prefix));
          return message.channel.createMessage({ embed });

        });

      }

      default: {

        const embed = new MessageEmbed()
          .setColor(this.client.color)
          .setDescription(langjson.commands.editprofile.bad_usage(prefix))
        return message.channel.createMessage({ embed });

      }

    }

  }
}
