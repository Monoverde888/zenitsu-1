const obj = {
    "messages": {
        "afk_volver": "<:sesonroja:804750422828515339> | ¡Bienvenido de vuelta!",

        "permisos_bot_guild": (p: string): string => "<:cancel:804368628861763664> | Ups, me faltan algun/algunos permiso(s) en el servidor: " + p,

        "permisos_bot_channel": (p: string): string => "<:cancel:804368628861763664> | Ups, me faltan algun/algunos permiso(s) en el canal: " + p,

        "permisos_user_guild": (p: string): string => "<:cancel:804368628861763664> | Ups, te faltan algun/algunos permiso(s) en el servidor: " + p,

        "permisos_user_channel": (p: string): string => "<:cancel:804368628861763664> | Ups, te faltan algun/algunos permiso(s) en el canal: " + p,

        "error": (e: string): string => "Algo pasó, aquí un mensaje: " + e,

        "cooldown": (time: string, command: string): string => `Por favor espera ${time} antes de usar \`${command}\``,

    },
    "commands": {
        "lockchannel": {
            "on_block": (mod: string): string => "<:moderator:804368587115593800> | " + mod + " ha bloqueado el canal para los miembros.",

            "on_block_error": "<:cancel:804368628861763664> | Error al intentar bloquear el canal.",

            "on_unblock": (mod: string): string => "<:moderator:804368587115593800> | " + mod + " ha desbloqueado el canal para los miembros.",

            "on_unblock_error": "<:cancel:804368628861763664> | Error al intentar desbloquear el canal.",

        },
        "setprefix": {
            "no_prefix": "<:cancel:804368628861763664> | Necesitas especificar el prefijo nuevo.",

            "prefix_length": "<:cancel:804368628861763664> | El prefijo debe tener menos de 3 caracteres.",

            "prefix_nice": (mod: string, prefix: string): string => "<:trustedAdmin:804368672520536104> | " + mod + " ha establecido el prefijo a: " + prefix,

            "prefix_error": "<:cancel:804368628861763664> | Error al establecer el prefijo.",

        },
        "setlang": {
            "invalid": "<:cancel:804368628861763664> | Uso incorrecto del comando.",

        },
        "guilds": {
            "message": (guilds: number): string => "Actualmente estoy en " + guilds + " servidores.",
        },
        "invite": {
            "message": (bot: string, support: string): string => "Link de invitación del bot: [Link](" + bot + " \"Invitaras al bot\")🤖\nLink de invitación al servidor de soporte: [Link](" + support + " \"Recibirás ayuda\")<:zStaffZenitsu:766436216966217729>",
        },
        "reportbug": {
            "need": "<:cancel:804368628861763664> | Necesitas especificar el error.",

            "send": "📢 | Reporte enviado!",

        },
        "suggest": {
            "need": "<:cancel:804368628861763664> | Necesitas especificar la sugerencia.",

            "send": "<:reason2:804368699887845376> | Sugerencia enviado!",

        },
        "connect4": {
            "curso": "<:cancel:804368628861763664> | Hay una partida en curso en este servidor.",

            "mention": "<:cancel:804368628861763664> | Menciona a un miembro del servidor para jugar.",

            "footer": "Tambien puedes jugar con Zenitsu poniendo z!connect4 easy/medium/hard",

            "user_active": (user: string): string => user + " está activo en otra partida.",

            "author_active": "Estas activo en otra partida.",

            "wait_user": (user: string): string => "<a:waiting:804396292793040987> | " + user + ", tienes un minuto para responder...\n¿Quieres jugar?: responde `s`\n¿No quieres jugar?: responde `n`",

            "dont_answer": (user: string): string => "😔 | " + user + " no respondió...",

            "deny": (user: string): string => "😔 | " + user + " rechazó la invitación...",

            "start": (user: string): string => "Empieza " + user + ", elige un numero del 1 al 7. [`🔴`]",

            "win": (winner: string): string => "<:uh:829390140832874506> | " + winner + " ha ganado la partida!",

            "draw": (p1: string, p2: string): string => "<:wtdDud:829390621894508544> | Un empate entre " + p1 + " y " + p2 + ".",

            "turn": (user: string, ficha: string): string => "Turno de " + user + " [`" + ficha + "`]",

            "game_over": "<:wtdDud:829390621894508544> | Juego terminado...",

            "game_over2": "<:wtdDud:829390621894508544> | Juego terminado D:",

            "time_over": "<:dislike1:369553357377110027> | Duraste tres minutos sin responder, juego terminado!",

        },
        "connect4stats": {
            "no_data": (user: string): string => "<:cancel:804368628861763664> | Sin datos sobre " + user + " aún.",

            "difficulties": [
                "Fácil",
                "Normal",
                "Difícil"
            ],


            "states": [
                "Ganadas",
                "Perdidas",
                "Empates"
            ],

        },
        "connect4top": {
            "no_data": (dif: string): string => "<:cancel:804368628861763664> | Aún no hay datos en la dificultad " + dif,

            "states": [
                "Ganadas",
                "Perdidas",
                "Empates"
            ],


        },
        "tictactoe": {
            "game": "<:cancel:804368628861763664> | Menciona a un miembro del servidor para jugar.",

            "curso": "<:cancel:804368628861763664> | Hay una partida en curso en este servidor.",

            "wait_user": (user: string): string => "<a:waiting:804396292793040987> | " + user + ", tienes un minuto para responder...\n¿Quieres jugar?: responde `s`\n¿No quieres jugar?: responde `n`",

            "dont_answer": (user: string): string => "😔 | " + user + " no respondió...",

            "deny": (user: string): string => "😔 | " + user + " rechazó la invitación...",

            "win": (user: string): string => "<:uh:829390140832874506> | ¡" + user + " ha ganado la partida!",

            "draw": (p1: string, p2: string): string => "<:wtdDud:829390621894508544> | Un empate entre " + p1 + " y " + p2 + "!",

            "turn": (user: string): string => "Turno de " + user,

            "start": (ficha: string, user: string): string => ficha + " | Empieza " + user + ", elige un numero del 1 al 9.",

            "game_over": "<:wtdDud:829390621894508544> | Juego terminado...",

        },
        "help": {
            "categories": [
                "Utiles",
                "Diversión",
                "Moderación",
                "Bot",
                "Administración"
            ],


        },
        "djs": {
            "what": "<a:CatLoad:804368444526297109> | ¿Que quieres buscar en la documentación de discord.js?",

            "no_result": "<:cancel:804368628861763664> | Sin resultados.",

        },
        "afk": {
            "reason": "<:cancel:804368628861763664> | La razón debe tener menos de 250 caracteres.",
        },
        "setlogs": {
            invalid: `Uso incorrecto, por favor ingresa una webhook valida y tipo.`,
            correct: (webhook: string, type: string): string => `Ahora la webhook **${webhook}** está registrando el evento **${type}**.`
        },
        "ban": {
            mention: `<:cancel:804368628861763664> | Menciona a un miembro.`,
            cannt_ban: (user: string): string => `<:cancel:804368628861763664> | **No puedo** vetar a ${user}`,
            user_cannt_ban: (user: string): string => `<:cancel:804368628861763664> | **No puedes** vetar a ${user}`,
            ban: (user: string, reason: string): string => `<:ban:804368686130397215> | **${user}** ha sido vetado${reason ? `, con la razón: ${reason}` : `.`}`
        },
        "kick": {
            mention: `<:cancel:804368628861763664> | Menciona a un miembro.`,
            cannt_kick: (user: string): string => `<:cancel:804368628861763664> | **No puedo** expulsar a ${user}`,
            user_cannt_kick: (user: string): string => `<:cancel:804368628861763664> | **No puedes** expulsar a ${user}`,
            kick: (user: string, reason: string): string => `<:ban:804368686130397215> | **${user}** ha sido expulsado${reason ? `, con la razón: ${reason}` : `.`}`
        },
        "discordstatus": {
            message: `<a:CatLoad:804368444526297109> | Espere un momento...`
        }
    }
}

export default obj;