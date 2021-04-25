import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'

class Comando extends Command {

    constructor() {
        super();
        this.name = 'play';
        this.category = 'music';
        this.dev = true;
    };

    async run({ client, message, embedResponse, args, Hora }: commandinterface) {

        let busqueda = args.join(' ') || 'rick roll';

        message.channel.send(`Buscando \`${busqueda.slice(0, 100)}\`...`)

        return client.music.play(message, busqueda);

    }

}

export default Comando;