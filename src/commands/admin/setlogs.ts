import Command from '../../Utils/Classes/command.js';
import commandinterface from '../../Utils/Interfaces/run.js'
import fetch from 'axios';
import light from 'discord.js-light'

class Comando extends Command {

    constructor() {
        super();
        this.cooldown = 0;
        this.name = "setlogs"
        this.alias = []
        this.category = 'admin'
        this.botPermissions = { guild: [], channel: ['EMBED_LINKS'] }
        this.memberPermissions = { guild: ['MANAGE_GUILD'], channel: [] }
    };

    async run({ client, message, args, langjson, lang }: commandinterface) {
        /*
                const [type, url] = args;
        
                if (!type || !url)
                    return message.channel.send('nao')
        
                const res = await fetch.get(url).catch(() => undefined).then(res => res?.data);
        
                if (!res?.id || !res?.name || !res?.channel_id || !res?.guild_id || !res?.token)
                    return message.reply('invalid webhook, dumb')
        
                const embed = new light.MessageEmbed()
                    .setAuthor(res.name, res.avatar
                        ? `https://cdn.discordapp.com/avatars/${res.id}/${res.avatar}.png`
                        : `https://cdn.discordapp.com/embed/avatars/0.png`)
                console.log(res);
        
                console.log(embed.author)
        
                const check = await fetch.get(embed.author.iconURL).catch(() => undefined);
        
                if (!check) return message.reply('invalid webhook, dumb')
        
                return message.reply({ embed })
        */
    }

}

export default Comando;