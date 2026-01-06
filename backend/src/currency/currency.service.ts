import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

export interface CurrencyRates {
  data: { [key: string]: number } | { [date: string]: { [key: string]: number } };
  meta: {
    last_updated_at: string;
  };
}

export interface HistoricalRatesResponse {
  data: { [date: string]: { [key: string]: number } };
  meta: {
    last_updated_at: string;
  };
}

export interface CurrencyInfo {
  name: string;
  symbol: string;
}

export interface CurrenciesResponse {
  data: { [key: string]: CurrencyInfo };
}

@Injectable()
export class CurrencyService {
  private readonly apiKey = '4E0VK7BnkdeUuh1vegAt808v2IUjzUR6lxcvBMT2';
  private readonly baseUrl = 'https://api.freecurrencyapi.com/v1';
  private readonly httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
    });
  }

  async getLatestRates(baseCurrency: string): Promise<CurrencyRates> {
    try {
      const response = await this.httpClient.get<CurrencyRates>('/latest', {
        params: {
          apikey: this.apiKey,
          base_currency: baseCurrency,
        },
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch latest exchange rates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getHistoricalRates(
    baseCurrency: string,
    date: string,
  ): Promise<CurrencyRates> {
    try {
      const response = await this.httpClient.get<any>('/historical', {
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
    } catch (error: any) {
      console.error('Historical rates error:', error.response?.data || error.message);
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch historical exchange rates',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getCurrencies(): Promise<CurrenciesResponse> {
    try {
      const response = await this.httpClient.get<CurrenciesResponse>(
        '/currencies',
        {
          params: {
            apikey: this.apiKey,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch currencies',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

