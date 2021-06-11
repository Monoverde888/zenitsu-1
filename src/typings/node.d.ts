declare global {

    namespace NodeJS {

        interface ProcessEnv {
            APICONNECTFOUR: string;
            APIKEY: string;
            MONGODB: string;
            DISCORD_TOKEN: string;
            PASSWORD: string;
            WEBHOOKID: string;
            WEBHOOKTOKEN: string;
            DBLTOKEN: string;
            PASSWORDDBL: string;
            YOUTUBE_COOKIE: string;
            SHARD_ID: string;
            SHARD_TOKEN: string;
        }

    }

}

export { }