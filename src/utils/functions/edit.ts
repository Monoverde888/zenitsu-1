import detritus   from "detritus-client";

const {Constants : {Permissions : Flags}} = detritus;
import getHighest from "./gethighest.js";

export async function Edit(all : { canales : detritus.Structures.Channel[], id : string, guild : detritus.Structures.Guild }) : Promise<{ error : Error, success : boolean }> {

    const {canales, id, guild} = all;
    let success = true;
    let error : Error = null;
    const GUILDME = guild.me;

    const permisos = [Flags.MANAGE_GUILD];

    for (const canal of canales) {
        const permisosBit = Number(Flags.SEND_MESSAGES + Flags.ADD_REACTIONS);
        const permisosVoice = Number(Flags.CONNECT + Flags.SPEAK + Flags.STREAM);
        const role = guild.roles.get(id);
        const check = GUILDME.can(permisos) && role && !((getHighest(GUILDME).position < role.position) || role.managed);

        if (check && success) {
            await canal.editOverwrite(id, {
                allow : 0,
                deny : (canal.type == 2 || canal.type == 13) ? permisosVoice : permisosBit
            })
                       .then(() => {
                           success = true;
                       })
                       .catch((e) => {
                           error = e;
                           success = false;
                       });
        }
        else {
            success = false;
        }

    }

    return {success, error};

}

export function filter(item : detritus.Structures.Channel, id : string) {

    const TEXT = Number(Flags.SEND_MESSAGES + Flags.ADD_REACTIONS);
    const VOICE = Number(Flags.CONNECT + Flags.SPEAK + Flags.STREAM);

    if ([13, 2].includes(item.type)) {
        if (!item.permissionOverwrites.has(id)) return true;
        if ((Number(item.permissionOverwrites.get(id).deny) & VOICE) == VOICE) return false;
        else return true;
    }

    else if ([4, 0, 5].includes(item.type)) {
        if (!item.permissionOverwrites.has(id)) return true;
        if (((Number(item.permissionOverwrites.get(id).deny) & TEXT) == TEXT)) return false;
        else return true;
    }

    return false;

}