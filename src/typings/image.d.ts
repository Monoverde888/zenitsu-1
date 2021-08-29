declare module 'image-url-validator' {
    function func(str: string): Promise<boolean>;
    export default { default: func };
}
