import run from '../../Utils/Interfaces/run.js';
import Command from '../../Utils/Classes/command.js';
import MODEL from '../../models/c4maps.js';
import * as eris from '@lil_marcrock22/eris-light';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import fetch from 'node-fetch';

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "connect4view";
        this.category = 'fun';
        this.alias = [`conecta4view`, 'fourinrowview', '4enlineaview', 'c4view']
        this.cooldown = 20;
    }

    async run({ args, message, langjson }: run): Promise<eris.Message> {

        const _id = args[0];
        const embed = new MessageEmbed()
            .setColor(this.client.color)
            .setImage('https://i.imgur.com/qcek7Ll.gif')
            .setDescription(langjson.commands.connect4view.invalid);

        if (!_id) return message.channel.createMessage({ embed });

        const data = await MODEL.findById(_id).catch(() => {
            null;
        });

        if (!data) return message.channel.createMessage({ embed });

        try {

            const response = await fetch(`${process.env.APICONNECTFOUR}/${encodeURIComponent(JSON.stringify(data.maps))}`, {
                headers:
                    { 'authorization': process.env.APIKEY }
            });

            const buffer = await response.buffer();

            return message.channel.createMessage(undefined, [{ file: buffer, name: 'ggez.gif' }]);

        }

        catch (e) {

            return message.channel.createMessage('Error...');

        }

    }
}
