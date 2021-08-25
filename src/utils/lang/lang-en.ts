const obj = {

    "permissions" : {
        CREATE_INSTANT_INVITE : 'createInstantInvite',
        KICK_MEMBERS : 'kickMembers',
        BAN_MEMBERS : 'banMembers',
        ADMINISTRATOR : 'administrator',
        MANAGE_CHANNELS : 'manageChannels',
        MANAGE_GUILD : 'manageGuild',
        ADD_REACTIONS : 'addReactions',
        VIEW_AUDIT_LOG : 'viewAuditLog',
        PRIORITY_SPEAKER : 'prioritySpeaker',
        STREAM : 'stream',
        VIEW_CHANNEL : 'viewChannel',
        SEND_MESSAGES : 'sendMessages',
        SEND_TTS_MESSAGES : 'sendTTSMessages',
        MANAGE_MESSAGES : 'manageMessages',
        EMBED_LINKS : 'embedLinks',
        ATTACH_FILES : 'attachFiles',
        READ_MESSAGE_HISTORY : 'readMessageHistory',
        MENTION_EVERYONE : 'mentionEveryone',
        USE_EXTERNAL_EMOJIS : 'useExternalEmojis',
        VIEW_GUILD_INSIGHTS : 'viewGuildInsights',
        CONNECT : 'connect',
        SPEAK : 'speak',
        MUTE_MEMBERS : 'muteMembers',
        DEAFEN_MEMBERS : 'deafenMembers',
        MOVE_MEMBERS : 'moveMembers',
        USE_VAD : 'useVad',
        CHANGE_NICKNAME : 'changeNickname',
        MANAGE_NICKNAMES : 'manageNicknames',
        MANAGE_ROLES : 'manageRoles',
        MANAGE_WEBHOOKS : 'manageWebhooks',
        MANAGE_EMOJIS : 'manageEmojis',
        MANAGE_THREADS : 'manageThreads',
        USE_PUBLIC_THREADS : 'usePublicThreads',
        USE_PRIVATE_THREADS : 'usePrivateThreads',
    },

    "messages" : {

        "ratelimit" : (remaining : number) => `Try after ${remaining / 1000} seconds.`,

        "permisos_bot" : (p : string) : string => "<:cancel:804368628861763664> | Oops, I am missing some permissions " + p,

        "permisos_user" : (p : string) : string => "<:cancel:804368628861763664> | Oops, You are missing some permissions " + p,

        "error" : (e : string) : string => "Something happened, here's a debug: " + e,

        "cooldown" : (time : string, command : string) : string => `Please wait ${time} before use \`${command}\``,

        use_slash : "Soon `Zenitsu.` will use `slash commands`, Discord's new command method, and that's why we need you to invite him again!"

    },
    "commands" : {

        "runcode" : {

            no_code : 'Missing code block.\n\n**Example**:\n\n\\`\\`\\`javascript\nthis.team = "poto";\nconsole.log(\\`Testing things with the ${this.team} team\\`)\n\\`\\`\\`',
            invalid_lang : 'Invalid language, check https://github.com/engineer-man/piston#supported-languages',
            no_output : 'Without output.',
            error : 'Unknow error...'

        },

        "connect4view" : {

            "invalid" : "Invalid ID."

        },

        "setprefix" : {
            "prefix_nice" : (mod : string, prefix : string) : string => "<:trustedAdmin:804368672520536104> | " + mod + " has established the prefix to: " + prefix,

            "prefix_error" : "<:cancel:804368628861763664> | Error setting the prefix."
        },
        "guilds" : {
            "message" : (guilds : number) : string => "I am currently on " + guilds + " servers."
        },
        "invite" : {
            "message" : (bot : string, support : string) : string => "Bot invitation link: [Link](" + bot + " \"Invite the bot\") 🤖\nSupport link: [Link](" + support + " \"You will receive help\") <:hmmmmmm:857685091789307914>"
        },
        "connect4" : {

            "surrender" : "Surrender.",

            "wait" : "Wait.",

            "curso" : "<:cancel:804368628861763664> | There is an ongoing game on this channel.",

            "mention" : "<:cancel:804368628861763664> | Mention a server member to play.",

            "footer" : "You can also play with Zenitsu putting /play connect4 bot easy/medium/hard",

            //"user_active": (user: string): string => user + " is active in another game.",

            //"author_active": "You are active in another game.",

            "wait_user" : (user : string) : string => "<a:waiting:804396292793040987> | " + user + ", you have 1 minute to answer...\nDo you want to play?: answer `✅`\nYou dont want?: answer `❌`",

            "dont_answer" : (user : string) : string => "😔 | " + user + " did not answer...",

            "deny" : (user : string) : string => "😔 | " + user + " rejected the invitation...",

            "start" : (user : string) : string => "Begin " + user + ", Choose a number from 1 to 7. [`🔴`]",

            "win" : (winner : string) : string => "<:uh:829390140832874506> | " + winner + " won the game!",

            "draw" : (p1 : string, p2 : string) : string => "<:wtdDud:829390621894508544> | A draw between " + p1 + " and " + p2 + ".",

            "turn" : (user : string, ficha : string) : string => "" + user + "'s turn [`" + ficha + "`]",

            "game_over" : "<:wtdDud:829390621894508544> | Game over...",

            "game_over2" : "<:wtdDud:829390621894508544> | Game over D:",

            "time_over" : "<a:baimefui:804368920361566268> | You lasted three minutes without answering, game over!",

        },
        "connect4stats" : {

            "no_data" : (user : string) : string => "<:cancel:804368628861763664> | No data about " + user + " yet.",

            "difficulties" : [
                "Easy",
                "Medium",
                "Hard"
            ],

            "states" : [
                "Wins",
                "Loses",
                "Draws"
            ]
        },
        "connect4top" : {
            "no_data" : (dif : string) : string => "<:cancel:804368628861763664> | There is still no data in " + dif + " difficulty",
            "states" : [
                "Wins",
                "Loses",
                "Draws"
            ]
        },
        "tictactoe" : {
            "curso" : "<:cancel:804368628861763664> | There is an ongoing game on this channel.",
            "wait_user" : (user : string) : string => "<a:waiting:804396292793040987> | " + user + ", you have 1 minute to answer...\nDo you want to play?: answer `✅`\nYou dont want?: answer `❌`",
            "dont_answer" : (user : string) : string => "😔 | " + user + " did not answer...",
            "deny" : (user : string) : string => "😔 | " + user + " rejected the invitation...",
            "win" : (user : string) : string => "<:uh:829390140832874506> | " + user + " win the game!",
            "draw" : (p1 : string, p2 : string) : string => "<:wtdDud:829390621894508544> | A draw between " + p1 + " and " + p2 + "!",
            "start" : (ficha : string, user : string) : string => ficha + " | Begin " + user + ", Choose a number from 1 to 9.",
            "game_over" : "<:wtdDud:829390621894508544> | Game over...",
            "rematch" : "Rematch"
        },
        "help" : {
            "categories" : [
                "Utils",
                "Fun",
                "Mod",
                "Bot",
                "Admin"
            ],
            invite : 'Invite Zenitsu.',
            support : 'Support server.'
        },
        "djs" : {
            "what" : "<a:CatLoad:804368444526297109> | What do you want to look for in the Discord.js documentation?",
            "no_result" : "<:cancel:804368628861763664> | No results.",
            "query" : "query"
        },
        "setlogs" : {
            invalid : `Incorrect use, please provide a valid webhook.`,
            correct : (webhook : string, type : string) : string => `Now the webhook **${webhook}** is active in the **${type}** event.`
        },
        "ban" : {
            cannt_ban : (user : string) : string => `<:cancel:804368628861763664> | **I can't** ban ${user}`,
            user_cannt_ban : (user : string) : string => `<:cancel:804368628861763664> | **You can't** ban ${user}`,
            ban : (user : string, reason : string) : string => `<:ban:804368686130397215> | **${user}** was banned${reason ? `, with the reason: ${reason}` : `.`}`
        },
        "kick" : {
            cannt_kick : (user : string) : string => `<:cancel:804368628861763664> | **I can't** kick ${user}`,
            user_cannt_kick : (user : string) : string => `<:cancel:804368628861763664> | **You can't** kick ${user}`,
            kick : (user : string, reason : string) : string => `<:ban:804368686130397215> | **${user}** was kicked${reason ? `, with the reason: ${reason}` : `.`}`
        },
        "profile" : {
            flags : 'Flags',
            achievements : 'Achievements'
        },
        "editprofile" : {
            invalid : `Invalid use.`,
            new_color : `<-- New color.`,
            description_invalid : (prefix : string) : string => `Invalid use.\nCorrect use: **${prefix}editprofile description New description**`,
            description_nice : (prefix : string) : string => `Now use ${prefix}profile to view your description.`,
            invalid_url : 'Invalid URL.',
            new_background : 'New background.'
        },
        "mute" : {
            no_role : (prefix : string) : string => `Use **${prefix}settings muterole init** before using this command.`,
            cant_role : (role : string) : string => `I can't manage the role **${role}**.`,
            already_muted : (member : string) : string => `**${member}** is already muted.`,
            user_cannt_mute : (user : string) : string => `<:cancel:804368628861763664> | **You can't** mute ${user}`,
            mute : (user : string) : string => `<:MUTE:807729858649391105> | **${user}** was muted.`
        },
        "unmute" : {
            no_role : (prefix : string) : string => `Use **${prefix}settings muterole init** before using this command.`,
            cant_role : (role : string) : string => `I can't manage the role **${role}**.`,
            already_unmuted : (member : string) : string => `**${member}** is already unmuted.`,
            user_cannt_unmute : (user : string) : string => `<:cancel:804368628861763664> | **You can't** unmute ${user}`,
            unmute : (user : string) : string => `<:UNMUTE:807729857693876224> | **${user}** was unmuted.`
        },
        "settings" : {
            cooldown : 'I am doing another process.',
            muterole : {
                init : {
                    use_refresh : (prefix : string) : string => `Use \`${prefix}settings muterole refresh\` to **refresh all the channels**.`,
                    cannt_edit : (role : string) : string => `I can't edit ${role}.`,
                    editando : `Editing channels.`,
                    success : `The channels were edited`,
                    else : `It seems that I do not have all the necessary permissions.`
                },
                refresh : {
                    use_init : (prefix : string) : string => `Use \`${prefix}settings muterole init @Role\`.`,
                    cannt_edit : (role : string) : string => `I can't edit ${role}.`,
                    already : `All channels were already configured.`,
                    editando : `Editing channels.`,
                    success : `The channels were edited`,
                    else : `It seems that I do not have all the necessary permissions.`
                },
            },
            reset : {
                message : 'Erased configuration.'
            },
            ignorechannels : {
                remove : (canal : string) => `Removed ${canal}.`,
                add : (canal : string) => `Added ${canal}.`
            },
        }
    }
}

export default obj;
