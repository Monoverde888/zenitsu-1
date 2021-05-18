import light from 'eris-pluris';

function getHighest(member: light.Member): light.Role {

    const memberRole = Array.from(member.roleList).map(e => e[1]);

    memberRole.push(member.guild.roles.get(member.guild.id))

    const memberRoleSort = memberRole.sort((a, b) => b.position - a.position)[0];

    return memberRoleSort

}
export default getHighest;