import dotenv from 'dotenv';
import kufa from 'kufa';
import load from './utils/load.js';
dotenv.config();
load({ token: process.env.DISCORD_TOKEN, mongo: process.env.MONGODB });
console = new kufa.KufaConsole({
  format: `[§a%time%§r] [%prefix%§r] %message% %trace% %memory%`,
  log_prefix: `§2LOG`,
  warn_prefix: `§6WARN`,
  error_prefix: `§4ERROR`,
  traceFun: true,
  parser(ctx) {

    switch (ctx.type) {

      case 'error':
        ctx.format = `[§4%time%§r] [%prefix%§r] %message% %trace% %memory%`;
        break;

      case 'warn':
        ctx.format = `[§6%time%§r] [%prefix%§r] %message% %trace% %memory%`;
        break;

      case 'log':
      default:
        ctx.format = `[§a%time%§r] [%prefix%§r] %message% %trace% %memory%`;
        break;

    }
  },
  depth: 10
});
