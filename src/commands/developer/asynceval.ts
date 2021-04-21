import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'
import { inspect } from 'util'
import { Util, MessageEmbed } from 'discord.js-light'
import replace from '../../Utils/Functions/replace'

class Comando extends Command {

    constructor() {
        super();
        this.name = 'asynceval';
        this.category = 'developer';
        this.alias = ['ae'];
        this.dev = true
    };

    async run({ client, message, embedResponse, args, Hora }: commandinterface) {

        try {

            let code = args.join(" ");
            let evalued = await eval(`(async () => { ${code} })()`);
            let TYPE = typeof (evalued)
            evalued = inspect(evalued, { depth: 0 });
            evalued = replace(evalued, client.private)
            const res = Util.splitMessage(evalued, { char: '', maxLength: 2000 });

            for (let minires of res) {

                const embed = new MessageEmbed()
                    .setColor(client.color)
                    .setDescription('```js\n' + minires + '\n```')
                    .setTimestamp()
                    .setFooter(message.author.tag, message.author.displayAvatarURL({ dynamic: true, size: 2048 }))
                    .addField('typeof', '```js\n' + TYPE + '\n```', true)
                message.channel.send({ embed: embed })

                await Util.delayFor(2000);
            }
        } catch (err) {
            message.channel.send(err, { code: 'js' })
        }
    }

}

export default Comando;