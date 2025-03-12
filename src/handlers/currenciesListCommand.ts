import { Context, NextFunction } from "grammy";
import { CurrencyAPI } from "../currency-api/currencyAPI.ts";

export function currenciesListCommand() {
	return async (ctx: Context, next: NextFunction) => {
		if (ctx.message?.text === "/list") {
			const currenciesList = await CurrencyAPI.getCurrencyList();
			await ctx.reply(currenciesList.join("\n"));
		}
		await next();
	};
}
