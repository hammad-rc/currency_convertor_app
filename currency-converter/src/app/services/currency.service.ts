import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CurrencyRates {
  data: { [key: string]: number };
  meta: {
    last_updated_at: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLatestRates(baseCurrency: string): Observable<CurrencyRates> {
    const params = new HttpParams().set('base', baseCurrency);
    return this.http.get<CurrencyRates>(`${this.baseUrl}/latest`, { params });
  }

  getHistoricalRates(baseCurrency: string, date: string): Observable<CurrencyRates> {
    const params = new HttpParams()
      .set('base', baseCurrency)
      .set('date', date);
    return this.http.get<CurrencyRates>(`${this.baseUrl}/historical`, { params });
  }

  getCurrencies(): Observable<{ data: { [key: string]: { name: string; symbol: string } } }> {
    return this.http.get<{ data: { [key: string]: { name: string; symbol: string } } }>(`${this.baseUrl}/currencies`);
  }
}
