const { promisify } = require('util');
import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'
import child from 'child_process'

class Comando extends Command {

    constructor() {
        super()
        this.name = "exec"
        this.alias = ['ex']
        this.category = 'developer'
        this.dev = true;
    }

    async run({ message, args }: commandinterface) {

        if (!args[0])
            return message.channel.send('eres o te haces?');

        try {

            const res = await promisify(child.exec)(args.join(' '));

            if (res.stderr.length) {
                message.channel.send('STDERR:\n' + res.stderr, { split: { char: '', maxLength: 1950 }, code: '' });
            }

            if (res.stdout.length) {
                message.channel.send('STDOUT:\n' + res.stdout, { split: { char: '', maxLength: 1950 }, code: '' });
            }

        } catch (err) {

            return message.channel.send('ERR:\n' + err, { split: { char: '', maxLength: 1950 }, code: '' });

        }
    }
};

export default Comando;
