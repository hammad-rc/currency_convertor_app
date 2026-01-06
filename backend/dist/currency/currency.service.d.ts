export interface CurrencyRates {
    data: {
        [key: string]: number;
    } | {
        [date: string]: {
            [key: string]: number;
        };
    };
    meta: {
        last_updated_at: string;
    };
}
export interface HistoricalRatesResponse {
    data: {
        [date: string]: {
            [key: string]: number;
        };
    };
    meta: {
        last_updated_at: string;
    };
}
export interface CurrencyInfo {
    name: string;
    symbol: string;
}
export interface CurrenciesResponse {
    data: {
        [key: string]: CurrencyInfo;
    };
}
export declare class CurrencyService {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly httpClient;
    constructor();
    getLatestRates(baseCurrency: string): Promise<CurrencyRates>;
    getHistoricalRates(baseCurrency: string, date: string): Promise<CurrencyRates>;
    getCurrencies(): Promise<CurrenciesResponse>;
}
