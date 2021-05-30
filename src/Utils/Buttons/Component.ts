import Button from "./Normal.js";
import URLButton from "./URL.js";

class Components {

    components: (URLButton | Button)[];
    type: 1;

    constructor(...buttons: (URLButton | Button)[]) {

        this.type = 1;
        this.components = [];
        for (const i of buttons) this.components.push(i);

    }
}

export default Components;