import * as  light from '@lil_marcrock22/eris-light';
import run from '../../Utils/Interfaces/run.js';
import Command from '../../Utils/Classes/command.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';

export default class Comando extends Command {

    constructor() {
        super()
        this.name = "editprofile";
        this.category = 'fun';
    }

    async run({ message, client, langjson, args }: run): Promise<light.Message> {

        const [what, ...value] = args

        if (!what) {

            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription(langjson.commands.editprofile.bad_usage(client.prefix.cache.get(message.guildID)?.prefix))
            return message.channel.createMessage({ embed });

        }

        switch (what) {

            case 'color': {

                const newColor = parseInt(value[0], 16);

                if (!newColor && newColor != 0) {

                    const embed = new MessageEmbed()
                        .setImage(`https://cdn.discordapp.com/attachments/842090973311270914/843166076673327134/G64ZYWcv.gif`)
                        .setDescription(langjson.commands.editprofile.invalid)
                        .setColor(client.color);
                    return message.channel.createMessage({ embed });

                }

                return client.profile.set(message.author.id, 'color', newColor.toString(16)).then(() => {

                    const embed = new MessageEmbed()
                        .setColor(newColor)
                        .setDescription(langjson.commands.editprofile.new_color)
                    return message.channel.createMessage({ embed });

                });

            }
                break;

            case 'description': {

                if (!value.join(' ')) {

                    const embed = new MessageEmbed()
                        .setDescription(langjson.commands.editprofile.description_invalid(client.prefix.cache.get(message.guildID)?.prefix))
                        .setColor(client.color);
                    return message.channel.createMessage({ embed });

                }

                return client.profile.set(message.author.id, 'description', value.join(' ')).then(() => {

                    const embed = new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(langjson.commands.editprofile.description_nice(client.prefix.cache.get(message.guildID)?.prefix));
                    return message.channel.createMessage({ embed });

                });

            }
                break;

            default: {

                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription(langjson.commands.editprofile.bad_usage(client.prefix.cache.get(message.guildID)?.prefix))
                return message.channel.createMessage({ embed });

            }

        }

    }
}