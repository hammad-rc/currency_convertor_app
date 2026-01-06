import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CurrencyService } from './currency.service';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Get('latest')
  async getLatestRates(@Query('base') base: string) {
    if (!base) {
      throw new HttpException(
        'Base currency is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.currencyService.getLatestRates(base);
  }

  @Get('historical')
  async getHistoricalRates(
    @Query('base') base: string,
    @Query('date') date: string,
  ) {
    if (!base) {
      throw new HttpException(
        'Base currency is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!date) {
      throw new HttpException('Date is required', HttpStatus.BAD_REQUEST);
    }
    return this.currencyService.getHistoricalRates(base, date);
  }

  @Get('currencies')
  async getCurrencies() {
    return this.currencyService.getCurrencies();
  }
}

