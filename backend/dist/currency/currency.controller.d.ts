import { CurrencyService } from './currency.service';
export declare class CurrencyController {
    private readonly currencyService;
    constructor(currencyService: CurrencyService);
    getLatestRates(base: string): Promise<import("./currency.service").CurrencyRates>;
    getHistoricalRates(base: string, date: string): Promise<import("./currency.service").CurrencyRates>;
    getCurrencies(): Promise<import("./currency.service").CurrenciesResponse>;
}
