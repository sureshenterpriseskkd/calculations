export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  category: string;
  name: string;
  totalAmount: number;
  paymentMode: 'cash' | 'online' | 'both';
  cashAmount?: number;
  onlineAmount?: number;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
}

export interface CategoryStats {
  category: string;
  income: number;
  expense: number;
  total: number;
  count: number;
}

export interface ExportOptions {
  columns: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  categories?: string[];
}