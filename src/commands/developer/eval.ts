import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import light from 'discord.js-light';
const { Util, MessageEmbed } = light;
import replace from '../../Utils/Functions/replace.js'
import util from 'util';
const { inspect } = util;


class Comando extends Command {

    constructor() {
        super();
        this.name = 'eval';
        this.category = 'developer';
        this.alias = ['e'];
        this.dev = true;
    }

    async run({ client, message, args }: commandinterface): Promise<light.Message> {

        try {
            const code = args.join(" ");
            let evalued = await eval(code);
            const TYPE = typeof (evalued)
            evalued = inspect(evalued, { depth: 0 });
            evalued = replace(evalued, client.private)
            const res = Util.splitMessage(evalued, { char: '', maxLength: 2000 });
            let poto: light.Message
            let index = 1;
            for (const minires of res) {
                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription('```js\n' + minires + '\n```')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
                    .addField('typeof', '```js\n' + TYPE + '\n```', true)
                    .setAuthor(`${index}/${res.length}`);

                index++

                poto = await message.channel.send({ embed: embed })
                await Util.delayFor(2000)
            }
            return poto;
        } catch (err) {
            message.channel.send(err, { code: 'js' })
        }
    }
}

export default Comando;