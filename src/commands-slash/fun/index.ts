import {BaseSlash} from "../../utils/classes/slash.js";
import { view }    from './view.js';
import { edit }    from './edit.js';

export default function () {

    class Tools extends BaseSlash {
        constructor() {
            super();
            this.name = "profile";
            this.description = ".";
            this.options = [view(), edit()];
            this.metadata = {
                usage(prefix : string) {
                    return [
                        `${prefix}profile view [Member]`,
                        `${prefix}profile edit color FF0000`,
                        `${prefix}profile edit color #FF0000`,
                        `${prefix}profile edit description Hi :d.`,
                        `${prefix}profile edit background URL`
                    ];
                },
                category : "fun",
            };
        }
    }

    return new Tools();
}
