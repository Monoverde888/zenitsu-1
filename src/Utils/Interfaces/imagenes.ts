import canvas from 'canvas';

interface imagenesC {
    porquelloras: {
        chica: canvas.Image;
        chico: canvas.Image;
    };
    nicememe: {
        background: canvas.Image;
    };
    tictactoe: {
        background: canvas.Image;
        equis: canvas.Image;
        circulo: canvas.Image;
    };
    connect4: {
        background: canvas.Image;
        win: canvas.Image;
        verde: canvas.Image;
        amarillo: canvas.Image;
    };
    empty: canvas.Image;
}

export default imagenesC;