declare module 'tictactoe-complex-ai' {

    interface Options {
        level : 'easy' | 'medium' | 'hard' | 'expert';
        ai : 'X' | 'O'
        player : 'X' | 'O';
        empty : '';
        minResponseTime : number;
        maxResponseTime : number;
    }

    function createAI(options : Options) : { play(board : string[]) : Promise<number> }

    export default {createAI}
}
