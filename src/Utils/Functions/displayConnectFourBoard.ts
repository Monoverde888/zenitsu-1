import { createCanvas } from 'canvas'
import imagenesC from '../Interfaces/imagenes';
import { Connect4 } from 'connect4-ai'
import buffer from './toBuffer';

async function displayConnectFourBoard(mapa: string[][], game: Connect4, imagenes: imagenesC) {
    const GIFEncoder = require('gifencoder');
    const toBuffer = require('util').promisify(buffer);
    const encoder = new GIFEncoder(700, 600);
    const stream = encoder.createReadStream()
    encoder.start();
    encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(200);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.
    mapa = mapa.map(a => a.map(e => e.replace('⬛', '⚪')))
    const win = imagenes.connect4.win
    const bck = imagenes.connect4.background;
    const imgs = {
        "🟢": imagenes.connect4.verde,
        "🟡": imagenes.connect4.amarillo
    }
    const canvas = createCanvas(700, 600)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bck, 0, 0, 700, 600)
    const columna = {
        "0": 10,
        "1": 110,
        "2": 210,
        "3": 310,
        "4": 410,
        "5": 510,
        "6": 610,
    },
        fila = {
            "0": 10,
            "1": 110,
            "2": 210,
            "3": 310,
            "4": 410,
            "5": 510
        },
        filaR = {
            "0": 510,
            "1": 410,
            "2": 310,
            "3": 210,
            "4": 110,
            "5": 10
        }

    let numero = 0;
    for (let i of mapa) {
        let lugar = 0;
        for (let j of i) {
            if (imgs[j]) {
                ctx.drawImage(imgs[j], columna[lugar] + 10, fila[numero] + 10, 50, 50)
            } lugar++
        }
        numero++
    }

    encoder.addFrame(ctx)

    if (game.solution) {
        for (let i of game.solution) {
            ctx.drawImage(win, columna[i.column] + 10, filaR[i.spacesFromBottom] + 10, 50, 50)
        }
        encoder.addFrame(ctx);
        for (let i of game.solution) {
            ctx.drawImage(game.winner == 1 ? imgs['🟢'] : imgs['🟡'], columna[i.column] + 10, filaR[i.spacesFromBottom] + 10, 50, 50)
        }
        encoder.addFrame(ctx);
        for (let i of game.solution) {
            ctx.drawImage(win, columna[i.column] + 10, filaR[i.spacesFromBottom] + 10, 50, 50)
        }
        encoder.addFrame(ctx);
    }
    encoder.finish();
    return await toBuffer(stream);

}

export default displayConnectFourBoard;