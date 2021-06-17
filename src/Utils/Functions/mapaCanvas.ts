/*
import canvas from 'canvas';
const { createCanvas } = canvas;
import imagenesC from "../Interfaces/imagenes.js";
import buffer from './toBuffer.js';
import GIFEncoder from 'gifencoder'
import util from 'util'
const promisified = util.promisify(buffer)
interface potoImage {
  [x: string]: canvas.Image
}
async function mapaCanvas(mapatest: string[], imagenes: imagenesC, win: boolean, personalizado?: { equis: canvas.Image, circulo: canvas.Image }): Promise<Buffer> {

  const numeros = [
    '1️⃣', '2️⃣', '3️⃣',
    '4️⃣', '5️⃣', '6️⃣',
    '7️⃣', '8️⃣', '9️⃣'
  ]

  const soniguales = mapatest.every((_, i) => _ == numeros[i]);

  const encoder = new GIFEncoder(300, 300);

  const canvas = createCanvas(300, 300);

  const ctx = canvas.getContext('2d');

  const bck = imagenes.tictactoe.background;
  ctx.drawImage(bck, 0, 0, canvas.width, canvas.height)

  const img: potoImage = {
    '❌': personalizado.equis || imagenes.tictactoe.equis,
    '⭕': personalizado.circulo || imagenes.tictactoe.circulo
  }

  if (!soniguales) {
    for (const i in mapatest) {
      const IMAGEN = img[mapatest[i]]
      if (!IMAGEN) continue;
      if (i == `0`) {
        ctx.drawImage(IMAGEN, 5, 5, 90, 90)
      }
      else if (i == `1`) {
        ctx.drawImage(IMAGEN, 105, 5, 90, 90)
      }
      else if (i == `2`) {
        ctx.drawImage(IMAGEN, 205, 5, 90, 90)
      }
      else if (i == `3`) {
        ctx.drawImage(IMAGEN, 5, 105, 90, 90)
      }
      else if (i == `4`) {
        ctx.drawImage(IMAGEN, 105, 105, 90, 90)
      }
      else if (i == `5`) {
        ctx.drawImage(IMAGEN, 205, 105, 90, 90)
      }
      else if (i == `6`) {
        ctx.drawImage(IMAGEN, 5, 205, 90, 90)
      }
      else if (i == `7`) {
        ctx.drawImage(IMAGEN, 105, 205, 90, 90)
      }
      else if (i == `8`) {
        ctx.drawImage(IMAGEN, 205, 205, 90, 90)
      }
      continue;
    }
  }

  ctx.font = '73px sans-serif'

  const pos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];// posibles posiciones para ganar.

  let positions = pos.find(p => p.every(x => mapatest[x] == '❌')) || pos.find(p => p.every(x => mapatest[x] == '⭕'))//Buscando las posiciones con las cuales se gano.

  const whowin = () => {

    return '#f1cd82'//pos.find(p => p.every(x => mapatest[x] == '❌')) ? '#D60A0A' : pos.find(p => p.every(x => mapatest[x] == '⭕')) ? '#257f9e' : '#000000';

  }

  let stream = null;
  positions = !positions && !Array.isArray(positions) ? [] : positions

  switch (positions.join('')) {

    case [0, 1, 2].join(''):

      if (win) {
        stream = encoder.createReadStream()
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        for (let i = 25; i <= 275; i += 25) {
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(5, 50);
          ctx.lineTo(i, 50);
          ctx.strokeStyle = whowin()
          ctx.stroke();
          encoder.addFrame(ctx)
        }
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(5, 50);
        ctx.lineTo(295, 50);
        ctx.strokeStyle = whowin()
        ctx.stroke();
        encoder.addFrame(ctx)
        encoder.finish();
        break;
      }

      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(5, 50);
      ctx.lineTo(295, 50);
      ctx.strokeStyle = whowin()
      ctx.stroke();
      break;

    case [3, 4, 5].join(''):

      if (win) {
        stream = encoder.createReadStream()
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        for (let i = 25; i <= 275; i += 25) {
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(5, 150);
          ctx.lineTo(i, 150);
          ctx.strokeStyle = whowin()
          ctx.stroke();
          encoder.addFrame(ctx)
        }
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(5, 150);
        ctx.lineTo(295, 150);
        ctx.strokeStyle = whowin()
        ctx.stroke();
        encoder.addFrame(ctx)
        encoder.finish();
        break;
      }

      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(5, 153);
      ctx.lineTo(295, 153);
      ctx.strokeStyle = whowin()
      ctx.stroke();
      break;

    case [6, 7, 8].join(''):

      if (win) {
        stream = encoder.createReadStream()
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        for (let i = 25; i <= 275; i += 25) {
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(5, 250);
          ctx.lineTo(i, 250);
          ctx.strokeStyle = whowin()
          ctx.stroke();
          encoder.addFrame(ctx)
        }
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(5, 250);
        ctx.lineTo(295, 250);
        ctx.strokeStyle = whowin()
        ctx.stroke();
        encoder.addFrame(ctx)
        encoder.finish();
        break;
      }

      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(5, 250);
      ctx.lineTo(295, 250);
      ctx.strokeStyle = whowin()
      ctx.stroke();
      break;

    case [0, 3, 6].join(''):

      if (win) {
        stream = encoder.createReadStream()
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        for (let i = 25; i <= 275; i += 25) {
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(50, 5);
          ctx.lineTo(50, i);
          ctx.strokeStyle = whowin()
          ctx.stroke();
          encoder.addFrame(ctx)
        }
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(50, 5);
        ctx.lineTo(50, 295);
        ctx.strokeStyle = whowin()
        ctx.stroke();
        encoder.addFrame(ctx)
        encoder.finish();
        break;
      }

      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(50, 5);
      ctx.lineTo(50, 295);
      ctx.strokeStyle = whowin()
      ctx.stroke();
      break;

    case [1, 4, 7].join(''):

      if (win) {
        stream = encoder.createReadStream()
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        for (let i = 25; i <= 275; i += 25) {
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(150, 5);
          ctx.lineTo(150, i);
          ctx.strokeStyle = whowin()
          ctx.stroke();
          encoder.addFrame(ctx)
        }
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(150, 5);
        ctx.lineTo(150, 295);
        ctx.strokeStyle = whowin()
        ctx.stroke();
        encoder.addFrame(ctx)
        encoder.finish();
        break;
      }

      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(152, 5);
      ctx.lineTo(152, 295);
      ctx.strokeStyle = whowin()
      ctx.stroke();
      break;
    case [2, 5, 8].join(''):

      if (win) {
        stream = encoder.createReadStream()
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        for (let i = 25; i <= 275; i += 25) {
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(250, 5);
          ctx.lineTo(250, i);
          ctx.strokeStyle = whowin()
          ctx.stroke();
          encoder.addFrame(ctx)
        }
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(250, 5);
        ctx.lineTo(250, 295);
        ctx.strokeStyle = whowin()
        ctx.stroke();
        encoder.addFrame(ctx)
        encoder.finish();
        break;
      }

      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(250, 5);
      ctx.lineTo(250, 295);
      ctx.strokeStyle = whowin()
      ctx.stroke();
      break;
    case [0, 4, 8].join(''):
      if (win) {
        stream = encoder.createReadStream()
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.
        for (let i = 25; i <= 275; i += 25) {
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(10, 10);
          ctx.lineTo(i, i);
          ctx.strokeStyle = whowin()
          ctx.stroke();
          encoder.addFrame(ctx)
        }
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(10, 10);
        ctx.lineTo(290, 290);
        ctx.strokeStyle = whowin()
        ctx.stroke();
        encoder.addFrame(ctx)
        encoder.finish();
        break;
      }

      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(10, 5);
      ctx.lineTo(290, 285);
      ctx.strokeStyle = whowin()
      ctx.stroke();
      break;
    case [2, 4, 6].join(''):

      // eslint-disable-next-line no-case-declarations
      //            const values = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275];

      if (win) {
        stream = encoder.createReadStream()
        encoder.start();
        encoder.setRepeat(-1);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(1);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.

        const values = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275]

        const ultravalues = [275, 250, 225, 200, 175, 150, 125, 100, 75, 50, 25];

        for (const i in values) {
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.moveTo(values[i], ultravalues[i]);
          ctx.lineTo(10, 290);
          ctx.strokeStyle = whowin()
          ctx.stroke();
          encoder.addFrame(ctx)

        }

        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.moveTo(290, 10);
        ctx.lineTo(10, 290);
        ctx.strokeStyle = whowin()
        ctx.stroke();
        encoder.addFrame(ctx)
        encoder.finish()
        break;
      }
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(10, 290);
      ctx.lineTo(290, 10);
      ctx.strokeStyle = whowin()
      ctx.stroke();
      break;

    default:
      if (win) {
        ctx.font = '25px sans-serif'
        ctx.fillText('Si ves esto reportar!', 50, 110)
        break;
      }
  }

  const attachment = canvas.toBuffer()
  let final: Buffer;
  if (win && stream) {
    final = await promisified(stream)
  }
  else {
    final = attachment
  }
  return (final);
}


export default mapaCanvas
*/
