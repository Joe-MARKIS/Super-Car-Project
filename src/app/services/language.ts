import { Injectable, computed, signal } from '@angular/core';
import { LanguageCode, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';

export type CurrencyCode = 'USD' | 'EUR' | 'CDF' | 'GBP' | 'JPY';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rateToUsd: number; // 1 USD = rate units
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', rateToUsd: 1 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', rateToUsd: 0.92 },
  CDF: { code: 'CDF', symbol: 'FC', name: 'Franc Congolais', rateToUsd: 2850 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rateToUsd: 0.78 },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUsd: 152 },
};

export interface DestinationCountry {
  code: string;
  name: string;
  flag: string;
  primaryPort: string;
}

export const DESTINATION_COUNTRIES: DestinationCountry[] = [
  { code: 'CD', name: 'R.D. Congo', flag: '🇨🇩', primaryPort: 'Matadi' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', primaryPort: 'Mombasa' },
  { code: 'TZ', name: 'Tanzanie', flag: '🇹🇿', primaryPort: 'Dar es Salaam' },
  { code: 'UG', name: 'Ouganda', flag: '🇺🇬', primaryPort: 'Mombasa (Transit)' },
  { code: 'ZM', name: 'Zambie', flag: '🇿🇲', primaryPort: 'Dar es Salaam (Transit)' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', primaryPort: 'Luanda' },
  { code: 'CG', name: 'Congo-Brazzaville', flag: '🇨🇬', primaryPort: 'Pointe-Noire' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', primaryPort: 'Dar es Salaam (Transit)' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', primaryPort: 'Dar es Salaam (Transit)' },
  { code: 'ZA', name: 'Afrique du Sud', flag: '🇿🇦', primaryPort: 'Durban' },
];

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  readonly currentLang = signal<LanguageCode>('fr');
  readonly currentCurrency = signal<CurrencyCode>('USD');
  readonly currentCountry = signal<string>('CD');

  readonly languages = SUPPORTED_LANGUAGES;
  readonly currencies = Object.values(CURRENCIES);
  readonly countries = DESTINATION_COUNTRIES;

  readonly selectedCountry = computed(() => {
    return this.countries.find((c) => c.code === this.currentCountry()) ?? this.countries[0];
  });

  readonly selectedCurrencyConfig = computed(() => {
    return CURRENCIES[this.currentCurrency()];
  });

  setLanguage(lang: LanguageCode) {
    this.currentLang.set(lang);
  }

  setCurrency(curr: CurrencyCode) {
    this.currentCurrency.set(curr);
  }

  setCountry(countryCode: string) {
    this.currentCountry.set(countryCode);
  }

  /**
   * Translate key with reactive lookup
   */
  t(key: string): string {
    const lang = this.currentLang();
    const dictionary = TRANSLATIONS[lang] ?? TRANSLATIONS.fr;
    return dictionary[key] ?? TRANSLATIONS.en[key] ?? key;
  }

  /**
   * Convert and format price according to selected currency
   */
  formatPrice(priceUsd: number): string {
    const cfg = this.selectedCurrencyConfig();
    const converted = priceUsd * cfg.rateToUsd;

    if (cfg.code === 'CDF') {
      return `${Math.round(converted).toLocaleString('fr-FR')} ${cfg.symbol}`;
    }
    if (cfg.code === 'JPY') {
      return `${cfg.symbol}${Math.round(converted).toLocaleString('ja-JP')}`;
    }
    return `${cfg.symbol}${Math.round(converted).toLocaleString('en-US')}`;
  }
}
