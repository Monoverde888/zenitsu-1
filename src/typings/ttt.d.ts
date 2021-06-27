declare module 'tresenraya' {

  interface Events {
    finalizado: [string[], { array: string[], string: string }, number]
    empate: [string[], { array: string[], string: string }, number]
  }

  export class partida {

    constructor({ jugadores }: { jugadores: string[] });

    public on<K extends keyof Events>(event: K, listener: (...args: Events[K]) => void): this;
    public on<S extends string | symbol>(
      event: Exclude<S, keyof Events>,
      listener: (first: string[] | string, second: { array: string[], string: string }, last: number) => void,
    ): this;

    public emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean;
    public emit<S extends string | symbol>(event: Exclude<S, keyof Events>, first: string[] | string, second: { array: string[], string: string }, last: number): boolean;

    public finalizado: boolean
    public tablero: {
      array: string[],
      string: string
    }
    public turno: {
      jugador: string,
      ficha: string
    }
    public paso: number
    public jugadores: string[]
    public perdedor: string
    public elegir(num: number): void
    public disponible(num: number): boolean
    public pasar(): void
    public finalizar(): void
    public mejorPos: number;

  }

}
