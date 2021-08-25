import { BaseCommandOptionGroup } from "../../../../utils/classes/slash.js";
import { user } from './user.js';
import { bot } from './bot.js';

export function C4() {
    class Connect4 extends BaseCommandOptionGroup {
        constructor() {
            super({
                options: [user(), bot()]
            });
            this.name = "connect4";
            this.description = "Play connect4";
            this.metadata = {
                usage(prefix: string) {
                    return [
                        `${prefix}play connect4 user @User`,
                        `${prefix}play connect4 bot easy/medium/hard`
                    ]
                },
                category: "fun",
            }
        }
    }

    return new Connect4();
}
