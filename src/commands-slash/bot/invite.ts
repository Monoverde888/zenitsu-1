import detritus                from 'detritus-client';
import {Embed as MessageEmbed} from 'detritus-client/lib/utils/embed.js';
import {Color}                 from '../../utils/const.js'
import {BaseSlash}             from '../../utils/classes/slash.js';
import json                    from '../../utils/lang/langs.js';
import getGuild                from '../../utils/functions/getguild.js';

export default function () {

    class Invite extends BaseSlash {
        constructor() {
            super();
            this.name = 'invite'
            this.description = '.'
            this.metadata = {
                usage(prefix : string) {
                    return [`${prefix}invite`];
                },
                category : "bot",
            };
        }

        async run(ctx : detritus.Interaction.InteractionContext) {
            
            const langjson = ctx.guildId ? json[(await getGuild(ctx.guildId).then(x => x.lang))] : json.en;
            const link = 'https://discord.com/api/oauth2/authorize?client_id=721080193678311554&scope=bot+applications.commands&permissions=8';
            const invitacionLink = 'https://discord.gg/4Yzc7Hk';
            const embed = new MessageEmbed()
                .setThumbnail(ctx.client.user.avatarUrl)
                .setDescription(langjson.commands.invite.message(link, invitacionLink))
                .setColor(Color)
                .setTimestamp()
            return ctx.editOrRespond({embed : embed})

        }
    }

    return new Invite();

};