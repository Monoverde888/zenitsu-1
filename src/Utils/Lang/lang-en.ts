const obj = {
    "messages": {

        "afk_volver": "<:sesonroja:804750422828515339> | Welcome back!",

        "permisos_bot_guild": (p: string) => "<:cancel:804368628861763664> | Oops, I am missing some permissions on the guild: " + p,

        "permisos_bot_channel": (p: string) => "<:cancel:804368628861763664> | Oops, I am missing some permissions on the channel: " + p,

        "permisos_user_guild": (p: string) => "<:cancel:804368628861763664> | Oops, You are missing some permissions on the guild: " + p,

        "permisos_user_channel": (p: string) => "<:cancel:804368628861763664> | Oops, You are missing some permissions on the channel: " + p,

        "error": (e: string) => "Something happened, here's a debug: " + e,

        "cooldown": (time: string, command: string) => `Please wait ${time} before use \`${command}\``
    },
    "music": {

        "music_request": "Join to a voice channel and request a song.",

        "no_queue": "No queue.",

        "read_topic": "Read the topic of the channel to get instructions.",

        "nowplaying": (duration: string | number, name: string) => `${duration} Now playing: ${name}`,

        "queue": (text: string) => "Queue:\n" + text,
        "queue_modes": [
            "None",
            "Song",
            "Queue"
        ],

        "live": "Live",

        "loop_mode": "Loop mode",

        "songs_in_queue": "Songs in queue",

        "autoplay": "Autoplay",

        "yes": "Yes",

        "no": "No"
    },
    "commands": {
        "lockchannel": {
            "on_block": (mod: string) => "<:moderator:804368587115593800> | " + mod + " has blocked the channel for members.",

            "on_block_error": "<:cancel:804368628861763664> | Error trying to block the channel.",

            "on_unblock": (mod: string) => "<:moderator:804368587115593800> | " + mod + " has unblocked the channel for members.",

            "on_unblock_error": "<:cancel:804368628861763664> | Error trying to unblock the channel."
        },
        "setprefix": {

            "no_prefix": "<:cancel:804368628861763664> | You need to specify the new prefix.",

            "prefix_length": "<:cancel:804368628861763664> | The prefix must have less than 3 characters.",

            "prefix_nice": (mod: string, prefix: string) => "<:trustedAdmin:804368672520536104> | " + mod + " has established the prefix to: " + prefix,

            "prefix_error": "<:cancel:804368628861763664> | Error setting the prefix."
        },
        "setlang": {

            "invalid": "<:cancel:804368628861763664> | Incorrect use of the command."
        },
        "guilds": {
            "message": (guilds: number) => "I am currently on " + guilds + " servers."
        },
        "invite": {
            "message": (bot: string, support: string) => "Bot invitation link: [Link]({LINK} \"Invite the bot\")🤖\nSupport link: [Link]({SUPPORT_LINK} \"You will receive help\")<:zStaffZenitsu:766436216966217729>"
        },
        "reportbug": {

            "need": "<:cancel:804368628861763664> | You need to specify the error.",

            "send": "📢 | Report sent!"
        },
        "suggest": {

            "need": "<:cancel:804368628861763664> | You need to specify the suggestion.",

            "send": "<:reason2:804368699887845376> | Suggestion sent!"
        },
        "connect4": {

            "curso": "<:cancel:804368628861763664> | There is an ongoing game on this server.",

            "mention": "<:cancel:804368628861763664> | Mention a server member to play.",

            "footer": "You can also play with Zenitsu putting z!connect4 easy/medium/hard",

            "user_active": (user: string) => user + " is active in another game.",

            "author_active": "You are active in another game.",

            "wait_user": (user: string) => "<a:waiting:804396292793040987> | " + user + ", you have 1 minute to answer...\nDo you want to play?: answer `s`\nYou dont want?: answer `n`",

            "dont_answer": (user: string) => "😔 | " + user + " did not answer...",

            "deny": (user: string) => "😔 | " + user + " rejected the invitation...",

            "start": (user: string) => "Begin " + user + ", Choose a number from 1 to 7. [`🔴`]",

            "win": (winner: string) => "<:uh:829390140832874506> | " + winner + " won the game!",

            "draw": (p1: string, p2: string) => "<:wtdDud:829390621894508544> | A draw between " + p1 + " and " + p2 + ".",

            "turn": (user: string, ficha: string) => "" + user + "'s turn [`" + ficha + "`]",

            "game_over": "<:wtdDud:829390621894508544> | Game over...",

            "game_over2": "<:wtdDud:829390621894508544> | Game over D:",

            "time_over": "<:dislike1:369553357377110027> | You lasted three minutes without answering, game over! -"
        },
        "connect4stats": {

            "no_data": (user: string) => "<:cancel:804368628861763664> | No data about " + user + " yet.",

            "difficulties": [
                "Easy",
                "Medium",
                "Hard"
            ],

            "states": [
                "Wins",
                "Loses",
                "Draws"
            ]
        },
        "connect4top": {
            "no_data": (dif: string) => "<:cancel:804368628861763664> | There is still no data in " + dif + " difficulty",
            "states": [
                "Wins",
                "Loses",
                "Draws"
            ]
        },
        "tictactoe": {
            "game": "<:cancel:804368628861763664> | Mention a server member to play.",
            "curso": "<:cancel:804368628861763664> | There is an ongoing game on this server.",
            "wait_user": (user: string) => "<a:waiting:804396292793040987> | " + user + ", you have 1 minute to answer...\nDo you want to play?: answer `s`\nYou dont want?: answer `n`",
            "dont_answer": (user: string) => "😔 | " + user + " did not answer...",
            "deny": (user: string) => "😔 | " + user + " rejected the invitation...",
            "win": (user: string) => "<:uh:829390140832874506> | " + user + " win the game!",
            "draw": (p1: string, p2: string) => "<:wtdDud:829390621894508544> | A draw between " + p1 + " and " + p2 + "!",
            "turn": (user: string) => user + "'s turn",
            "start": (ficha: string, user: string) => ficha + " | Begin " + user + ", Choose a number from 1 to 9.",
            "game_over": "<:wtdDud:829390621894508544> | Game over..."
        },
        "help": {
            "categories": [
                "Utils",
                "Fun",
                "Mod",
                "Bot",
                "Admin"
            ]
        },
        "djs": {
            "what": "<a:CatLoad:804368444526297109> | What do you want to look for in the Discord.js documentation?",
            "no_result": "<:cancel:804368628861763664> | No results."
        },
        "afk": {
            "reason": "<:cancel:804368628861763664> | The reason must have less than 250 characters."
        },
        "setlogs": {
            invalid: `Incorrect use, please provide a valid webhook and type.`,
            correct: (webhook: string, type: string) => `Now the webhook **${webhook}** is active in the **${type}** event.`
        }
    }
}

export default obj;