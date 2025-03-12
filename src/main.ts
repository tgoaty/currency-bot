import { Bot } from "grammy";
import "jsr:@std/dotenv/load";
import { startCommand } from "./handlers/startCommand.ts";
import { currenciesListCommand } from "./handlers/currenciesListCommand.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");

if (!TOKEN) {
	throw new Error("No Token provided");
}

const bot = new Bot(TOKEN);

bot.use(
	startCommand(),
	currenciesListCommand(),
);

bot.start();
