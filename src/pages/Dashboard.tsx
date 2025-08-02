import React, { useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Chart } from '../components/dashboard/Chart';
import { TransactionList } from '../components/transactions/TransactionList';
import { Transaction } from '../types';

export const Dashboard: React.FC = () => {
  const { transactions, loading } = useTransactions();

  const stats = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.totalAmount, 0);
    
    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    return {
      totalIncome,
      totalExpenses,
      netAmount: totalIncome - totalExpenses,
      transactionCount: transactions.length
    };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 5);
  }, [transactions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Income"
          amount={stats.totalIncome}
          type="income"
        />
        <StatsCard
          title="Total Expenses"
          amount={stats.totalExpenses}
          type="expense"
        />
        <StatsCard
          title="Net Amount"
          amount={stats.netAmount}
          type="net"
        />
      </div>

      {/* Charts */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Chart
            transactions={transactions}
            type="bar"
            title="Income vs Expense (Monthly)"
          />
          <Chart
            transactions={transactions}
            type="doughnut"
            title="Category Breakdown"
          />
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          {transactions.length > 5 && (
            <a
              href="/categories"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
            >
              View all
            </a>
          )}
        </div>
        <TransactionList
          transactions={recentTransactions}
          onEdit={() => {}}
          onDelete={() => {}}
          showCategory={true}
        />
      </div>

      {/* Trend Chart */}
      {transactions.length > 0 && (
        <Chart
          transactions={transactions}
          type="line"
          title="Daily Net Amount Trend (Last 30 Days)"
        />
      )}
    </div>
  );
};