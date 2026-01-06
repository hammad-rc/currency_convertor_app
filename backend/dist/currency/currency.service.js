"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
let CurrencyService = class CurrencyService {
    apiKey = '4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2';
    baseUrl = 'https://api.freecurrencyapi.com/v1';
    httpClient;
    constructor() {
        this.httpClient = axios_1.default.create({
            baseURL: this.baseUrl,
            timeout: 10000,
        });
    }
    async getLatestRates(baseCurrency) {
        try {
            const response = await this.httpClient.get('/latest', {
                params: {
                    apikey: this.apiKey,
                    base_currency: baseCurrency,
                },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch latest exchange rates', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getHistoricalRates(baseCurrency, date) {
        try {
            const response = await this.httpClient.get('/historical', {
                params: {
                    apikey: this.apiKey,
                    base_currency: baseCurrency,
                    date: date,
                },
            });
            const historicalData = response.data.data;
            if (historicalData && typeof historicalData === 'object') {
                const dateKeys = Object.keys(historicalData);
                if (dateKeys.length > 0) {
                    const dateKey = dateKeys[0];
                    const rates = historicalData[dateKey];
                    if (rates && typeof rates === 'object') {
                        return {
                            data: rates,
                            meta: response.data.meta || { last_updated_at: date },
                        };
                    }
                }
            }
            return {
                data: historicalData,
                meta: response.data.meta || { last_updated_at: date },
            };
        }
        catch (error) {
            console.error('Historical rates error:', error.response?.data || error.message);
            throw new common_1.HttpException(error.response?.data?.message || 'Failed to fetch historical exchange rates', error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getCurrencies() {
        try {
            const response = await this.httpClient.get('/currencies', {
                params: {
                    apikey: this.apiKey,
                },
            });
            return response.data;
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch currencies', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.CurrencyService = CurrencyService;
exports.CurrencyService = CurrencyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CurrencyService);
//# sourceMappingURL=currency.service.js.map