import { BaseSlash } from '../../../utils/classes/slash.js';
import { stats } from './stats.js';
import { view } from './view.js';
import { top } from './top.js';

export default function () {

    class Connect4 extends BaseSlash {
        constructor() {
            super();
            this.name = 'connect4';
            this.description = 'Things related to connect4';
            this.options = [stats(), view(), top()];
            this.metadata = {
                usage(prefix: string) {
                    return [
                        `${prefix}connect4 stats User`,
                        `${prefix}connect4 top easy/medium/hard`,
                        `${prefix}connect4 view ID`,
                    ];
                },
                category: 'fun',
            };
        }
    }

    return new Connect4();
}
