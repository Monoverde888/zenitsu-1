import detritus          from "detritus-client";
import {PermissionsText} from "../const.js";
import getGuild          from "../../utils/functions/getguild.js";
import json              from "../../utils/lang/langs.js";

export class BaseSlash<ParsedArgsFinished = detritus.Interaction.ParsedArgs> extends detritus.Interaction.InteractionCommand<ParsedArgsFinished> {

    async onBefore(ctx : detritus.Interaction.InteractionContext) {
        if (!ctx.guildId) return true;
        const data = await getGuild(ctx.guildId).then(x => x.ignorechannels);
        if (!data || !data.length) return true;
        return !data.includes(ctx.channelId);
    }

    onError(ctx : detritus.Interaction.InteractionContext, args : Record<string, any>, error : any) {
        console.error(error);
        // return ctx.editOrRespond(
        //     "```" + (error ? error.message || error : "ERROR") + "```"
        // );
    };

    onRunError(ctx : detritus.Interaction.InteractionContext, args : Record<string, any>, error : any) {
        console.error(error);
        return ctx.editOrRespond(
            "```" + (error ? error.message || error : "ERROR") + "```"
        );
    };

    onCancelRun(ctx : detritus.Interaction.InteractionContext, args : Record<string, any>) {
        return ctx.editOrRespond(
            "```" + ctx.command.metadata.usage("/").join("\n") + "```"
        );
    };

    async onPermissionsFail(ctx : detritus.Interaction.InteractionContext, failed : bigint[]) {

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

    async onPermissionsFailClient(ctx : detritus.Interaction.InteractionContext, failed : bigint[]) {

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

export class BaseCommandOption<ParsedArgsFinished = detritus.Interaction.ParsedArgs> extends detritus.Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = detritus.Constants.ApplicationCommandOptionTypes.SUB_COMMAND;

    async onBefore(ctx : detritus.Interaction.InteractionContext) {
        if (!ctx.guildId) return true;
        const data = await getGuild(ctx.guildId).then(x => x.ignorechannels);
        if (!data || !data.length) return true;
        return !data.includes(ctx.channelId);
    }

    onError(ctx : detritus.Interaction.InteractionContext, args : Record<string, any>, error : any) {
        console.error(error);
        // return ctx.editOrRespond(
        //     "```" + (error ? error.message || error : "ERROR") + "```"
        // );
    };

    onRunError(ctx : detritus.Interaction.InteractionContext, args : Record<string, any>, error : any) {
        console.error(error);
        return ctx.editOrRespond(
            "```" + (error ? error.message || error : "ERROR") + "```"
        );
    };

    onCancelRun(ctx : detritus.Interaction.InteractionContext, args : Record<string, any>) {
        return ctx.editOrRespond(
            "```" + ctx.command.metadata.usage("/").join("\n") + "```"
        );
    };

    async onPermissionsFail(ctx : detritus.Interaction.InteractionContext, failed : bigint[]) {

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

    async onPermissionsFailClient(ctx : detritus.Interaction.InteractionContext, failed : bigint[]) {

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

export class BaseCommandOptionGroup<ParsedArgsFinished = detritus.Interaction.ParsedArgs> extends detritus.Interaction.InteractionCommandOption<ParsedArgsFinished> {
    type = detritus.Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
}
