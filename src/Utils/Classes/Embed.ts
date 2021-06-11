import * as  eris from '@lil_marcrock22/eris-light';
type AttachmentResolvable = Buffer | { file: Buffer | string, name: string } | string;

class MessageEmbed {

    author: { name: string; icon_url?: string; url?: string }

    color: number;

    description: string;

    files: AttachmentResolvable[]

    fields: { name: string; value: string; inline?: boolean }[]

    footer: { text: string; icon_url: string }

    image: { url: string };

    timestamp: Date;

    title: string;

    thumbnail: { url: string }

    url: string;

    constructor() {
        this.setColor(Math.floor(Math.random() * (0xffffff + 1)));
        this.fields = [];
        this.files = [];
    }

    setAuthor(name: string, icon?: string, url?: string): this {

        this.author = { name, icon_url: icon, url };
        return this;

    }

    setColor(color: number): this {
        this.color = color;

        return this;
    }

    setDescription(desc: string): this {
        this.description = desc.toString().substring(0, 2048);

        return this;
    }

    addField(name: string, value: string, inline = false): this {
        if (this.fields.length >= 25) return this;
        this.fields.push({ name: name.toString().substring(0, 256), value: value.toString().substring(0, 1024), inline });

        return this;
    }

    attachFiles(file: AttachmentResolvable[]): this {
        for (const i of file) this.files.push(i);
        return this;
    }

    setFooter(text: string, icon?: string): this {
        this.footer = { text: text.toString().substring(0, 2048), icon_url: icon };

        return this;
    }

    setImage(url: string): this {
        this.image = { url };

        return this;
    }

    setTimestamp(time = new Date()): this {
        this.timestamp = time;

        return this;
    }

    setTitle(title: string): this {
        this.title = title.toString().substring(0, 256);

        return this;
    }

    setThumbnail(url: string): this {
        this.thumbnail = { url };

        return this;
    }

    setUrl(url: string): this {
        this.url = url;

        return this;
    }

    toJSON(): eris.EmbedOptions {

        return {
            title: this.title,
            description: this.description,
            url: this.url,
            timestamp: this.timestamp ? new Date(this.timestamp) : null,
            color: this.color,
            fields: this.fields,
            thumbnail: this.thumbnail,
            image: this.image,
            author: this.author
                ? {
                    name: this.author.name,
                    url: this.author.url,
                    icon_url: this.author.icon_url,
                }
                : null,
            footer: this.footer
                ? {
                    text: this.footer.text,
                    icon_url: this.footer.icon_url,
                }
                : null,
        };

    }

}

export default MessageEmbed;