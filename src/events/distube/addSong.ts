import Zenitsu from "../../Utils/Classes/client.js";
import light from 'discord.js-light';
import Queue from 'distube/typings/Queue.js'
import distube from 'distube'

async function event(client: Zenitsu, queue: Queue, song: distube.Song): Promise<light.Message> {

    return queue.textChannel.send(`añadido ${song.name}`)

}

export default event;