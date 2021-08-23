import {BaseCommandOption} from "../../../../utils/classes/slash.js";
import {FUNCTION}          from './function.js';
import detritus            from "detritus-client";

export function bot() {

    class Bot extends BaseCommandOption {
        constructor() {
            super({
                options :
                    [{
                        name : 'difficulty',
                        required : true,
                        type : detritus.Constants.ApplicationCommandOptionTypes.STRING,
                        choices : ['easy', 'medium', 'hard'].map(x => {
                            return {name : x, value : x}
                        }),
                        description: 'Difficulty'
                    }]
            });
            this.name = "bot";
            this.description = "Play against Zenitsu.";
            this.metadata = {
                usage(prefix : string) {
                    return [
                        `${prefix}play connect4 bot easy/medium/hard`
                    ]
                },
                category : "fun",
            };
        }

        run
        (ctx : detritus.Interaction.InteractionContext,
         args : { difficulty : 'easy' | 'medium' | 'hard'; user : null }) {
            return FUNCTION(ctx, args)
        }

    }

    return new Bot();
}
