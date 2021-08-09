import {Embed as MessageEmbed} from "detritus-client/lib/utils/embed.js";
import detritus                from "detritus-client";
import getGuild                from "../../utils/functions/getguild.js";
import {BaseCommandOption}     from "../../utils/classes/slash.js";

const {Constants : {Permissions : Flags}} = detritus;

export function view() {

    class View extends BaseCommandOption {
        constructor() {
            super();
            this.name = "view";
            this.disableDm = true;
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [prefix + "settings view"];
                },
                category : "admin",
            };
            this.permissions = [Flags.MANAGE_GUILD].map(BigInt);
        }

        async run(
            ctx : detritus.Slash.SlashContext,
        ) {

            const data = await getGuild(ctx.guildId);
            const rol = ctx.guild.roles.get(data.muterole);
            const canales = data.ignorechannels ? data.ignorechannels.filter(x => ctx.client.channels.has(x)).map(item => {
                const channel = ctx.client.channels.get(item);
                return `${channel.mention} - (${channel.name})`
            }) : [];
            const embed = new MessageEmbed()
                .setColor(0xff0000)
                .addField('Muterole', rol ? `${rol.mention}  \`[${rol.id}]\`` : '❌', true)
                .addField('Onlythreads', data.onlythreads ? `✅` : '❌', true)
                .addField('Ignore channels', canales.join(', ') || '❌', true)
                .setTimestamp();
            return ctx.editOrRespond({embed});

        }
    }

    return new View();
}
