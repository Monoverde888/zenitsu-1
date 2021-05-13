import eris from 'eris-pluris';
import Zenitsu from '../Classes/client.js';

function canMod(member: eris.Member, client: Zenitsu, mod: 'kick' | 'ban'): boolean {
    if (member.user.id === member.guild.ownerID) return false;
    if (member.user.id === client.user.id) return false;
    if (client.user.id === member.guild.ownerID) return true;
    const everyone = member.guild.roles.get(member.guild.id)
    const role = Array.from(member.guild.members.get(client.user.id).roleList).map(e => e[1]);
    role.push(everyone);
    const roleSort = role.sort((a, b) => b.position - a.position)[0];
    const memberRole = Array.from(member.roleList).map(e => e[1]);
    role.push(everyone)
    const memberRoleSort = memberRole.sort((a, b) => b.position - a.position)[0];
    return (roleSort.position > memberRoleSort.position) && member.guild.members.get(client.user.id).permissions.has(mod == 'kick' ? 'kickMembers' : 'banMembers');
}

export default canMod;