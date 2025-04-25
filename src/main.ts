import { Client, GatewayIntentBits } from "discord.js";
import { loader } from "./loader/loader.js"

import 'dotenv/config';

const bot:Client = new Client( {intents: [
    GatewayIntentBits.Guilds, // Intent de base pour les serveurs
    GatewayIntentBits.GuildMessages, // Pour les messages des salons textuels
    GatewayIntentBits.MessageContent, // Pour lire le contenu des messages
    GatewayIntentBits.GuildMembers, // Pour les membres du serveur (nécessite l'activation dans le portail dev));
    GatewayIntentBits.DirectMessages, // Pour les messages privés

]});

await loader(bot);

bot.login(process.env.TOKEN);
