import Command from '../../Utils/Classes/command';
import commandinterface from '../../Utils/Interfaces/run'

class Comando extends Command {

    constructor() {
        super()
        this.name = "reset"
        this.category = 'developer'
        this.dev = true;
    }

    run({ client, message }: commandinterface) {

        return client.commands.get('exec').run({ message, args: ['git checkout . && git pull && pm2 restart all'] });

    }
};

export default Comando;