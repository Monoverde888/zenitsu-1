import * as  light from '@lil_marcrock22/eris-light';
import run from '../../Utils/Interfaces/run.js';
import Command from '../../Utils/Classes/command.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import fetch from 'node-fetch';
import profile, { Profile as PROFILE } from '../../models/profile.js';

export default class Comando extends Command {

  constructor() {
    super()
    this.name = "profile";
    this.category = 'fun';
    this.botPermissions.channel = ['attachFiles'];
    this.cooldown = 10;
  }

  async run({ message, langjson }: run): Promise<light.Message> {

    const user = message.mentions.filter(user => !user.bot)[0] || message.author;
    const data: PROFILE = await this.client.redis.get(user.id, 'profile_').then(x => typeof x == 'string' ? JSON.parse(x) : null) || await profile.findOne({ id: user.id }) || await profile.create({
      id: user.id,
      flags: [],
      achievements: [],
      color: '000000',
      description: `\u200b`
    });

    await this.client.redis.set(user.id, JSON.stringify(data), 'profile_');

    const { flags, achievements } = data;
    const randomColor = Math.floor(Math.random() * (0xffffff + 1));
    let color = data.color || randomColor.toString(16)

    try {

      const response = await fetch(`${process.env.APIPROFILE}/${encodeURIComponent(JSON.stringify({
        color,
        avatar: user.dynamicAvatarURL('png'),
        discriminator: user.discriminator,
        username: user.username,
        achievements,
        flags,
        flagsTEXT: langjson.commands.profile.flags,
        achievementsTEXT: langjson.commands.profile.achievements
      }))}`, {
        headers:
          { 'authorization': process.env.APIKEY }
      })

      const buf = await response.buffer();

      const embed = new MessageEmbed()
        .setColor(parseInt(color, 16) || 0)
        .setDescription(data.description)
        .setImage('attachment://profile.png');

      return message.channel.createMessage({ embed }, [{ file: buf, name: 'profile.png' }]);

    }

    catch{

      return message.channel.createMessage('Error...');

    };

  }
}
