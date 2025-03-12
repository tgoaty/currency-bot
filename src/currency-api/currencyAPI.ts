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
	private static readonly url: string =
		"https://www.cbr-xml-daily.ru/daily_json.js";

	static async getJsonCBR(): Promise<JsonCBR> {
		const response = await fetch(this.url);
		return await response.json();
	}

	static async getCurrencyList() {
		const json = await this.getJsonCBR();
		return Object.keys(json.Valute);
	}
}
