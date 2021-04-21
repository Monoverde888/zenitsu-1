import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run';
import model from '../../models/music';
import emojis from '../../Utils/emojis.json';

class Comando extends Command {

    constructor() {
        super();
        this.name = 'setupmusic';
        this.category = 'music';
        this.cooldown = 20;
        this.botPermissions = {
            guild: ['MANAGE_CHANNELS'],
            channel: []
        }
        this.memberPermissions = {
            guild: ['MANAGE_GUILD'],
            channel: []
        };
        this.dev = true;
    };

    run({ client, message, embedResponse, args, Hora }: commandinterface) {


        return message.guild.channels.create('zenitsu-music', { topic: 'topico xd' })
            .then(async c => {

                const msg = await c.send({ embed: { description: 'embed base' } });

                for (let i of Object.values(emojis.musica)) await msg.react(i);

                let data = await model.findOneAndUpdate({ guild: message.guild.id }, { channel: c.id, message: msg.id }, { new: true });

                if (!data)
                    data = await model.create({
                        guild: message.guild.id,
                        channel: c.id,
                        message: msg.id
                    });

                return message.channel.send(`${c} :p.`)

            })
    }
}

export default Comando;