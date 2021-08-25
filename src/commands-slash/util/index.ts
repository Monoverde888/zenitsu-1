import { BaseSlash } from "../../utils/classes/slash.js";
import { runcode } from "./runcode.js";
import { DjsDocs } from "./djsdocs.js";
import { avatar } from "./avatar.js";

export default async function () {
    const runCode = await runcode();

    class Tools extends BaseSlash {
        constructor() {
            super();
            this.name = "util";
            this.description = "Utils";
            this.options = [runCode, DjsDocs(), avatar()];
            this.metadata = {
                usage(prefix: string) {
                    return [
                        `${prefix}util avatar [Member]`,
                        `${prefix}util djsdocs Query`,
                        `${prefix}util runcode Code Language`,
                    ];
                },
                category: "util",
            };
        }
    }

    return new Tools();
}
