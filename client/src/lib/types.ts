// Common types used throughout the application

export interface DashboardData {
  totalSales: number;
  inventoryValue: number;
  totalProfit: number;
  lowStockCount: number;
  recentSales: any[];
  lowStockProducts: any[];
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: any;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
}

export interface ProductFormValues {
  name: string;
  sku: string;
  category: string;
  price: string;
  cost: string;
  stock: number;
  description: string;
}

export interface SaleFormValues {
  productId: number;
  quantity: number;
  price: string;
  total: string;
}

export type ProductStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export type UserRole = 'admin' | 'staff';
