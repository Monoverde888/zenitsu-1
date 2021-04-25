import util from 'util'
const { promisify } = util;
import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import child_process from 'child_process';
const { exec: execC } = child_process;
const exec = promisify(execC)
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

            const res = await exec(args.join(' '));

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
