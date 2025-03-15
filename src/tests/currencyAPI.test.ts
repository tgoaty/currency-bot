import { CurrencyAPI, JsonCBR } from "../currency-api/currencyAPI.ts";
import { assert, assertEquals, assertRejects } from "jsr:@std/assert";

const mockJsonCBR: JsonCBR = {
	Date: "2023-10-01T00:00:00+03:00",
	PreviousDate: "2023-09-30T00:00:00+03:00",
	PreviousURL: "https://www.cbr-xml-daily.ru/archive/2023/09/30/daily_json.js",
	Timestamp: "2023-10-01T12:00:00+03:00",
	Valute: {
		USD: {
			ID: "R01235",
			NumCode: "840",
			CharCode: "USD",
			Nominal: 1,
			Name: "US Dollar",
			Value: 75.5,
			Previous: 76.0,
		},
		EUR: {
			ID: "R01239",
			NumCode: "978",
			CharCode: "EUR",
			Nominal: 1,
			Name: "Euro",
			Value: 85.0,
			Previous: 84.5,
		},
	},
};

const originalFetch = globalThis.fetch;
const setupMocks = () => {
	globalThis.fetch = () =>
		Promise.resolve({
			json: () => Promise.resolve(mockJsonCBR),
		} as Response);
};

const restoreMocks = () => {
	globalThis.fetch = originalFetch;
};

const setupCache = () => {
	CurrencyAPI.cachedData = null;
	CurrencyAPI.lastFetchTimestamp = 0;
};

Deno.test("CurrencyAPI.getJsonCBR", async () => {
	setupMocks();
	setupCache();

	const data = await CurrencyAPI.getJsonCBR();

	assertEquals(data, mockJsonCBR);
	assertEquals(CurrencyAPI.cachedData, mockJsonCBR);
	assert(CurrencyAPI.lastFetchTimestamp > 0);

	restoreMocks();
});

Deno.test("CurrencyAPI.getJsonCBR cache", async () => {
	setupMocks();

	CurrencyAPI.cachedData = mockJsonCBR;
	CurrencyAPI.lastFetchTimestamp = Date.now();

	const data = await CurrencyAPI.getJsonCBR();

	assertEquals(data, mockJsonCBR);

	restoreMocks();
});

Deno.test("CurrencyAPI.getJsonCBR should throw error if API request fails", async () => {
	globalThis.fetch = () => Promise.reject(new Error("API request failed"));

	CurrencyAPI.cachedData = null;
	CurrencyAPI.lastFetchTimestamp = 0;

	await assertRejects(
		() => CurrencyAPI.getJsonCBR(),
		Error,
		"API request failed",
	);

	restoreMocks();
});
Deno.test("CurrencyAPI.getJsonCBR should fetch data from API if cache is expired", async () => {
	setupMocks();

	CurrencyAPI.cachedData = mockJsonCBR;
	CurrencyAPI.lastFetchTimestamp = Date.now() - CurrencyAPI.CACHE_DURATION - 10 * 60 * 1000;

	const data = await CurrencyAPI.getJsonCBR();

	assertEquals(data, mockJsonCBR);

	assertEquals(CurrencyAPI.cachedData, mockJsonCBR);
	assert(CurrencyAPI.lastFetchTimestamp > 0);

	restoreMocks();
});
Deno.test("CurrencyAPI.getCurrencyList", async () => {
	setupMocks();
	setupCache();

	const listCurrencies = await CurrencyAPI.getCurrencyList();

	assertEquals(listCurrencies, ["USD - US Dollar", "EUR - Euro"]);

	restoreMocks();
});

Deno.test("CurrencyAPI.getValue", async () => {
	setupMocks();
	setupCache();

	const usdValue = await CurrencyAPI.getValue("USD");

	assertEquals(usdValue, 75.5);

	restoreMocks();
});

Deno.test("CurrencyAPI.getValue error", async () => {
	setupMocks();
	setupCache();

	await assertRejects(
		() => CurrencyAPI.getValue("AAA"),
		Error,
	);
	restoreMocks();
});

Deno.test("CurrencyAPI.getCurrencyRate should return correct rate for EUR to USD", async () => {
	setupMocks();
	setupCache();

	const eurToUsd = await CurrencyAPI.getCurrencyRate("EUR", "USD");
	assertEquals(eurToUsd, 1.1258278145695364);

	restoreMocks();
});

Deno.test("CurrencyAPI.getCurrencyRate should return correct rate for USD to EUR", async () => {
	setupMocks();
	setupCache();

	const usdToEur = await CurrencyAPI.getCurrencyRate("USD", "EUR");
	assertEquals(usdToEur, 0.888235294117647);

	restoreMocks();
});

Deno.test("CurrencyAPI.getCurrencyRate should return correct rate for RUB to USD", async () => {
	setupMocks();
	setupCache();

	const rubToUsd = await CurrencyAPI.getCurrencyRate("RUB", "USD");
	assertEquals(rubToUsd, 75.5);

	restoreMocks();
});

Deno.test("CurrencyAPI.getCurrencyRate should return correct rate for USD to RUB", async () => {
	setupMocks();
	setupCache();

	const usdToRub = await CurrencyAPI.getCurrencyRate("USD", "RUB");
	assertEquals(usdToRub, 0.013245033112582781);

	restoreMocks();
});

Deno.test("CurrencyAPI.getCurrencyRate should return 1 for USD to USD", async () => {
	setupMocks();
	setupCache();

	const usdToUsd = await CurrencyAPI.getCurrencyRate("USD", "USD");
	assertEquals(usdToUsd, 1);

	restoreMocks();
});

Deno.test("CurrencyAPI.getCurrencyRate should return 1 for RUB to RUB", async () => {
	setupMocks();
	setupCache();

	const rubToRub = await CurrencyAPI.getCurrencyRate("RUB", "RUB");
	assertEquals(rubToRub, 1);

	restoreMocks();
});

Deno.test("CurrencyAPI.getCurrencyRate error", async () => {
	setupMocks();
	setupCache();

	await assertRejects(
		() => CurrencyAPI.getCurrencyRate("EUR", "AAA"),
		Error,
	);
	restoreMocks();
});
``;
