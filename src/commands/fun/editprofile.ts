import BaseCommand from '../../Utils/Classes/command.js';
import getUser from '../../Utils/Functions/getuser.js';
import json from '../../Utils/Lang/langs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import getGuild from '../../Utils/Functions/getguild.js';
import redis from '../../Utils/Managers/Redis.js';
import model from '../../Database/models/user.js';
import parseArgs from '../../Utils/Functions/parseargs.js';

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [
        `${prefix}editprofile <color|description> value`
      ]
    },
    category: 'fun'
  },
  name: 'editprofile',
  onBeforeRun(_ctx, { arg }) {
    const args = parseArgs(arg)
    if (!args[0] || !['color', 'description'].includes(args[0].toLowerCase()) || !args[1]) return false;
    return true;
  },
  async run(ctx, { arg: XDDDDDDDDD }) {

    const langjson = json[(await getGuild(ctx.guildId)).lang];
    await getUser(ctx.userId);
    const args = parseArgs(XDDDDDDDDD)
    const [what, ...value] = args;

    switch (what.toLowerCase()) {

      case 'color': {

        const newColor = parseInt(value[0], 16);

        if (!newColor && newColor != 0) {

          const embed = new MessageEmbed()
            .setImage(`https://cdn.discordapp.com/attachments/842090973311270914/843166076673327134/G64ZYWcv.gif`)
            .setDescription(langjson.commands.editprofile.invalid)
            .setColor(0xff0000);
          return ctx.reply({ embed });

        }

        return model.findOneAndUpdate({ id: ctx.userId }, { color: newColor.toString(16) }, { new: true, upsert: true }).then(async (d) => {

          await redis.set(ctx.userId, JSON.stringify(d));

          const embed = new MessageEmbed()
            .setColor(newColor)
            .setDescription(langjson.commands.editprofile.new_color)
          return ctx.reply({ embed });

        });

      }

      case 'description': {

        if (!value.join(' ')) {

          const embed = new MessageEmbed()
            .setDescription(langjson.commands.editprofile.description_invalid(ctx.prefix))
            .setColor(0xff0000);
          return ctx.reply({ embed });

        }

        return model.findOneAndUpdate({ id: ctx.userId }, { description: value.join(' ') }, { new: true, upsert: true }).then(async (d) => {

          await redis.set(ctx.userId, JSON.stringify(d));

          const embed = new MessageEmbed()
            .setColor(0xff0000)
            .setDescription(langjson.commands.editprofile.description_nice(ctx.prefix));
          return ctx.reply({ embed });

        });

      }

    }
  },
});
