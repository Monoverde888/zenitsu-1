import util from 'util'
const { promisify } = util;
import Command from '../../Utils/Classes/command.js';
import command from '../../Utils/Interfaces/run.js'
import child_process from 'child_process';
const { exec: execC } = child_process;
const exec = promisify(execC)
import light from '@lil_macrock22/eris-light-pluris';
class Comando extends Command {

    constructor() {
        super()
        this.name = "exec"
        this.alias = ['ex']
        this.category = 'developer'
        this.dev = true;
    }

    async run({ message, args }: command): Promise<light.Message | light.Message[]> {

        if (!args[0])
            return message.channel.createMessage('eres o te haces?');

        try {

            const res = await exec(args.join(' '));

            if (res.stderr.length) {
                message.channel.createMessage('```STDERR:\n' + res.stderr.slice(0, 1500) + '```');
            }

            if (res.stdout.length) {
                return message.channel.createMessage('```STDOUT:\n' + res.stdout.slice(0, 1500) + '```');
            }

        } catch (err) {

            return message.channel.createMessage('```ERR:\n' + err.message.slice(0, 1500) + '```');

        }
    }
}

export default Comando;
