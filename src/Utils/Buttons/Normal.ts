import { STYLES, estilos } from './types.js';

class Button {

    url: string;
    custom_id: string;
    style: 1 | 2 | 3 | 4 | 5;
    type: 2;
    label: string;
    emoji?: {
        name: string;
        id: string
    };
    disabled?: boolean;

    constructor(style: estilos) {
        this.type = 2;
        this.style = STYLES[style];
    }

    setCustomID(custom_id: string): Button {
        this.custom_id = custom_id;
        return this;
    }

    setLabel(label: string): Button {
        this.label = label;
        return this;
    }

    setEmoji(emoji: { name: string, id: string }): Button {
        this.emoji = emoji;
        return this;
    }

    setDisabled(disabled: boolean): Button {
        this.disabled = disabled;
        return this;
    }

}

export default Button;