import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js';
import eris from '@lil_macrock22/eris-light-pluris';
import replace from '../../Utils/Functions/replace.js'
import util from 'util';
const { inspect } = util;
import MessageEmbed from '../../Utils/Classes/Embed.js'

class Comando extends Command {

    constructor() {
        super();
        this.name = 'asynceval';
        this.category = 'developer';
        this.alias = ['ae'];
        this.dev = true;
    }

    async run({ client, message, args }: command): Promise<eris.Message> {

        try {
            const code = args.join(" ");
            const res_evalued = await eval(`(async() => { ${code} })()`);
            const TYPE = typeof (res_evalued)
            let evalued = inspect(res_evalued, { depth: 0 });
            evalued = replace(evalued, client.private)
            const embed = new MessageEmbed()
                .setColor(client.color)
                .setDescription('```js\n' + evalued.slice(0, 2000) + '\n```')
                .setTimestamp()
                .setFooter(message.author.username, message.author.dynamicAvatarURL())
                .addField('typeof', TYPE, true)
                .addField('Class', res_evalued?.constructor?.name || 'nao nao amiko', true)
            return await message.channel.createMessage({ embed: embed })
        }
        catch (err) {
            return message.channel.createMessage('```js\n' + err.toString().slice(0, 1500) + '```')
        }
    }
}

export default Comando;