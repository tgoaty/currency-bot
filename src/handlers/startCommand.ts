import { Context, NextFunction } from "grammy";
import { bot } from "../main.ts";

export function startCommand() {
	return async (ctx: Context, next: NextFunction) => {
		if (ctx.message?.text === "/start") {
			bot.api.setMyCommands([
				{ command: "start", description: "Starts working with the bot." },
				{ command: "list", description: "Shows a list of currency codes." },
			]);

			await ctx.reply(
				"Введи валютную пару в формате USD-EUR, чтобы узнать курс обмена. Для конвертации введи 1000-USD-EUR.",
			);
		}
		await next();
	};
}
