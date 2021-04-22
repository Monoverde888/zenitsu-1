import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'
import model from '../../models/profile'

class Comando extends Command {

    constructor() {
        super();
        this.name = "darinsignia"
        this.category = 'developer'
        this.dev = true;
    };

    async run({ client, message, embedResponse, args }: commandinterface) {

        let user = message.mentions.users.first();

        if (!user)
            return embedResponse('menciona xd')

        if (!args[1])
            return embedResponse('y la insignia pa cuando po\'')

        let data = await model.findOneAndUpdate({ id: user.id }, { $addToSet: { insignias: args[1] } }, { new: true });

        return embedResponse(`Insignia añadida a ${user.tag}\n\nActuales: ${data.insignias.join(', ')}`);

    }
}

export default Comando;