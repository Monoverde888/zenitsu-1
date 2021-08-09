import detritus from 'detritus-client';

const {Constants : {Permissions : Flags}} = detritus;

function canMod(member : detritus.Structures.Member, client : detritus.ShardClient, mod : 'kick' | 'ban' | null) : boolean {
    if (member.id === member.guild.ownerId) return false;
    if (member.id === client.user.id) return false;
    if (client.user.id === member.guild.ownerId) return true;
    const everyone = member.guild.roles.get(member.guild.id)
    const role = member.guild.me.roles.map(item => member.guild.roles.get(item.id)).filter(xd => xd);
    role.push(everyone);
    const roleSort = role.sort((a, b) => b.position - a.position)[0];
    const memberRole = member.roles.map(item => member.guild.roles.get(item.id)).filter(xd => xd);
    memberRole.push(everyone)
    const memberRoleSort = memberRole.sort((a, b) => b.position - a.position)[0];
    return (roleSort.position > memberRoleSort.position) && (mod ? (member.guild.me.can(mod == 'kick' ? Flags.KICK_MEMBERS : Flags.BAN_MEMBERS)) : true);
}

export default canMod;

// function hasPermission(permisos : number, elpermiso : number) {
//     return ((permisos & elpermiso) == elpermiso)
// }
