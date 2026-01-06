import { Injectable } from '@angular/core';

export interface ConversionRecord {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  date: string;
  timestamp: string;
  isHistorical: boolean;
  historicalDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConversionHistoryService {
  private readonly storageKey = 'currencyConversionHistory';

  constructor() {}

  getHistory(): ConversionRecord[] {
    try {
      const history = localStorage.getItem(this.storageKey);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error reading conversion history:', error);
      return [];
    }
  }

  addRecord(record: Omit<ConversionRecord, 'id' | 'timestamp'>): void {
    try {
      const history = this.getHistory();
      const newRecord: ConversionRecord = {
        ...record,
        id: this.generateId(),
        timestamp: new Date().toISOString()
      };
      history.unshift(newRecord);
      if (history.length > 100) {
        history.splice(100);
      }
      localStorage.setItem(this.storageKey, JSON.stringify(history));
    } catch (error) {
      console.error('Error saving conversion history:', error);
    }
  }

  clearHistory(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing conversion history:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}
