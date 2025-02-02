export const Color = 14720566;
import { Permissions } from 'detritus-client/lib/constants.js';

export const IDS = {
    ACHIEVEMENTS: {
        C4LEVEL1: '1',
        C4LEVEL2: '2',
        C4LEVEL3: '3',
        C4LEVEL4: '4',
        C4LEVEL5: '11'
    },
    FLAGS: {
        BUG_HUNTER: '5',
        BOOSTER: '6',
        SUGGEST: '7',
        STAFF: '8',
        HELPER: '9',
        GITHUB: '10',
    }
};

export const PermissionsText = Object.freeze({
    [String(Permissions.ADD_REACTIONS)]: 'Add Reactions',
    [String(Permissions.ADMINISTRATOR)]: 'Administrator',
    [String(Permissions.ATTACH_FILES)]: 'Attach Files',
    [String(Permissions.BAN_MEMBERS)]: 'Ban Members',
    [String(Permissions.CHANGE_NICKNAME)]: 'Change Nickname',
    [String(Permissions.CHANGE_NICKNAMES)]: 'Change Nicknames',
    [String(Permissions.CONNECT)]: 'Connect',
    [String(Permissions.CREATE_INSTANT_INVITE)]: 'Create Instant Invite',
    [String(Permissions.DEAFEN_MEMBERS)]: 'Deafen Members',
    [String(Permissions.EMBED_LINKS)]: 'Embed Links',
    [String(Permissions.KICK_MEMBERS)]: 'Kick Members',
    [String(Permissions.MANAGE_CHANNELS)]: 'Manage Channels',
    [String(Permissions.MANAGE_EMOJIS)]: 'Manage Emojis',
    [String(Permissions.MANAGE_GUILD)]: 'Manage Guild',
    [String(Permissions.MANAGE_MESSAGES)]: 'Manage Messages',
    [String(Permissions.MANAGE_ROLES)]: 'Manage Roles',
    [String(Permissions.MANAGE_THREADS)]: 'Manage Threads',
    [String(Permissions.MANAGE_WEBHOOKS)]: 'Manage Webhooks',
    [String(Permissions.MENTION_EVERYONE)]: 'Mention Everyone',
    [String(Permissions.MOVE_MEMBERS)]: 'Move Members',
    [String(Permissions.MUTE_MEMBERS)]: 'Mute Members',
    [String(Permissions.NONE)]: 'None',
    [String(Permissions.PRIORITY_SPEAKER)]: 'Priority Speaker',
    [String(Permissions.READ_MESSAGE_HISTORY)]: 'Read Message History',
    [String(Permissions.REQUEST_TO_SPEAK)]: 'Request To Speak',
    [String(Permissions.SEND_MESSAGES)]: 'Send Messages',
    [String(Permissions.SEND_TTS_MESSAGES)]: 'Text-To-Speech',
    [String(Permissions.SPEAK)]: 'Speak',
    [String(Permissions.STREAM)]: 'Go Live',
    [String(Permissions.USE_APPLICATION_COMMANDS)]: 'Use Application Commands',
    [String(Permissions.USE_EXTERNAL_EMOJIS)]: 'Use External Emojis',
    [String(Permissions.USE_PRIVATE_THREADS)]: 'Use Private Threads',
    [String(Permissions.USE_PUBLIC_THREADS)]: 'Use Public Threads',
    [String(Permissions.USE_VAD)]: 'Voice Auto Detect',
    [String(Permissions.VIEW_AUDIT_LOG)]: 'View Audit Logs',
    [String(Permissions.VIEW_CHANNEL)]: 'View Channel',
    [String(Permissions.VIEW_GUILD_ANALYTICS)]: 'View Guild Analytics',
});