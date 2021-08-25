import dotenv from "dotenv";
import load from "./utils/load.js";

dotenv.config();

load({
    token: process.env.DISCORD_TOKEN,
    mongo: process.env.MONGODB,
}).then(() => console.log("[LOAD FUNCTION] loaded")).catch((error) => {
    return console.error(error);
});