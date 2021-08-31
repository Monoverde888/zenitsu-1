import detritus from 'detritus-client';
import fetch from 'node-fetch';
import json from '../../utils/lang/langs.js';
import getGuild from '../../utils/functions/getguild.js';
import { BaseCommandOption } from '../../utils/classes/slash.js';

const { Constants: { ApplicationCommandOptionTypes } } = detritus;

export async function runcode() {
    const arr = await fetch('https://emkc.org/api/v2/piston/runtimes').then((x) =>
        x.json()
    );
    const res = arr.map((x: { language: string; aliases: string[] }) => [
        x.language,
        ...x.aliases,
    ]);

    const avaliables: string[] = [];
    for (const i of res) {
        avaliables.push(...i);
    }

    class RunCode extends BaseCommandOption {
        constructor() {
            super({
                options: [
                    {
                        name: 'code',
                        required: true,
                        description: 'Code to run',
                        type: ApplicationCommandOptionTypes.STRING,
                    },
                    {
                        name: 'language',
                        required: true,
                        description: 'Language to use',
                        type: ApplicationCommandOptionTypes.STRING,
                    },
                ],
            });
            this.name = 'runcode';
            this.description = 'Run code in a programming language';
            this.metadata = {
                usage(prefix: string) {
                    return [
                        prefix +
                        'runcode \\`\\`\\`javascript\nconsole.log("Hello world");\n\\`\\`\\`',
                    ];
                },
                category: 'util',
            };
        }

        async run(
            ctx: detritus.Interaction.InteractionContext,
            args: { code: string; language: string }
        ) {
            const langjson = ctx.guildId
                ? json[await getGuild(ctx.guildId).then((x) => x.lang)]
                : json.en;

            const buttons = [
                new detritus.Utils.ComponentButton().setUrl('https://github.com/engineer-man/piston').setLabel('Piston GitHub'),
                new detritus.Utils.ComponentButton().setUrl('https://zenitsu.eastus.cloudapp.azure.com/runcode').setLabel('Run code')
            ];

            if (!avaliables.includes(args.language))
                return ctx.editOrRespond({
                    content: langjson.commands.runcode.invalid_lang, components: [new detritus.Utils.ComponentActionRow({ components: buttons })],
                });

            await ctx.respond(
                detritus.Constants.InteractionCallbackTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
            );

            const response = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                body: JSON.stringify({
                    language: args.language, //lenguaje
                    version: '*', //ultima versión (?)
                    files: [{ content: args.code }], //código
                }),
                headers: {
                    Authorization: process.env.RUNCODEKEY,
                },
            });

            const res = await response.json();

            if (res.run) {
                if (res.run.output)
                    return ctx.editOrRespond({
                        content: `${ctx.user.mention}\`\`\`${args.language}\n${(
                            res.run.output as string
                        ).slice(0, 1800)}\`\`\``,
                        components: [new detritus.Utils.ComponentActionRow({ components: buttons })]
                    });
                else return ctx.editOrRespond({
                    content: langjson.commands.runcode.no_output,
                    components: [new detritus.Utils.ComponentActionRow({ components: buttons })]
                });
            }
            return ctx.editOrRespond({
                content: (res.message || langjson.commands.runcode.error), components: [new detritus.Utils.ComponentActionRow({ components: buttons })]
            });
        }
    }

    return new RunCode();
}
