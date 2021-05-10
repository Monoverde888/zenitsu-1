import Command from '../../Utils/Classes/command.js'
import run from '../../Utils/Interfaces/run.js';
import light from 'discord.js-light';
const { MessageEmbed, MessageAttachment } = light;
import Canvas from 'canvas'
import puppeteer from 'puppeteer'
import svg2img from 'node-svg2img'
import util from 'util'
const { promisify } = util;

export default class Comando extends Command {
    constructor() {
        super()
        this.name = "discordstatus"
        this.category = 'utils'
        this.cooldown = 60;
    }
    async run({ client, message, langjson }: run): Promise<light.Message> {

        const msg = await message.channel.send(langjson.commands.discordstatus.message);

        const url = `https://discordstatus.com`;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1500);
        const data = await page.content();
        await browser.close();
        const canvas = Canvas.createCanvas(650, 60 * 7),
            ctx = canvas.getContext('2d')
        const texts: {
            [x: string]: string
        } = {
            '1': 'API',
            '2': 'Media Proxy',
            '3': 'Push Notifications',
            '4': 'Search',
        };
        const xd = ['a', 'e'];

        xd[1]

        for (const n of [1, 2, 3, 4]) {
            const array: number[] = data.split(`<svg class="availability-time-line-graphic"`)[n].split('</svg>')[0].split('x="').map(e => e.split('"')[0]).filter(e => !isNaN(e as unknown as number)).map(parseInt),
                colores = data.split(`<svg class="availability-time-line-graphic" id="uptime-component-`)[n].split('</svg>')[0].split('fill="').map(a => a.split('"')[0]).slice(1)
            ctx.fillStyle = '#ffffff'
            ctx.fillText(texts[n], 5, (n * 60) - 5);

            for (const i in array) {
                ctx.fillStyle = colores[i]
                ctx.fillRect(array[i], n * 60, 3, 34)
            }
        }

        const svg = data.split('<path fill="none" d="')[1].split('" class')[0]
        const preRes = await promisify(svg2img)(`<svg><path fill="none" d="${svg}" class="highcharts-graph" data-z-index="1" stroke="#738bd7" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path></svg>`, { format: 'png', width: 900, height: 100 })
        const res = await Canvas.loadImage(preRes)
        ctx.drawImage(res, 0, 320, 900, 100);

        const att = new MessageAttachment(canvas.toBuffer(), 'img.png');
        const embed = new MessageEmbed()
            .setColor(client.color)
            .setTimestamp()
            .attachFiles([att])
            .setImage('attachment://img.png')
            .setAuthor('Discord Status', 'https://cdn.discordapp.com/attachments/649043690765025352/813915354010222642/750851146884710541.png', 'https://discordstatus.com/');
        return message.channel.send({ embed }).finally(() => {
            try {
                if (msg.deletable) return msg.delete();
                // eslint-disable-next-line no-empty
            } catch { }
        })

    }
}