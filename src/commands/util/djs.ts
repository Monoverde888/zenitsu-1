import Command from '../../Utils/Classes/command.js'
import fetch from 'axios'
import run from '../../Utils/Interfaces/run.js';
import * as  light from '@lil_marcrock22/eris-light'
export default class Comando extends Command {
    constructor() {
        super()
        this.name = "djs"
        this.category = 'utils'
    }
    async run({ message, args, embedResponse, langjson, client }: run): Promise<light.Message> {
        if (!args[0]) return embedResponse(langjson.commands.djs.what, message.channel, client.color);
        const response = await fetch(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(args.join(' '))}`).catch(() => undefined);
        const megadb = response?.data;
        if (!megadb) return embedResponse(langjson.commands.djs.no_result, message.channel, client.color)
        return message.channel.createMessage({ embed: megadb }).catch(() => undefined);
    }
}