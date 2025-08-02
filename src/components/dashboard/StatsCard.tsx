import React from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface StatsCardProps {
  title: string;
  amount: number;
  type: 'income' | 'expense' | 'net';
  previousAmount?: number;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  amount, 
  type, 
  previousAmount = 0 
}) => {
  const getIcon = () => {
    switch (type) {
      case 'income':
        return <TrendingUp className="w-6 h-6 text-green-600" />;
      case 'expense':
        return <TrendingDown className="w-6 h-6 text-red-600" />;
      default:
        return <DollarSign className="w-6 h-6 text-blue-600" />;
    }
  };

  const getCardColor = () => {
    switch (type) {
      case 'income':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'expense':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return amount >= 0 
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }
  };

  const getAmountColor = () => {
    switch (type) {
      case 'income':
        return 'text-green-600 dark:text-green-400';
      case 'expense':
        return 'text-red-600 dark:text-red-400';
      default:
        return amount >= 0 
          ? 'text-blue-600 dark:text-blue-400'
          : 'text-red-600 dark:text-red-400';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  const change = previousAmount !== 0 ? ((amount - previousAmount) / previousAmount) * 100 : 0;

  return (
    <div className={`p-6 rounded-xl border ${getCardColor()} transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {title}
        </h3>
        {getIcon()}
      </div>
      
      <div className="space-y-2">
        <p className={`text-2xl font-bold ${getAmountColor()}`}>
          {type === 'expense' || amount < 0 ? '-' : ''}
          {formatCurrency(amount)}
        </p>
        
        {previousAmount !== 0 && (
          <div className="flex items-center space-x-1">
            <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? '+' : ''}{change.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
};