import inte from '../Interfaces/run';
import light from 'discord.js-light'

class Command {

    dev: boolean
    alias: string[]
    name: string
    category: string
    botPermissions: {
        guild: light.PermissionResolvable[]
        channel: light.PermissionResolvable[]
    }
    cooldown: number
    memberPermissions: {
        guild: light.PermissionResolvable[]
        channel: light.PermissionResolvable[]
    }

    constructor() {

        this.dev = false;
        this.alias = []
        this.name = 'NO_NAME_COMMAND'
        this.category = 'none'
        this.botPermissions = {
            guild: [],
            channel: []
        }
        this.cooldown = 4;
        this.memberPermissions = {
            guild: [],
            channel: []
        }
    }
    run({ client, message, args, embedResponse, Hora }: inte): any {

    }

}

export default Command;