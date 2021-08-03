import detritus from 'detritus-client'
import { Flags } from '../const.js';
const Arr = Object.entries(Flags);
import getGuild from '../../utils/functions/getguild.js';
import json from '../../utils/lang/langs.js';

export class BaseSlash extends detritus.Slash.SlashCommand {

  constructor(options: detritus.Slash.SlashCommandOptions = {}) {
    super(options);

    options.onError = (ctx, error) => {
      console.error(error);
      return ctx.editOrRespond('```' + (error ? (error.message || error) : 'ERROR') + '```');
    };

    options.onRunError = (ctx, _, error) => {
      console.error(error);
      return ctx.editOrRespond('```' + (error ? (error.message || error) : 'ERROR') + '```');
    };

    options.onCancelRun = options.onCancelRun || ((ctx) => {
      return ctx.editOrRespond('```' + ctx.command.metadata.usage('/').join('\n') + '```');
    });

    options.onPermissionsFail = async (ctx, perms) => {
      const { lang } = await getGuild(ctx.guildId);
      const langjson = json[lang];
      const permsStr = '`' + Arr.filter(item => perms.map(Number).includes(item[1])).map(x => x[0]).map(perm => langjson.permissions[perm as 'SPEAK']).join(', ') + '`';
      return ctx.editOrRespond(langjson.messages.permisos_user(permsStr));
    };

    options.onPermissionsFailClient = async (ctx, perms) => {
      const { lang } = await getGuild(ctx.guildId);
      const langjson = json[lang];
      const permsStr = '`' + Arr.filter(item => perms.map(Number).includes(item[1])).map(x => x[0]).map(perm => langjson.permissions[perm as 'SPEAK']).join(', ') + '`';
      return ctx.editOrRespond(langjson.messages.permisos_bot(permsStr));
    }

  }

}

export class BaseCommandOption<ParsedArgsFinished = detritus.Slash.ParsedArgs> extends detritus.Slash.SlashCommandOption<ParsedArgsFinished> {
  type = detritus.Constants.ApplicationCommandOptionTypes.SUB_COMMAND;
};

export class BaseCommandOptionGroup<ParsedArgsFinished = detritus.Slash.ParsedArgs> extends detritus.Slash.SlashCommandOption<ParsedArgsFinished> {
  type = detritus.Constants.ApplicationCommandOptionTypes.SUB_COMMAND_GROUP;
};
