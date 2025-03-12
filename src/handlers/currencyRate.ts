import { Context, NextFunction } from "grammy";
import { CurrencyAPI } from "../currency-api/currencyAPI.ts";

export function currencyRate() {
	return async (ctx: Context, next: NextFunction) => {
		if (ctx.message?.text && /^[A-Z]{3}-[A-Z]{3}$/.test(ctx.message?.text)) {
			const firstCurrency = ctx.message.text.split("-")[0];
			const secondCurrency = ctx.message.text.split("-")[1];

			const rate = await CurrencyAPI.getCurrencyRate(firstCurrency, secondCurrency);
			if (typeof rate === "number") {
				await ctx.reply(`Текущий курс ${firstCurrency} к ${secondCurrency}: ${rate.toFixed(3).toString()}`);
			} else {
				await ctx.reply(`Некорректные значение валюты: ${rate}`);
			}
		}
		await next();
	};
}
