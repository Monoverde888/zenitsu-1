import {BaseSlash} from "../../../utils/classes/slash.js";
import {tictactoe} from './tictactoe.js'

export default function () {

    class Games extends BaseSlash {
        constructor() {
            super();
            this.name = "play";
            this.description = ".";
            this.options = [tictactoe()];
            this.metadata = {
                usage(prefix : string) {
                    return [
                        `${prefix}play tictactoe @Zenitsu.`,
                        `${prefix}play tictactoe @User`
                    ]
                },
                category : "fun",
            };
        }
    }

    return new Games();
}
