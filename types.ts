
export interface FormData {
  vin: string;
  mileage: number;
  powertrainCondition: string;
  hasTitle: string;
  hasCatalytic: string;
  hasAluminumWheels: string;
  hasBattery: string;
  needsTowing: string;
  hasKey: string;
  sellerName: string;
  sellerEmail: string;
  sellerPhone: string;
  sellerAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface Deduction {
  reason: string;
  amount: number;
}

export interface QuoteData {
  vehicle_year: number;
  vehicle_make: string;
  vehicle_model: string;
  gross_vehicle_value: number;
  total_deductions: number;
  final_vehicle_value: number;
  deductions: Deduction[];
}

export interface ToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'info';
}

export enum AppState {
  INITIAL = 'INITIAL',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
