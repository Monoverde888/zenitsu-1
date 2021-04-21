import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'
import { TextChannel } from 'discord.js-light'

class Comando extends Command {

    constructor() {
        super();
        this.name = "accept"
        this.category = 'developer'
        this.dev = true;
    };

    async run({ client, message, embedResponse, args }: commandinterface) {


        if (!args[0]) return embedResponse('Escribe una ID valida')
        if (!args[1]) return embedResponse('Escribe algo!')

        if (await messageS(args[0]) === false) return embedResponse('No he encontrado ese mensaje!')
        else {
            (client.channels.cache.get('727948582556270682') as TextChannel).messages.fetch(args[0]).then(a => {
                a.edit(a.embeds[0]
                    .addField('Aceptado!', args.slice(1).join(' '))
                    .setColor('GREEN'))

                return a.react('✅')
            });
            return embedResponse('Sugerencia aceptada!')
        }

        function messageS(id) {
            return new Promise((resolve) => {
                (client.channels.cache.get('727948582556270682') as TextChannel).messages.fetch(id)
                    .then(() => {
                        return resolve(true);
                    })
                    .catch(() => {
                        return resolve(false);
                    })
            })
        }
    }
}

export default Comando;