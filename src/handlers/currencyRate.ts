import { Context, NextFunction } from "grammy";
import { CurrencyAPI } from "../currency-api/currencyAPI.ts";

export function currencyRate() {
	return async (ctx: Context, next: NextFunction) => {
		if (ctx.message?.text && /^[A-Z]{3}-[A-Z]{3}$/.test(ctx.message.text)) {
			const currencies = ctx.message.text.split("-");
			const firstCurrency = currencies[0];
			const secondCurrency = currencies[1];
			try {
				const rate = await CurrencyAPI.getCurrencyRate(firstCurrency, secondCurrency);
				await ctx.reply(`Текущий курс ${firstCurrency} к ${secondCurrency}: ${rate.toFixed(3).toString()}`);
			} catch (error) {
				await ctx.reply(`Несуществующая валюта в паре: ${ctx.message.text}. Доступные валюты /list.`);
			}
		}
		await next();
	};
}
