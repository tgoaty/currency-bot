import { Context, NextFunction } from "grammy";
import { CurrencyAPI } from "../currency-api/currencyAPI.ts";

export function currencyConvert() {
	return async (ctx: Context, next: NextFunction) => {
		if (ctx.message?.text && /[0-9]+-[A-Z]{3}-[A-Z]{3}$/.test(ctx.message.text)) {
			const info = ctx.message.text.split("-");

			const amount = parseInt(info[0]);
			const firstCurrency = info[1];
			const secondCurrency = info[2];

			try {
				const rate = await CurrencyAPI.getCurrencyRate(firstCurrency, secondCurrency);
				const result = (amount / rate).toFixed(3);

				ctx.reply(`${amount} ${firstCurrency} -> ${result} ${secondCurrency}`);
			} catch (error) {
				ctx.reply(`Несуществующая валюта в паре: ${firstCurrency}-${secondCurrency}. Доступные валюты /list.`);
			}
		}
		await next();
	};
}
