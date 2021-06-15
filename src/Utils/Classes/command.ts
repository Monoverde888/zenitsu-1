import inte from '../Interfaces/run.js';
import * as Eris from '@lil_marcrock22/eris-light';
import Zenitsu from './client.js';

type permissions = 'createInstantInvite' |
    'kickMembers' |
    'banMembers' |
    'administrator' |
    'manageChannels' |
    'manageGuild' |
    'addReactions' |
    'viewAuditLog' |
    'viewAuditLogs' |
    'voicePrioritySpeaker' |
    'voiceStream' |
    'stream' |
    'viewChannel' |
    'readMessages' |
    'sendMessages' |
    'sendTTSMessages' |
    'manageMessages' |
    'embedLinks' |
    'attachFiles' |
    'readMessageHistory' |
    'mentionEveryone' |
    'useExternalEmojis' |
    'externalEmojis' |
    'viewGuildInsights' |
    'voiceConnect' |
    'voiceSpeak' |
    'voiceMuteMembers' |
    'voiceDeafenMembers' |
    'voiceMoveMembers' |
    'voiceUseVAD' |
    'changeNickname' |
    'manageNicknames' |
    'manageRoles' |
    'manageWebhooks' |
    'manageEmojis' |
    'useSlashCommands' |
    'voiceRequestToSpeak' |
    'allGuild' |
    'allText' |
    'allVoice' |
    'all';


class Command {

    dev: boolean
    alias: string[]
    name: string
    category: string
    botPermissions: {
        guild: permissions[]
        channel: permissions[]
    }
    cooldown: number
    memberPermissions: {
        guild: permissions[]
        channel: permissions[]
    }
    client: Zenitsu;

    constructor() {
        this.dev = false;
        this.alias = []
        this.name = 'NO_NAME_COMMAND'
        this.category = 'none'
        this.botPermissions = {
            guild: [],
            channel: []
        }
        this.cooldown = 4;
        this.memberPermissions = {
            guild: [],
            channel: []
        }
    }
    run(runthis: inte): unknown {
        return runthis;
    }

    init(bot: Zenitsu) {
        this.client = bot;
    }

    cantRun(message: Eris.Message<Eris.TextChannel | Eris.TextableChannel>): { case: number; perms: permissions[] } {

        const channel = message.channel as Eris.TextChannel;

        const check_1 = this.botPermissions.channel.filter(perm => !((channel).permissionsOf(message.guild.me).has(perm)))

        if (check_1.length) return { case: 1, perms: check_1 };

        const check_2 = this.memberPermissions.channel.filter(perm => !((channel).permissionsOf(message.member).has(perm)))

        if (check_2.length) return { case: 2, perms: check_2 };

        const check_3 = this.botPermissions.guild.filter(perm => !((channel).guild.me.permissions.has(perm)));

        if (check_3.length) return { case: 3, perms: check_3 };

        const check_4 = this.memberPermissions.guild.filter(perm => !(message.member.permissions.has(perm)));

        if (check_4.length) return { case: 4, perms: check_4 };

        return { case: 5, perms: [] };


    }

}

export default Command;
