import Zenitsu from "../../Utils/Classes/client.js";
import model from '../../models/music.js'
import emojis from '../../Utils/emojis.js'
import light from 'discord.js-light';

async function event(client: Zenitsu, reaction: light.MessageReaction, user: light.User): Promise<void> {
    /*
        if (!reaction.message.guild) return;
    
        const data = await model.findOne({ guild: reaction.message.guild.id });
    
        const queue = client.music.getQueue(reaction.message.guild.id);
    
        let member = reaction.message.guild.member(user);
    
        if (!member) {
            member = await reaction.message.guild.members.fetch(user.id).catch(() => null)
        }
    
        if (member && member.voice.channelID == reaction.message.guild.me.voice.channelID && data && data.message == reaction.message.id && queue) {
    
            const emoji = reaction.emoji.name;
    
            switch (emoji) {
    
                case emojis.musica.stop:
                    client.updateMusic(reaction.message.guild.id);
                    client.music.stop(reaction.message.guild.id);
                    reaction.users.remove(user);
                    break;
    
                case emojis.musica.pause_resume:
    
                    if (client.music.isPaused(reaction.message.guild.id)) {
    
                        client.music.resume(reaction.message.guild.id);
                        client.music.pause(reaction.message.guild.id);
                        client.music.resume(reaction.message.guild.id);
    
                    }
    
                    else {
    
                        client.music.pause(reaction.message.guild.id);
                        client.music.resume(reaction.message.guild.id);
                        client.music.pause(reaction.message.guild.id);
    
                    }
                    reaction.users.remove(user);
                    break;
    
                case emojis.musica.loop:
    
                    if (queue.repeatMode == 0) {
    
                        client.music.setRepeatMode(reaction.message.guild.id, 1);
    
                    }
    
                    else if (queue.repeatMode == 1) {
    
                        client.music.setRepeatMode(reaction.message.guild.id, 2);
    
                    }
    
                    else {
    
                        client.music.setRepeatMode(reaction.message.guild.id, 0);
    
                    }
    
                    client.updateMusic(reaction.message.guild.id);
                    reaction.users.remove(user);
    
                    break;
    
                case emojis.musica.skip:
                    client.music.skip(reaction.message.guild.id);
                    reaction.users.remove(user);
    
                    break;
    
                case emojis.musica.autoplay:
                    client.music.toggleAutoplay(reaction.message.guild.id);
                    client.updateMusic(reaction.message.guild.id);
                    reaction.users.remove(user);
                    break;
    
            };
    
        };
    
        */

};

export default event;