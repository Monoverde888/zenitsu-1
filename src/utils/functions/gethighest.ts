import detritus from 'detritus-client';

function getHighest(member: detritus.Structures.Member): detritus.Structures.Role {

    const memberRole = member.roles.map(item => item && member.guild.roles.get(item.id)).filter(xd => xd);

    memberRole.push(member.guild.roles.get(member.guild.id));

    const memberRoleSort = memberRole.sort((a, b) => b.position - a.position)[0];

    return memberRoleSort;

}
export default getHighest;