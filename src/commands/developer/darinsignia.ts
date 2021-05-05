import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import model from '../../models/profile.js'
import light from 'discord.js-light'

class Comando extends Command {

    constructor() {
        super();
        this.name = "darinsignia"
        this.category = 'developer'
        this.dev = true;
    }

    async run({ message, embedResponse, args }: commandinterface): Promise<light.Message> {

        const user = message.mentions.users.first();

        if (!user)
            return embedResponse('menciona xd')

        if (!args[1])
            return embedResponse('y la insignia pa cuando po\'')

        const data = await model.findOneAndUpdate({ id: user.id }, { $addToSet: { insignias: args[1] } }, { new: true });

        return embedResponse(`Insignia añadida a ${user.tag}\n\nActuales: ${data.insignias.join(', ')}`);

    }
}

export default Comando;