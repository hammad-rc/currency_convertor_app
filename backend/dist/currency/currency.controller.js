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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyController = void 0;
const common_1 = require("@nestjs/common");
const currency_service_1 = require("./currency.service");
let CurrencyController = class CurrencyController {
    currencyService;
    constructor(currencyService) {
        this.currencyService = currencyService;
    }
    async getLatestRates(base) {
        if (!base) {
            throw new common_1.HttpException('Base currency is required', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.currencyService.getLatestRates(base);
    }
    async getHistoricalRates(base, date) {
        if (!base) {
            throw new common_1.HttpException('Base currency is required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!date) {
            throw new common_1.HttpException('Date is required', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.currencyService.getHistoricalRates(base, date);
    }
    async getCurrencies() {
        return this.currencyService.getCurrencies();
    }
};
exports.CurrencyController = CurrencyController;
__decorate([
    (0, common_1.Get)('latest'),
    __param(0, (0, common_1.Query)('base')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CurrencyController.prototype, "getLatestRates", null);
__decorate([
    (0, common_1.Get)('historical'),
    __param(0, (0, common_1.Query)('base')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CurrencyController.prototype, "getHistoricalRates", null);
__decorate([
    (0, common_1.Get)('currencies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CurrencyController.prototype, "getCurrencies", null);
exports.CurrencyController = CurrencyController = __decorate([
    (0, common_1.Controller)('currency'),
    __metadata("design:paramtypes", [currency_service_1.CurrencyService])
], CurrencyController);
//# sourceMappingURL=currency.controller.js.map