import { Context } from "grammy";

export function startCommand() {
	return async (ctx: Context) => {
		if (ctx.message?.text === "/start") {
			await ctx.reply("Hello World!");
		}
	};
}
