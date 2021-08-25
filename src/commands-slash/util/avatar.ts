import detritus from "detritus-client";
import { BaseCommandOption } from "../../utils/classes/slash.js";

const { Constants: { ApplicationCommandOptionTypes } } = detritus;

export function avatar() {
    class Avatar extends BaseCommandOption {
        constructor() {
            super({
                options: [
                    {
                        name: "user",
                        type: ApplicationCommandOptionTypes.USER,
                        required: false,
                        description: "User",
                    },
                ],
            });
            this.name = "avatar";
            this.description = "User avatar";
            this.metadata = {
                usage(prefix: string) {
                    return [`${prefix}avatar [Member]`];
                },
                category: "util",
            };
        }

        async run(
            ctx: detritus.Interaction.InteractionContext,
            args: { user: detritus.Structures.MemberOrUser }
        ) {
            const user = args.user || ctx.user,
                avatar = user.avatarUrl + "?size=2048";
            return ctx.editOrRespond(`> ${avatar}`);
        }
    }

    return new Avatar();
}
