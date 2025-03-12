import { Context, NextFunction } from "grammy";

export function startCommand() {
	return async (ctx: Context, next: NextFunction) => {
		if (ctx.message?.text === "/start") {
			await ctx.reply("Hello World!");
		}
		await next();
	};
}
