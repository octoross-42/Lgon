import { Client } from "discord.js";
import { loader } from "./loader/loader.js"

import 'dotenv/config';

const bot:Client = new Client();
await loader(bot);

bot.login(process.env.TOKEN);
