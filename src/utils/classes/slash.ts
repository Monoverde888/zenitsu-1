import detritus          from "detritus-client";
import {PermissionsText} from "../const.js";
import getGuild          from "../../utils/functions/getguild.js";
import json              from "../../utils/lang/langs.js";

export class BaseSlash<ParsedArgsFinished = detritus.Slash.ParsedArgs> extends detritus.Slash.SlashCommand<ParsedArgsFinished> {
    constructor(options : detritus.Slash.SlashCommandOptions = {}) {
        super(options);

        this.onError = (ctx, error) => {
            console.error(error);
            return ctx.editOrRespond(
                "```" + (error ? error.message || error : "ERROR") + "```"
            );
        };

        this.onRunError = (ctx, _, error) => {
            console.error(error);
            return ctx.editOrRespond(
                "```" + (error ? error.message || error : "ERROR") + "```"
            );
        };

        this.onCancelRun = ((ctx) => {
            return ctx.editOrRespond(
                "```" + ctx.command.metadata.usage("/").join("\n") + "```"
            );
        });

        this.onPermissionsFail = async (ctx, failed) => {
            const permissions : Array<string> = [];
            for (let permission of failed) {
                const key = String(permission);
                if (key in PermissionsText) {
                    permissions.push(`\`${PermissionsText[key]}\``);
                }
                else {
                    permissions.push(`\`${permission}?¿\``);
                }
            }

            const {lang} = await getGuild(ctx.guildId);
            const langjson = json[lang];
            return ctx.editOrRespond(langjson.messages.permisos_user(permissions.join(', ')));

        };

        this.onPermissionsFailClient = async (ctx, failed) => {

            const permissions : Array<string> = [];
            for (let permission of failed) {
                const key = String(permission);
                if (key in PermissionsText) {
                    permissions.push(`\`${PermissionsText[key]}\``);
                }
                else {
                    permissions.push(`\`${permission}?¿\``);
                }
            }

            const {lang} = await getGuild(ctx.guildId);
            const langjson = json[lang];
            return ctx.editOrRespond(langjson.messages.permisos_bot(permissions.join(', ')));

        };

    }
}

export class BaseCommandOption<ParsedArgsFinished = detritus.Slash.ParsedArgs> extends detritus.Slash.SlashCommandOption<ParsedArgsFinished> {
    type = detritus.Constants.ApplicationCommandOptionTypes.SUB_COMMAND;

    constructor(options : detritus.Slash.SlashCommandOptions = {}) {
        super(options);

        this.onError = (ctx, error) => {
            console.error(error);
            return ctx.editOrRespond(
                "```" + (error ? error.message || error : "ERROR") + "```"
            );
        };

        this.onRunError = (ctx, args, error) => {
            console.error(error);
            console.error(args);
            return ctx.editOrRespond(
                "```" + (error ? error.message || error : "ERROR") + "```"
            );
        };

        this.onCancelRun = ((ctx) => {
            return ctx.editOrRespond(
                "```" + ctx.command.metadata.usage("/").join("\n") + "```"
            );
        });

        this.onPermissionsFail = async (ctx, failed) => {
            const permissions : Array<string> = [];
            for (let permission of failed) {
                const key = String(permission);
                if (key in PermissionsText) {
                    permissions.push(`\`${PermissionsText[key]}\``);
                }
                else {
                    permissions.push(`\`${permission}?¿\``);
                }
            }

            const {lang} = await getGuild(ctx.guildId);
            const langjson = json[lang];
            return ctx.editOrRespond(langjson.messages.permisos_user(permissions.join(', ')));

        };

        this.onPermissionsFailClient = async (ctx, failed) => {

            const permissions : Array<string> = [];
            for (let permission of failed) {
                const key = String(permission);
                if (key in PermissionsText) {
                    permissions.push(`\`${PermissionsText[key]}\``);
                }
                else {
                    permissions.push(`\`${permission}?¿\``);
                }
            }

            const {lang} = await getGuild(ctx.guildId);
            const langjson = json[lang];
            return ctx.editOrRespond(langjson.messages.permisos_bot(permissions.join(', ')));

        };
    };
};

export class BaseCommandOptionGroup<ParsedArgsFinished = detritus.Slash.ParsedArgs> extends detritus.Slash.SlashCommandOption<ParsedArgsFinished> {
    type = detritus.Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
}
