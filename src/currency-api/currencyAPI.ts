interface Currency {
	"ID": string;
	"NumCode": string;
	"CharCode": string;
	"Nominal": number;
	"Name": string;
	"Value": number;
	"Previous": number;
}

interface JsonCBR {
	"Date": string;
	"PreviousDate": string;
	"PreviousURL": string;
	"Timestamp": string;
	"Valute": {
		[key: string]: Currency;
	};
}

export class CurrencyAPI {
	private static readonly url: string = "https://www.cbr-xml-daily.ru/daily_json.js";
	private static cachedData: JsonCBR | null = null;
	private static lastFetchTimestamp: number = 0;
	private static readonly CACHE_DURATION: number = 60 * 60 * 1000; // 1 hour

	static async getJsonCBR(): Promise<JsonCBR> {
		const now = Date.now();
		if (
			this.cachedData && now - this.lastFetchTimestamp <= this.CACHE_DURATION
		) {
			return this.cachedData;
		}
		try {
			const response = await fetch(this.url);

			this.cachedData = await response.json();
			this.lastFetchTimestamp = now;

			return this.cachedData as JsonCBR;
		} catch (error) {
			throw error;
		}
	}

	static async getCurrencyList(): Promise<string[]> {
		const json = await this.getJsonCBR();
		const result: string[] = [];

		for (const item in json.Valute) {
			const valutePair = [item, json.Valute[item].Name];
			result.push(valutePair.join(" - "));
		}

		return result;
	}
}
