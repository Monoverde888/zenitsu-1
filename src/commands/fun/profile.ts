import light from 'eris-pluris';
import run from '../../Utils/Interfaces/run.js';
import Command from '../../Utils/Classes/command.js';
import MessageEmbed from '../../Utils/Classes/Embed.js';
import CANVAS from 'canvas';
import names from '../../Utils/Interfaces/profile/flagsname.js'
import namesXD from '../../Utils/Interfaces/profile/achiementesnames.js'
const { loadImage, createCanvas } = CANVAS;
export default class Comando extends Command {

    constructor() {
        super()
        this.name = "profile";
        this.category = 'fun';
        this.botPermissions.channel = ['attachFiles'];
        this.cooldown = 10;
    }

    async run({ message, client, langjson }: run): Promise<light.Message> {

        const bloque = client.imagenes.empty;
        const user = message.mentions.filter(user => !user.bot)[0] || message.author;
        const data = await client.profile.cacheOrFetch(user.id);
        const { flags, achievements } = data;
        const randomColor = Math.floor(Math.random() * (0xffffff + 1));
        let color = data.color || randomColor.toString(16)
        color = color.startsWith('#') ? color.slice(1) : color;
        const canvas = createCanvas(1000, 1000);
        const ctx = canvas.getContext('2d');

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(1000, 0);
        ctx.lineTo(0, 1000);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(1000, 1000);
        ctx.lineTo(0, 1000);
        ctx.lineTo(1000, 0);
        ctx.fillStyle = '#b3c7c2';
        ctx.fill();
        ctx.closePath();

        const avatar = await loadImage(user.dynamicAvatarURL());

        ctx.drawImage(avatar, 50, 200, 300, 300);

        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
        ctx.strokeRect(50, 200, 300, 300);

        ctx.fillStyle = '#000000';
        ctx.font = '60px "Comic Sans"';
        ctx.fillText(user.username + '#' + user.discriminator, 50, 100);

        let o = 0;
        let y = 0;
        const wochi = 100;

        //Dibujar logros
        for (let i = 0; i < 18; i++) {
            if (o == wochi * 6) {
                y += wochi;
                o = 0;
            }
            if (i >= achievements.length) {
                if (!o) {
                    ctx.drawImage(bloque, 380, 200 + y, 100, 100);
                }
                else {
                    ctx.drawImage(bloque, ((o) + 380), 200 + y, 100, 100);
                }
            }
            o += wochi;
        }
        o = 0;
        y = 0;
        ctx.fillText(langjson.commands.profile.achievements, 380, 175);
        for (const i of achievements) {
            if (o == wochi * 6) {
                y += wochi;
                o = 0;
            }
            if (!o) {
                ctx.drawImage(client.achievements[i as namesXD], 380, 200 + y, 100, 100);
            }
            else {
                ctx.drawImage(client.achievements[i as namesXD], ((o) + 380), 200 + y, 100, 100);
            }
            o += wochi;
        }

        //Dibujar insignias
        ctx.fillText(langjson.commands.profile.flags, 200, 675);
        o = 0;
        y = 0;
        for (let i = 0; i < 18; i++) {
            if (o == wochi * 6) {
                y += wochi;
                o = 0;
            }
            if (i >= flags.length) {
                if (!o) {
                    ctx.drawImage(bloque, 200, 700 + y, 100, 100);
                }
                else {
                    ctx.drawImage(bloque, ((o) + 200), 700 + y, 100, 100);
                }
            }
            o += wochi;
        }
        o = 0;
        y = 0;
        for (const i of flags) {
            if (o == wochi * 6) {
                y += wochi;
                o = 0;
            }
            if (!o) {
                ctx.drawImage(client.flags[i as names], 200, 700 + y, 100, 100);
            }
            else {
                ctx.drawImage(client.flags[i as names], ((o) + 200), 700 + y, 100, 100);
            }
            o += wochi;
        }

        const att = canvas.toBuffer()
        const embed = new MessageEmbed()
            .setColor(parseInt(color, 16) ?? 0)
            .setDescription(data.description)
            .setImage('attachment://profile.png');

        return message.channel.createMessage({ embed }, [{ file: att, name: 'profile.png' }]);

    }
}