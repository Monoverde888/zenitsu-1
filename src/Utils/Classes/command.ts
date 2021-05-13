import inte from '../Interfaces/run.js';

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

}

export default Command;