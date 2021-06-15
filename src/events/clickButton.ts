import Zenitsu from '../Utils/Classes/client.js';
import * as eris from '@lil_marcrock22/eris-light';

async function on(client: Zenitsu, button: eris.ButtonInteraction): Promise<void> {
    client.buttons.listen(button);
}

export default on;
