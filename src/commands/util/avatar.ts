import BaseCommand from '../../Utils/Classes/command.js';

export default new BaseCommand({
  metadata: {
    usage(prefix: string) {
      return [`${prefix}avatar [user]`]
    },
    category: 'util'
  },
  name: 'avatar',
  async run(ctx) {

    const user = ctx.message.mentions.first() || ctx.message.author,
      avatar = user.avatarUrl;
    return ctx.reply(`> ${avatar}`);

  },
});
