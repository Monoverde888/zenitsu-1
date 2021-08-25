declare module 'image-url-validator' {
    function func(str: string): Promise<boolean> {
        return !!str;
    }
    export default { default: func }
}
