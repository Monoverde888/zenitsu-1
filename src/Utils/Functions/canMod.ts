import eris from '@lil_marcrock22/eris-light';
import Zenitsu from '../Classes/client.js';

function canMod(member: eris.Member, client: Zenitsu, mod: 'kick' | 'ban' | null): boolean {
    if (member.id === member.guild.ownerID) return false;
    if (member.id === client.user.id) return false;
    if (client.user.id === member.guild.ownerID) return true;
    const everyone = member.guild.roles.get(member.guild.id)
    const role = member.guild.me.roles.map(item => member.guild.roles.get(item)).filter(xd => xd);
    role.push(everyone);
    const roleSort = role.sort((a, b) => b.position - a.position)[0];
    const memberRole = member.roles.map(item => member.guild.roles.get(item)).filter(xd => xd);
    memberRole.push(everyone)
    const memberRoleSort = memberRole.sort((a, b) => b.position - a.position)[0];
    return (roleSort.position > memberRoleSort.position) && (mod ? member.guild.me.permissions.has(mod == 'kick' ? 'kickMembers' : 'banMembers') : true);
}

export default canMod;