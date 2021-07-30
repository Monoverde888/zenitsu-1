import detritus from 'detritus-client';
const cooldown: Set<string> = new Set();
import BaseCommand from '../../utils/classes/command.js';
import parseArgs from '../../utils/functions/parseargs.js';
import { Embed as MessageEmbed } from 'detritus-client/lib/utils/embed.js';
import { Flags } from '../../utils/const.js'
import redis from '../../utils/managers/redis.js';
import json from '../../utils/lang/langs.js';
import getGuild from '../../utils/functions/getguild.js';
import getHighest from '../../utils/functions/gethighest.js';
import guild from '../../database/models/guild.js';

function parseMentions(content: string): string[] {
  return (content.match(/<#[0-9]+>/g) || []).map((mention) => mention.substring(2, mention.length - 1));
}

export default new BaseCommand({
  label: 'arg',
  metadata: {
    usage(prefix: string) {
      return [
        prefix + "settings (view|muterole|reset)",
        prefix + "settings view",
        prefix + "settings ignorechannels #ChannelMention",
        prefix + "settings onlythreads",
        prefix + "settings muterole init [role]",
        prefix + "settings muterole refresh",
        prefix + "settings reset"
      ]
    },
    category: 'admin'
  },
  permissions: [Flags.MANAGE_GUILD],
  name: 'settings',
  onBeforeRun(ctx, { arg }) {

    const mentions = parseMentions(ctx.content).map(id => ctx.guild.channels.get(id));
    const args = parseArgs(arg);

    if (!['muterole', 'view', 'reset', 'ignorechannels', 'onlythreads'].includes(args[0])) return false;
    if (args[0] == 'muterole')
      if (!['init', 'refresh'].includes(args[1])) return false;
    if (args[0] == 'ignorechannels')
      if (!mentions[0]) return false;
    return true;

  },
  async run(ctx, { arg }) {

    const langjson = json[(await getGuild(ctx.guildId).then(x => x.lang))];
    const args = parseArgs(arg);
    const settings = langjson.commands.settings;
    const { muterole, cooldown: cooldownMessage, ignorechannels, onlythreads } = settings;
    const data = await getGuild(ctx.guildId)
    const GUILDME = ctx.guild.me;

    if (cooldown.has(ctx.guildId))
      return ctx.reply(cooldownMessage);

    switch (args[0]) {

      case 'ignorechannels': {

        const mentions = parseMentions(ctx.content).map(id => ctx.guild.channels.get(id));
        const channelMention = mentions[0];

        if (channelMention.isText && !channelMention.isGuildThread) {

          if (!data.ignorechannels || !data.ignorechannels.includes(channelMention.id)) {
            const temp = await guild.findOneAndUpdate({ id: ctx.guildId }, { $addToSet: { ignorechannels: channelMention.id } }, { new: true }).lean();
            await redis.set(ctx.guildId, JSON.stringify(temp));
            return ctx.reply(ignorechannels.add(channelMention.mention + ' ' + channelMention.name));
          }

          const temp = await guild.findOneAndUpdate({ id: ctx.guildId }, { $pull: { ignorechannels: channelMention.id } }, { new: true }).lean();
          await redis.set(ctx.guildId, JSON.stringify(temp));
          return ctx.reply(ignorechannels.remove(channelMention.mention + ' ' + channelMention.name));

        }

        return this.onCancelRun(ctx);

      };

      case 'onlythreads': {

        const temp = await guild.findOneAndUpdate({ id: ctx.guildId }, { onlythreads: !data.onlythreads }, { new: true }).lean();
        await redis.set(ctx.guildId, JSON.stringify(temp));
        return ctx.reply(temp.onlythreads ? onlythreads.true : onlythreads.false);

      };

      case 'muterole': {

        if (!ctx.guild.me.can([Flags.MANAGE_GUILD, Flags.MANAGE_ROLES, Flags.MANAGE_CHANNELS]))
          return this.onPermissionsFailClient(ctx, [Flags.MANAGE_GUILD, Flags.MANAGE_ROLES, Flags.MANAGE_CHANNELS].filter(perm => (Number(ctx.guild.me.permissions) & perm) != perm));

        switch (args[1]) {

          case 'init': {

            if (ctx.guild.roles.get(data.muterole)) return ctx.reply(
              muterole.init.use_refresh(ctx.prefix)
            );

            const role = ctx.guild.roles.get(args[2]) || ctx.guild.roles.find(item => item.name == args.slice(2).join(' ')) || ctx.message.mentionRoles.first();

            if (!role || !(role.guildId == ctx.guildId))
              return ctx.reply(
                muterole.refresh.use_init(ctx.prefix)
              );

            const canales = ctx.message.guild.channels.filter(item => item.type == 0 || item.type == 4 || item.type == 5 || item.type == 2 || item.type == 13).filter(canal => filter(canal, role.id));

            if (!canales.length) {
              if (data.muterole != role.id) {
                const temp = await guild.findOneAndUpdate({ id: ctx.guildId }, { muterole: role.id }, { new: true }).lean();
                await redis.set(ctx.guildId, JSON.stringify(temp));
              }
              return ctx.reply(muterole.refresh.already);
            }

            if ((getHighest(GUILDME).position < role.position) || role.managed)
              return ctx.reply(muterole.init.cannt_edit(role.mention));

            await ctx.reply(muterole.init.editando);
            cooldown.add(ctx.guildId);
            const { success, error } = await Edit({ canales, id: role.id, message: ctx.message })

            if (success) {
              //Todo bien, todo correcto...
              cooldown.delete(ctx.guildId);
              const temp = await guild.findOneAndUpdate({ id: ctx.guildId }, { muterole: role.id }, { new: true }).lean();
              await redis.set(ctx.guildId, JSON.stringify(temp));
              return ctx.reply(muterole.init.success);
            }
            else if (error) {
              //Error al editar un canal...
              cooldown.delete(ctx.guildId);
              return ctx.reply(`Error: ${error.name || error}`);
            }
            else {
              //El usuario le quito permisos al bot...
              cooldown.delete(ctx.guildId);
              return ctx.reply(muterole.init.else);
            }
          }

          case 'refresh': {

            const role = ctx.message.guild.roles.get(data.muterole);

            if (!role) return ctx.reply(
              muterole.refresh.use_init(ctx.prefix),
            );

            if ((getHighest(GUILDME).position < role.position) || role.managed) {
              cooldown.delete(ctx.guildId);
              return ctx.reply(muterole.refresh.cannt_edit(role.mention));
            };

            const canales = ctx.message.guild.channels.filter(item => filter(item, role.id))

            if (!canales.length)
              return ctx.reply(muterole.refresh.already);

            cooldown.add(ctx.guildId);

            await ctx.reply(muterole.refresh.editando);

            const { success, error } = await Edit({ canales, message: ctx.message, id: role.id })

            if (success) {
              //Todo bien, todo correcto...
              cooldown.delete(ctx.guildId);
              const temp = await guild.findOneAndUpdate({ id: ctx.guildId }, { muterole: role.id }, { new: true }).lean();
              await redis.set(ctx.guildId, JSON.stringify(temp));
              return ctx.reply(muterole.refresh.success);
            }
            else if (error) {
              //Error al editar un canal...
              cooldown.delete(ctx.guildId);
              return ctx.reply(`Error: ${error.name || error}`);
            }
            else {
              //El usuario le quito permisos al bot...
              cooldown.delete(ctx.guildId);
              return ctx.reply(muterole.refresh.else);
            }
          }

          default: {
            return ctx.reply(">>> " +
              ctx.prefix + "settings (view|muterole|reset)\n" +
              ctx.prefix + "settings view\n" +
              ctx.prefix + "settings ignorechannels #ChannelMention\n" +
              ctx.prefix + "settings onlythreads\n" +
              ctx.prefix + "settings muterole init [role]\n" +
              ctx.prefix + "settings muterole refresh\n" +
              ctx.prefix + "settings reset"
            )
          }
        }
      }

      case 'view': {
        const rol = ctx.message.guild.roles.get(data.muterole);
        const canales = data.ignorechannels ? data.ignorechannels.filter(x => ctx.client.channels.has(x)).map(item => {
          const channel = ctx.client.channels.get(item);
          return `${channel.mention} - (${channel.name})`
        }) : [];
        const embed = new MessageEmbed()
          .setColor(0xff0000)
          .addField('Muterole', rol ? `${rol.mention}  \`[${rol.id}]\`` : '❌')
          .addField('Onlythreads', data.onlythreads ? `✅` : '❌')
          .addField('Ignore channels', canales.join(', ') || '❌')
          .setTimestamp();
        return ctx.reply({ embed });
      }

      case 'reset': {

        const data = await guild.findOneAndUpdate({ id: ctx.guildId }, { muterole: '1' }, { new: true });
        await redis.set(ctx.guildId, JSON.stringify(data));

        const embed = new MessageEmbed()
          .setColor(0xff0000)
          .setDescription(langjson.commands.settings.reset.message)
          .setTimestamp();
        return ctx.reply({ embed });


      }

      default: {

        return ctx.reply(">>> " +
          ctx.prefix + "settings (view|muterole|reset)\n" +
          ctx.prefix + "settings view\n" +
          ctx.prefix + "settings ignorechannels #ChannelMention\n" +
          ctx.prefix + "settings onlythreads\n" +
          ctx.prefix + "settings muterole init [role]\n" +
          ctx.prefix + "settings muterole refresh\n" +
          ctx.prefix + "settings reset"
        )

      }
    }

  },
});

async function Edit(all: { canales: detritus.Structures.Channel[], id: string, message: detritus.Structures.Message }): Promise<{ error: Error, success: boolean }> {

  const { canales, id, message } = all;
  let success = true;
  let error: Error = null;
  const GUILDME = message.guild.me;

  const permisos = [Flags.MANAGE_GUILD];

  for (const canal of canales) {
    const permisosBit = Flags.SEND_MESSAGES + Flags.ADD_REACTIONS;
    const permisosVoice = Flags.CONNECT + Flags.SPEAK + Flags.STREAM;
    const role = message.guild.roles.get(id);
    const check = permisos.every(item => ((Number(GUILDME.permissions) & item) == item) && role && !((getHighest(GUILDME).position < role.position) || role.managed));

    if (check && success) {
      await canal.editOverwrite(id, { allow: 0, deny: (canal.type == 2 || canal.type == 13) ? permisosVoice : permisosBit })
        .then(() => {
          success = true;
        })
        .catch((e) => {
          error = e;
          success = false;
        });
    }
    else {
      success = false;
    }

  }

  return { success, error };

}

function filter(item: detritus.Structures.Channel, id: string) {

  const TEXT = Flags.SEND_MESSAGES + Flags.ADD_REACTIONS;
  const VOICE = Flags.CONNECT + Flags.SPEAK + Flags.STREAM;

  if ([13, 2].includes(item.type)) {
    if (!item.permissionOverwrites.has(id)) return true;
    if ((Number(item.permissionOverwrites.get(id).deny) & VOICE) == VOICE) return false;
    else return true;
  }

  else if ([4, 0, 5].includes(item.type)) {
    if (!item.permissionOverwrites.has(id)) return true;
    if (((Number(item.permissionOverwrites.get(id).deny) & TEXT) == TEXT)) return false;
    else return true;
  }

  return false;

}
