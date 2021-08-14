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
                        description : '.'
                    }
                ]
            });
            this.name = "user";
            this.description = ".";
            this.disableDm = true;
            this.metadata = {
                usage(prefix : string) {
                    return [
                        `${prefix}play connect4 user @User`
                    ]
                },
                category : "fun",
            };
        }

        run
        (ctx : detritus.Interaction.InteractionContext,
         args : { difficulty : null; user : detritus.Structures.MemberOrUser }) {
            return FUNCTION(ctx, args)
        }

    }

    return new User();
}
