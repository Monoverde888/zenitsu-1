import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import light from 'discord.js-light';

class Comando extends Command {

    constructor() {
        super();
        this.name = 'play';
        this.category = 'music';
        this.dev = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run({ client, message, embedResponse, args, Hora }: commandinterface): Promise<void> {

        const busqueda = args.join(' ') || 'rick roll';

        message.channel.send(`Buscando \`${busqueda.slice(0, 100)}\`...`)

        const date = Date.now()

        console.log(date)

        await client.music.playVoiceChannel(message.member.voice.channel, busqueda, {
            skip: false,
            textChannel: message.channel as light.TextChannel,
            member: message.member
        });

        console.log(Date.now() - date)

    }

}

export default Comando;