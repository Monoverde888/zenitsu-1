import BaseCommand from './basecommand.js';
import { Flags } from '../const.js';
const Arr = Object.entries(Flags);
import getGuild from '../functions/getguild.js';
import json from '../lang/langs.js';

class RegisterCommand {
  constructor(options: BaseCommand) {

    options.onError = (ctx) => {
      ctx.reply('```' + ctx.command.metadata.usage(ctx.prefix).join('\n') + '```');
    };

    options.onRunError = (ctx, _, error) => {
      console.log(error);
      return ctx.reply('```' + (error.message || error) + '```');
    };

    options.onCancelRun = options.onCancelRun || ((ctx) => {
      return ctx.reply('```' + ctx.command.metadata.usage(ctx.prefix).join('\n') + '```');
    });

    options.onPermissionsFail = async (ctx, perms) => {
      const { lang } = await getGuild(ctx.guildId);
      const langjson = json[lang];
      const permsStr = '`' + Arr.filter(item => perms.map(Number).includes(item[1])).map(x => x[0]).map(perm => langjson.permissions[perm as 'SPEAK']).join(', ') + '`';
      return ctx.reply(langjson.messages.permisos_user(permsStr));
    };

    options.onPermissionsFailClient = async (ctx, perms) => {
      const { lang } = await getGuild(ctx.guildId);
      const langjson = json[lang];
      const permsStr = '`' + Arr.filter(item => perms.map(Number).includes(item[1])).map(x => x[0]).map(perm => langjson.permissions[perm as 'SPEAK']).join(', ') + '`';
      return ctx.reply(langjson.messages.permisos_bot(permsStr));
    }
    return options;
  }
}

export default RegisterCommand;
