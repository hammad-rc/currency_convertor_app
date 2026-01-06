import { Routes } from '@angular/router';
import { CurrencyConverterComponent } from './components/currency-converter/currency-converter.component';

export const routes: Routes = [
  { path: '', component: CurrencyConverterComponent },
  { path: '**', redirectTo: '' }
];
