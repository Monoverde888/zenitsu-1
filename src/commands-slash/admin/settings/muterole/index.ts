import {BaseCommandOptionGroup} from "../../../../utils/classes/slash.js";
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
            this.description = "Configure mute role";
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
            this.permissionsClient = [Flags.MANAGE_GUILD, Flags.MANAGE_ROLES, Flags.MANAGE_CHANNELS].map(BigInt);
            this.metadata = {
                usage(prefix : string) {
                    return [
                        prefix + "settings muterole init [role]",
                        prefix + "settings muterole refresh",
                    ];
                },
                category : "admin",
            }
        }
    }

    return new IndexMuterole();
}
