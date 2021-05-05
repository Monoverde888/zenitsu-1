declare global {

    namespace NodeJS {

        interface ProcessEnv {
            MONGODB: string
            DISCORD_TOKEN: string
            PASSWORD: string
            WEBHOOKID: string
            WEBHOOKTOKEN: string
            DBLTOKEN: string
            PASSWORDDBL: string
            YOUTUBE_COOKIE: string
        }

    }

}

export { }