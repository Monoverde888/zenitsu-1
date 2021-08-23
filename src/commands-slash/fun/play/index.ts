import {BaseSlash} from "../../../utils/classes/slash.js";
import {tictactoe} from './tictactoe.js'
import {C4}        from './connect4/index.js'

export default function () {

    class Games extends BaseSlash {
        constructor() {
            super();
            this.name = "play";
            this.description = "Play games";
            this.options = [tictactoe(), C4()];
            this.metadata = {
                usage(prefix : string) {
                    return [
                        `${prefix}play tictactoe @Zenitsu.`,
                        `${prefix}play tictactoe @User`,
                        `${prefix}play connect4 bot easy/medium/hard`,
                        `${prefix}play connect4 user @User`
                    ]
                },
                category : "fun",
            };
        }
    }

    return new Games();
}
