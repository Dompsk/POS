export interface Product {
  id: string;
  name: string;
  nameEn?: string;
  category: string;
  price: number;
  costPrice?: number;
  stock: number;
  barcode: string;
  image?: string;
  emoji?: string;
  isPopular?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  iconName: string;
  count?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
  selectedOptions?: string[];
}

export type OrderType = 'dine_in' | 'takeaway' | 'delivery';

export type PaymentMethod = 'cash' | 'promptpay' | 'credit_card';

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  vat: number;
  total: number;
  orderType: OrderType;
  paymentMethod?: PaymentMethod;
  amountReceived?: number;
  change?: number;
  status: 'completed' | 'held' | 'cancelled';
  createdAt: string;
  cashierName: string;
}

export type ActiveView = 'pos' | 'inventory' | 'orders' | 'reports' | 'settings';
