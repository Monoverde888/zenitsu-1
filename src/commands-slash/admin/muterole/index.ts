import {BaseCommandOptionGroup} from "../../../utils/classes/slash.js";
import {init}                   from './init.js';
import {refresh}                from './refresh.js';
import detritus                 from 'detritus-client';

const {Constants : {Permissions : Flags}} = detritus;

export function muterole() {
    class IndexMuterole extends BaseCommandOptionGroup {
        constructor() {
            super({
                options : [init(), refresh()]
            });
            this.name = "muterole";
            this.description = ".";
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
            this.permissionsClient = [Flags.MANAGE_GUILD, Flags.MANAGE_ROLES, Flags.MANAGE_CHANNELS].map(BigInt);
        }
    }

    return new IndexMuterole();
}
