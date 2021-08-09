import {BaseSlash}      from "../../../utils/classes/slash.js";
import {muterole}    from "./muterole/index.js";
import {view}        from './view.js';
import {onlythreads} from './onlythreads.js';
import {reset}          from './reset.js';
import {ignorechannels} from './ignorechannels.js';
import detritus         from 'detritus-client';
const {Constants : {Permissions : Flags}} = detritus;
export default function () {
    class Settings extends BaseSlash {
        constructor() {
            super();
            this.name = "settings";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [
                        prefix + "settings (view|muterole|reset)",
                        prefix + "settings view",
                        prefix + "settings ignorechannels #ChannelMention",
                        prefix + "settings onlythreads",
                        prefix + "settings muterole init [role]",
                        prefix + "settings muterole refresh",
                        prefix + "settings reset"
                    ];
                },
                category : "admin",
            }
            this.disableDm = true;
            this.options = [muterole(), view(), reset(), onlythreads(), ignorechannels()];
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
            this.permissionsClient = [Flags.MANAGE_GUILD, Flags.MANAGE_ROLES, Flags.MANAGE_CHANNELS].map(BigInt);
        }
    }

    return new Settings();
}
