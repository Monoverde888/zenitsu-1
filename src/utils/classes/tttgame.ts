import EVENTS from 'events';

const pos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

class TheGame extends EVENTS.EventEmitter {
    players: [string, string];
    map: string[];
    private __lastTurn: number;
    winner: string;
    draw: boolean;
    ended: boolean;

    constructor(players: [string, string]) {
        super();
        const randomPlayer = players[Math.floor(Math.random() * players.length)]
        this.players = [randomPlayer == players[0] ? players[1] : players[0], randomPlayer == players[1] ? players[1] : players[0]];
        this.map = ['', '', '', '', '', '', '', '', '',]
        this.__lastTurn = 0;
        this.winner = null;
        this.draw = null;
    }

    emit(event: 'winner' | 'draw' | 'end', ...args: any[]): boolean;
    emit(event: 'winner' | 'draw' | 'end', ...args: any[]) {
        return super.emit(event, ...args);
    }

    on(event: 'winner' | 'draw' | 'end', listener: () => void): this
    on(event: 'winner' | 'draw' | 'end', listener: () => void) {
        return super.on(event, listener);
    }

    get turn() {
        return this.__lastTurn == 0 ? 1 : 0;
    }

    get player() {
        return this.players[this.turn];
    }

    get ficha(): 'X' | 'O' {
        return this.turn == 1 ? 'X' : 'O'
    }

    finish() {
        this.ended = true;
        this.emit('end');
        return this;
    }

    get finished() {
        return this.draw || this.ended || !!this.winner
    }

    play(played: number) {
        if (!this.canPlay(played)) throw new Error(`Can't play ${played}.`)
        this.map[played] = this.ficha;
        if (pos.find(p => p.every(x => this.map[x] == 'X')) || pos.find(p => p.every(x => this.map[x] == 'O'))) {
            this.emit('winner');
            this.winner = this.player;
            this.draw = false;
            return played;
        }
        else if (this.map.every(x => x)) {
            this.emit('draw');
            this.draw = true;
            return played;
        }
        this.__lastTurn = this.turn;
        return played;
    }

    canPlay(played: number) {
        return this.map[played] === '';
    }

}

export default TheGame;