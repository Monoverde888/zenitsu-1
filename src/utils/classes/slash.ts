import detritus          from "detritus-client";
import {PermissionsText} from "../const.js";
import getGuild          from "../../utils/functions/getguild.js";
import json              from "../../utils/lang/langs.js";

export class BaseSlash<ParsedArgsFinished = detritus.Slash.ParsedArgs> extends detritus.Slash.SlashCommand<ParsedArgsFinished> {

    async onBefore(ctx : detritus.Slash.SlashContext) {
        if (!ctx.guildId) return true;
        const data = await getGuild(ctx.guildId).then(x => x.ignorechannels);
        if (!data || !data.length) return true;
        return !data.includes(ctx.channelId);
    }

    onError(ctx : detritus.Slash.SlashContext, args : Record<string, any>, error : any) {
        console.error(error);
        return ctx.editOrRespond(
            "```" + (error ? error.message || error : "ERROR") + "```"
        );
    };

    onRunError(ctx : detritus.Slash.SlashContext, args : Record<string, any>, error : any) {
        console.error(error);
        return ctx.editOrRespond(
            "```" + (error ? error.message || error : "ERROR") + "```"
        );
    };

    onCancelRun(ctx : detritus.Slash.SlashContext, args : Record<string, any>) {
        return ctx.editOrRespond(
            "```" + ctx.command.metadata.usage("/").join("\n") + "```"
        );
    };

    async onPermissionsFail(ctx : detritus.Slash.SlashContext, failed : bigint[]) {

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

    async onPermissionsFailClient(ctx : detritus.Slash.SlashContext, failed : bigint[]) {

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

export class BaseCommandOption<ParsedArgsFinished = detritus.Slash.ParsedArgs> extends detritus.Slash.SlashCommandOption<ParsedArgsFinished> {
    type = detritus.Constants.ApplicationCommandOptionTypes.SUB_COMMAND;

    async onBefore(ctx : detritus.Slash.SlashContext) {
        if (!ctx.guildId) return true;
        const data = await getGuild(ctx.guildId).then(x => x.ignorechannels);
        if (!data || !data.length) return true;
        return !data.includes(ctx.channelId);
    }

    onError(ctx : detritus.Slash.SlashContext, args : Record<string, any>, error : any) {
        console.error(error);
        return ctx.editOrRespond(
            "```" + (error ? error.message || error : "ERROR") + "```"
        );
    };

    onRunError(ctx : detritus.Slash.SlashContext, args : Record<string, any>, error : any) {
        console.error(error);
        return ctx.editOrRespond(
            "```" + (error ? error.message || error : "ERROR") + "```"
        );
    };

    onCancelRun(ctx : detritus.Slash.SlashContext, args : Record<string, any>) {
        return ctx.editOrRespond(
            "```" + ctx.command.metadata.usage("/").join("\n") + "```"
        );
    };

    async onPermissionsFail(ctx : detritus.Slash.SlashContext, failed : bigint[]) {

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

    async onPermissionsFailClient(ctx : detritus.Slash.SlashContext, failed : bigint[]) {

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

export class BaseCommandOptionGroup<ParsedArgsFinished = detritus.Slash.ParsedArgs> extends detritus.Slash.SlashCommandOption<ParsedArgsFinished> {
    type = detritus.Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
}
