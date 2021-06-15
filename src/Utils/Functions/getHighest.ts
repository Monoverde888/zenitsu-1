import * as light from '@lil_marcrock22/eris-light';

function getHighest(member: light.Member): light.Role {

    const memberRole = member.roles.map(item => member.guild.roles.get(item)).filter(xd => xd);

    memberRole.push(member.guild.roles.get(member.guild.id));

    const memberRoleSort = memberRole.sort((a, b) => b.position - a.position)[0];

    return memberRoleSort;

}
export default getHighest;
