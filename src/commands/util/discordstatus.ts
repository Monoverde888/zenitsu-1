import Command from '../../Utils/Classes/command.js'
import run from '../../Utils/Interfaces/run.js';
import light from '@lil_marcrock22/eris-light-pluris'
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
    async run({ message, langjson }: run): Promise<light.Message> {

        const msg = await message.channel.createMessage(langjson.commands.discordstatus.message);
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

        for (const n of [1, 2, 3, 4]) {
            const array: string[] = data.split(`<svg class="availability-time-line-graphic"`)[n].split('</svg>')[0].split('x="').map(e => e.split('"')[0]).filter(e => parseInt(e)),
                colores = data.split(`<svg class="availability-time-line-graphic" id="uptime-component-`)[n].split('</svg>')[0].split('fill="').map(a => a.split('"')[0]).slice(1)
            ctx.fillStyle = '#ffffff'
            ctx.font = '15px "Sans"'
            ctx.fillText(texts[n], 5, (n * 60) - 5);

            for (const i in array) {
                ctx.fillStyle = colores[i]
                ctx.fillRect(parseInt(array[i]), n * 60, 3, 34)
            }
        }

        const svg = data.split('<path fill="none" d="')[1].split('" class')[0]
        const preRes = await promisify(svg2img)(`<svg><path fill="none" d="${svg}" class="highcharts-graph" data-z-index="1" stroke="#738bd7" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"></path></svg>`, { format: 'png', width: 900, height: 100 })
        const res = await Canvas.loadImage(preRes)
        ctx.drawImage(res, 0, 320, 900, 100);

        const att = canvas.toBuffer();
        return message.channel.createMessage({ content: 'Discord Status https://discordstatus.com/' }, { file: att, name: 'img.png' }).finally(() => {
            return msg.delete().catch(() => undefined);
        })

    }
}