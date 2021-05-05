import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import util from 'util'
const { inspect } = util;
import light from 'discord.js-light';
const { Util, MessageEmbed } = light
import replace from '../../Utils/Functions/replace.js'

class Comando extends Command {

    constructor() {
        super();
        this.name = 'asynceval';
        this.category = 'developer';
        this.alias = ['ae'];
        this.dev = true
    }

    async run({ client, message, args }: commandinterface): Promise<light.Message> {

        try {

            const code = args.join(" ");
            let evalued = await eval(`(async () => { ${code} })()`);
            const TYPE = typeof (evalued)
            evalued = inspect(evalued, { depth: 0 });
            evalued = replace(evalued, client.private)
            const res = Util.splitMessage(evalued, { char: '', maxLength: 2000 });
            let poto: light.Message;
            for (const minires of res) {

                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription('```js\n' + minires + '\n```')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
                    .addField('typeof', '```js\n' + TYPE + '\n```', true)
                poto = await message.channel.send({ embed: embed })

                await Util.delayFor(2000);
            }
            return poto
        } catch (err) {
            return message.channel.send(err, { code: 'js' })
        }
    }

}

export default Comando;