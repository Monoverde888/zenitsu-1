import detritus            from "detritus-client";
import {BaseCommandOption} from "../../utils/classes/slash.js";

const {Constants : {ApplicationCommandOptionTypes}} = detritus;

export function avatar() {
    class Avatar extends BaseCommandOption {
        constructor() {
            super({
                options : [
                    {
                        name : "user",
                        type : ApplicationCommandOptionTypes.USER,
                        required : false,
                        description : ".",
                    },
                ],
            });
            this.name = "avatar";
            this.description = ".";
            this.metadata = {
                usage(prefix : string) {
                    return [`${prefix}avatar [Member]`];
                },
                category : "util",
            };
        }

        async run(
            ctx : detritus.Slash.SlashContext,
            args : { user : detritus.Structures.MemberOrUser }
        ) {
            const user   = args.user || ctx.user,
                  avatar = user.avatarUrl + "?size=2048";
            return ctx.editOrRespond(`> ${avatar}`);
        }
    }

    return new Avatar();
}
