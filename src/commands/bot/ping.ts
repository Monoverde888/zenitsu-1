import { MessageEmbed } from 'discord.js-light';
import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'

class Comando extends Command {

    constructor() {
        super();
        this.name = 'ping';
        this.category = 'bot';
    };

    async run({ client, message, embedResponse, args, Hora }: commandinterface) {

        let date = Date.now();
        let ping_db = await new Promise((r, j) => {
            require('mongoose').connection.db.admin().ping((err, result) => (err || !result) ? j(err || result) : r(Date.now() - date))
        });

        date = Date.now();

        let pong = new MessageEmbed()
            .setTimestamp()
            .setColor(client.color)
            .setDescription('Pong?')

        return message.channel.send({ embed: pong })
            .then(msg => {

                let embed = new MessageEmbed()
                    .setDescription(`🏓 Bot: ${client.ws.ping}ms [${getStatus(client.ws.ping)}]\n📡 Discord API: ${Date.now() - date}ms [${getStatus(Date.now() - date)}]\n🗃️ DB: ${ping_db}ms [${getStatus(ping_db)}]`)
                    .setTimestamp()
                    .setColor(client.color)

                return msg.edit({ embed })

            })

    }

}

export default Comando;

function getStatus(number) {

    let color = '';
    if (number >= 400) color = `⚫`
    else if (number >= 300) color = `🔴`
    else if (number >= 200) color = `🟠`
    else if (number >= 100) color = `🟡`
    else color = `🟢`
    return `\\${color}`

}