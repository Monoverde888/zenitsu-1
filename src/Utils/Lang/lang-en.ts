const obj = {
  "messages": {

    "permisos_bot_guild": (p: string): string => "<:cancel:804368628861763664> | Oops, I am missing some permissions on the guild: " + p,

    "permisos_bot_channel": (p: string): string => "<:cancel:804368628861763664> | Oops, I am missing some permissions on the channel: " + p,

    "permisos_user_guild": (p: string): string => "<:cancel:804368628861763664> | Oops, You are missing some permissions on the guild: " + p,

    "permisos_user_channel": (p: string): string => "<:cancel:804368628861763664> | Oops, You are missing some permissions on the channel: " + p,

    "error": (e: string): string => "Something happened, here's a debug: " + e,

    "cooldown": (time: string, command: string): string => `Please wait ${time} before use \`${command}\``,

    "abuz": 'You were too fast, now you\'ll have to wait a minute :).',

  },
  "commands": {

    "connect4view": {

      "invalid": "Invalid ID."

    },

    "setprefix": {

      "no_prefix": "<:cancel:804368628861763664> | You need to specify the new prefix.",

      "prefix_length": "<:cancel:804368628861763664> | The prefix must have less than 3 characters.",

      "prefix_nice": (mod: string, prefix: string): string => "<:trustedAdmin:804368672520536104> | " + mod + " has established the prefix to: " + prefix,

      "prefix_error": "<:cancel:804368628861763664> | Error setting the prefix."
    },
    "setlang": {

      "invalid": "<:cancel:804368628861763664> | Incorrect use of the command."
    },
    "guilds": {
      "message": (guilds: number): string => "I am currently on " + guilds + " servers."
    },
    "invite": {
      "message": (bot: string, support: string): string => "Bot invitation link: [Link](" + bot + " \"Invite the bot\")🤖\nSupport link: [Link](" + support + " \"You will receive help\")<:zStaffZenitsu:766436216966217729>"
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

      "user_active": (user: string): string => user + " is active in another game.",

      "author_active": "You are active in another game.",

      "wait_user": (user: string): string => "<a:waiting:804396292793040987> | " + user + ", you have 1 minute to answer...\nDo you want to play?: answer `s`\nYou dont want?: answer `n`",

      "dont_answer": (user: string): string => "😔 | " + user + " did not answer...",

      "deny": (user: string): string => "😔 | " + user + " rejected the invitation...",

      "start": (user: string): string => "Begin " + user + ", Choose a number from 1 to 7. [`🔴`]",

      "win": (winner: string): string => "<:uh:829390140832874506> | " + winner + " won the game!",

      "draw": (p1: string, p2: string): string => "<:wtdDud:829390621894508544> | A draw between " + p1 + " and " + p2 + ".",

      "turn": (user: string, ficha: string): string => "" + user + "'s turn [`" + ficha + "`]",

      "game_over": "<:wtdDud:829390621894508544> | Game over...",

      "game_over2": "<:wtdDud:829390621894508544> | Game over D:",

      "time_over": "<:dislike1:369553357377110027> | You lasted three minutes without answering, game over!",

      "save": "Save game?"

    },
    "connect4stats": {

      "no_data": (user: string): string => "<:cancel:804368628861763664> | No data about " + user + " yet.",

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
      "no_data": (dif: string): string => "<:cancel:804368628861763664> | There is still no data in " + dif + " difficulty",
      "states": [
        "Wins",
        "Loses",
        "Draws"
      ]
    },
    "tictactoe": {
      "game": "<:cancel:804368628861763664> | Mention a server member to play.",
      "curso": "<:cancel:804368628861763664> | There is an ongoing game on this server.",
      "wait_user": (user: string): string => "<a:waiting:804396292793040987> | " + user + ", you have 1 minute to answer...\nDo you want to play?: answer `s`\nYou dont want?: answer `n`",
      "dont_answer": (user: string): string => "😔 | " + user + " did not answer...",
      "deny": (user: string): string => "😔 | " + user + " rejected the invitation...",
      "win": (user: string): string => "<:uh:829390140832874506> | " + user + " win the game!",
      "draw": (p1: string, p2: string): string => "<:wtdDud:829390621894508544> | A draw between " + p1 + " and " + p2 + "!",
      "start": (ficha: string, user: string): string => ficha + " | Begin " + user + ", Choose a number from 1 to 9.",
      "game_over": "<:wtdDud:829390621894508544> | Game over...",
      "rematch": "Rematch"
    },
    "help": {
      "categories": [
        "Utils",
        "Fun",
        "Mod",
        "Bot",
        "Admin"
      ],
      invite: 'Invite Zenitsu.',
      support: 'Support server.'
    },
    "djs": {
      "what": "<a:CatLoad:804368444526297109> | What do you want to look for in the Discord.js documentation?",
      "no_result": "<:cancel:804368628861763664> | No results."
    },
    "setlogs": {
      invalid: `Incorrect use, please provide a valid webhook and type.`,
      correct: (webhook: string, type: string): string => `Now the webhook **${webhook}** is active in the **${type}** event.`
    },
    "ban": {
      mention: `<:cancel:804368628861763664> | Mention a member.`,
      cannt_ban: (user: string): string => `<:cancel:804368628861763664> | **I can't** ban ${user}`,
      user_cannt_ban: (user: string): string => `<:cancel:804368628861763664> | **You can't** ban ${user}`,
      ban: (user: string, reason: string): string => `<:ban:804368686130397215> | **${user}** was banned${reason ? `, with the reason: ${reason}` : `.`}`
    },
    "kick": {
      mention: `<:cancel:804368628861763664> | Mention a member.`,
      cannt_kick: (user: string): string => `<:cancel:804368628861763664> | **I can't** kick ${user}`,
      user_cannt_kick: (user: string): string => `<:cancel:804368628861763664> | **You can't** kick ${user}`,
      kick: (user: string, reason: string): string => `<:ban:804368686130397215> | **${user}** was kicked${reason ? `, with the reason: ${reason}` : `.`}`
    },
    "discordstatus": {
      message: `<a:CatLoad:804368444526297109> | Wait a moment...`
    },
    "profile": {
      flags: 'Flags',
      achievements: 'Achievements'
    },
    "editprofile": {
      bad_usage: (prefix: string): string => `Usage: ${prefix || 'z!'}editprofile <(color|description)> <value>`,
      invalid: `Invalid use.`,
      new_color: `<-- New color.`,
      description_invalid: (prefix: string): string => `Invalid use.\nCorrect use: **${prefix || 'z!'}editprofile description New description**`,
      description_nice: (prefix: string): string => `Now use ${prefix || 'z!'}profile to view your description.`
    },
    "mute": {
      no_role: (prefix: string): string => `Use **${prefix || 'z!'}settings muterole init** before using this command.`,
      cant_role: (role: string): string => `I can't manage the role **${role}**.`,
      already_muted: (member: string): string => `**${member}** is already muted.`,
      mention: `<:cancel:804368628861763664> | Mention a member.`,
      user_cannt_mute: (user: string): string => `<:cancel:804368628861763664> | **You can't** mute ${user}`,
      mute: (user: string): string => `<:MUTE:807729858649391105> | **${user}** was muted.`
    },
    "unmute": {
      no_role: (prefix: string): string => `Use **${prefix || 'z!'}settings muterole init** before using this command.`,
      cant_role: (role: string): string => `I can't manage the role **${role}**.`,
      already_unmuted: (member: string): string => `**${member}** is already unmuted.`,
      mention: `<:cancel:804368628861763664> | Mention a member.`,
      user_cannt_unmute: (user: string): string => `<:cancel:804368628861763664> | **You can't** unmute ${user}`,
      unmute: (user: string): string => `<:UNMUTE:807729857693876224> | **${user}** was unmuted.`
    },
    "settings": {
      cooldown: 'I am doing another process.',
      muterole: {
        init: {
          use_refresh: (prefix: string): string => `Use \`${prefix}settings muterole refresh\` to **refresh all the channels**.`,
          cannt_edit: (role: string): string => `I can't edit ${role}.`,
          editando: `Editing channels.`,
          success: `The channels were edited`,
          else: `It seems that I do not have all the necessary permissions.`
        },
        refresh: {
          use_init: (prefix: string): string => `Use \`${prefix}settings muterole init @Role\`.`,
          cannt_edit: (role: string): string => `I can't edit ${role}.`,
          already: `All channels were already configured.`,
          editando: `Editing channels.`,
          success: `The channels were edited`,
          else: `It seems that I do not have all the necessary permissions.`
        },
      },
      reset: {
        message: 'Erased configuration.'
      }
    }
  }
}

export default obj;
