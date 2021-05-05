declare module 'node-svg2img' {

    type input = Buffer | string

    function potasio(a?: Error, e?: Buffer): void

    interface options {
        witdth?: number
        height?: number
        format?: string
    }

    function svg2img(input: input, options?: options, callback?: typeof potasio): void
    export = svg2img;
}