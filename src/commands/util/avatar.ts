import Command from '../../Utils/Classes/command.js';
import run from '../../Utils/Interfaces/run.js';
import * as light from '@lil_marcrock22/eris-light';
export default class Comando extends Command {
  constructor() {
    super()
    this.name = "avatar"
    this.category = "utils"
    this.alias = ["av"]
  }
  run({ message }: run): Promise<light.Message> {
    const user = message.mentions[0] || message.author,
      avatar = user.dynamicAvatarURL();
    return message.channel.createMessage(`> ${avatar}`);
  }
}
