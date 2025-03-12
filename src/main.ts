import { Bot } from "grammy";
import "jsr:@std/dotenv/load";
import { startCommand } from "./handlers/startCommand.ts";
import { currenciesListCommand } from "./handlers/currenciesListCommand.ts";
import { currencyRate } from "./handlers/currencyRate.ts";

const TOKEN = Deno.env.get("BOT_TOKEN");

if (!TOKEN) {
	throw new Error("No Token provided");
}

const bot = new Bot(TOKEN);

bot.api.setMyCommands([
	{ command: "start", description: "Starts working with the bot." },
	{ command: "list", description: "Shows a list of currency codes." },
]);

bot.use(
	startCommand(),
	currenciesListCommand(),
	currencyRate(),
);

bot.start();
