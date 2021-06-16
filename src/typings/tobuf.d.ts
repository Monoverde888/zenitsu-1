declare module 'stream-to-buffer' {

  import stream from 'stream'

  function potasio(a?: Error, e?: Buffer): void

  function svg2img(input: stream, callback?: typeof potasio): void
  export = svg2img;
}
