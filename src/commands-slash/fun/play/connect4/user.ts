import {BaseCommandOption} from "../../../../utils/classes/slash.js";
import {FUNCTION}          from './function.js';
import detritus            from "detritus-client";

export function user() {

    class User extends BaseCommandOption {
        constructor() {
            super({
                options : [
                    {
                        name : 'user',
                        required : true,
                        type : detritus.Constants.ApplicationCommandOptionTypes.USER,
                        description : 'User'
                    },
                    {
                        name : 'needtoconnect',
                        required : false,
                        type : detritus.Constants.ApplicationCommandOptionTypes.STRING,
                        choices : ['3', '4', '5', '6'].map(x => {
                            return {name : x, value : x}
                        }),
                        description : 'Chips needed to win'
                    }
                ]
            });
            this.name = "user";
            this.description = "Plays against a user";
            this.metadata = {
                usage(prefix : string) {
                    return [
                        `${prefix}play connect4 user @User`
                    ]
                },
                category : "fun",
            };
        }

        run(ctx : detritus.Interaction.InteractionContext,
            args : { difficulty : null; user : detritus.Structures.MemberOrUser; needtoconnect : string }) {
            return FUNCTION(ctx, args)
        }

    }

    return new User();
}
