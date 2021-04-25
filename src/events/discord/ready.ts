import Zenitsu from "../../Utils/Classes/client";
import svg from 'node-svg2img'
import util from 'util';
const { promisify } = util;
import fs from 'fs/promises';
const { writeFile } = fs;
import path from 'path';
const { join } = path;
import axios from 'axios'
import light from 'discord.js-light';
import common from '../../Utils/Functions/commons.js';
const res = common(import.meta.url);
const __dirname: string = res.__dirname;
async function get() {

    let fetch: string = await axios(`https://github.com/marcrock22/zenitsu`).then(res => res.data);
    let arr = fetch.split('js-details-container Details')
    return arr[arr.length - 1].match(/title=\"(([A-Z])|\.){1,99}\".data\-/gmi).map(item => item.slice(7).slice(0, -7)).slice(0)

}
async function event(client: Zenitsu) {

    const buffer = await promisify(svg)(`https://top.gg/api/widget/721080193678311554.svg`)
    const path = join(__dirname, '..', '..', '..', 'Images', 'topgg.png');
    await writeFile(path, buffer);
    await client.setPresence();
    console.log(`${client.user.tag} está listo :):):):):).`)

    setInterval(async () => {
        client.setPresence();

        //Post stats to top.gg
        await client.dbl.postStats(client.guilds.cache.size);


    }, ((60 * 30) * 1000));//30m

    const webhook = await (client.channels.cache.get(`832735151309848596`) as light.TextChannel).fetchWebhooks().then(we => we.first())

    const preRes = await get();
    const res = [];
    const emojis = {
        Images: `📁`,
        src: `😋`,
        handler: `⛏`,
        '.eslintrc.json': `🗃️`,
        '.gitignore': `👁️`,
        'Aptfile': `❓`,
        'COMIC.TTF': `📰`,
        LICENSE: `👮‍♀️`,
        'Minecrafter.Reg.ttf': `📰`,
        'OpenSansEmoji.ttf': `📰`,
        'README.md': `👉`,
        'package.json': `🗃️`,
        'tsconfig.json': `🗃️`
    };

    for (let file of preRes) {

        const papush = emojis[file] ? `${emojis[file]} ${file}` : file;

        res.push(papush);

    }

    client.editWebhookMessage({
        id: webhook.id,
        token: webhook.token,
        messageID: '834586549781135380',
        data: {
            content: '```' + res.join('\n') + '```', embeds: [{
                description: `Source code: https://github.com/marcrock22/zenitsu`
            }]
        }
    });

}

export default event;