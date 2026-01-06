import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil, catchError, of } from 'rxjs';

import { CurrencyService } from '../../services/currency.service';
import { ConversionHistoryService, ConversionRecord } from '../../services/conversion-history.service';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

@Component({
  selector: 'app-currency-converter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatListModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './currency-converter.component.html',
  styleUrl: './currency-converter.component.scss'
})
export class CurrencyConverterComponent implements OnInit, OnDestroy {
  converterForm: FormGroup;
  currencies: Currency[] = [];
  conversionHistory: ConversionRecord[] = [];
  isLoading = false;
  isLoadingCurrencies = false;
  convertedAmount: number | null = null;
  exchangeRate: number | null = null;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private currencyService: CurrencyService,
    private historyService: ConversionHistoryService
  ) {
    this.converterForm = this.fb.group({
      amount: [1, [Validators.required, Validators.min(0.01)]],
      fromCurrency: ['USD', Validators.required],
      toCurrency: ['EUR', Validators.required],
      historicalDate: [null]
    });
  }

  ngOnInit(): void {
    this.loadCurrencies();
    this.loadHistory();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCurrencies(): void {
    this.isLoadingCurrencies = true;
    this.currencyService.getCurrencies()
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Error loading currencies:', error);
          this.errorMessage = 'Failed to load currencies. Please try again.';
          return of({ data: {} });
        })
      )
      .subscribe(response => {
        this.currencies = Object.entries(response.data).map(([code, info]: [string, any]) => ({
          code,
          name: info.name,
          symbol: info.symbol || code
        })).sort((a, b) => a.code.localeCompare(b.code));
        this.isLoadingCurrencies = false;
      });
  }

  convert(): void {
    if (this.converterForm.invalid || this.isLoading) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;
    this.convertedAmount = null;
    this.exchangeRate = null;

    const { amount, fromCurrency, toCurrency, historicalDate } = this.converterForm.value;
    const date = historicalDate ? this.formatDate(historicalDate) : null;

    const apiCall = date
      ? this.currencyService.getHistoricalRates(fromCurrency, date)
      : this.currencyService.getLatestRates(fromCurrency);

    apiCall
      .pipe(
        takeUntil(this.destroy$),
        catchError(error => {
          console.error('Conversion error:', error);
          this.errorMessage = 'Failed to convert currency. Please try again.';
          this.isLoading = false;
          return of({ data: {}, meta: { last_updated_at: '' } });
        })
      )
      .subscribe(response => {
        const rate = (response.data as { [key: string]: number })[toCurrency];
        if (rate) {
          this.exchangeRate = rate;
          this.convertedAmount = amount * rate;

          this.historyService.addRecord({
            fromCurrency,
            toCurrency,
            amount,
            convertedAmount: this.convertedAmount,
            rate,
            date: date || new Date().toISOString().split('T')[0],
            isHistorical: !!date,
            historicalDate: date || undefined
          });

          this.loadHistory();
        } else {
          this.errorMessage = 'Exchange rate not found for selected currencies.';
        }
        this.isLoading = false;
      });
  }

  swapCurrencies(): void {
    const fromCurrency = this.converterForm.get('fromCurrency')?.value;
    const toCurrency = this.converterForm.get('toCurrency')?.value;
    this.converterForm.patchValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency
    });
  }

  loadHistory(): void {
    this.conversionHistory = this.historyService.getHistory();
  }

  clearHistory(): void {
    if (confirm('Are you sure you want to clear all conversion history?')) {
      this.historyService.clearHistory();
      this.loadHistory();
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDateTime(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  getMaxDate(): Date {
    return new Date();
  }

  getMinDate(): Date {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 10);
    return date;
  }
}
