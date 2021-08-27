class URLButton {

    url: string;
    style: 1 | 2 | 3 | 4 | 5;
    type: 2;
    label: string;
    emoji?: {
        name: string;
        id: string | undefined
    };
    disabled?: boolean;

    constructor() {
        this.type = 2;
        this.style = 5;
    }

    setURL(url: string): URLButton {
        this.url = url;
        return this;
    }

    setLabel(label: string): URLButton {
        this.label = label;
        return this;
    }

    setEmoji(emoji: { name: string, id: string | undefined }): URLButton {
        this.emoji = emoji;
        return this;
    }

    setDisabled(disabled: boolean): URLButton {
        this.disabled = disabled;
        return this;
    }

}

export default URLButton;