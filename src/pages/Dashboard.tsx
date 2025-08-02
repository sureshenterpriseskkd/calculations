import React, { useMemo, useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { StatsCard } from '../components/dashboard/StatsCard';
import { Chart } from '../components/dashboard/Chart';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Transaction } from '../types';

export const Dashboard: React.FC = () => {
  const { transactions, loading, updateTransaction, deleteTransaction } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

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

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleUpdate = async (transactionData: Partial<Transaction>) => {
    if (editingTransaction) {
      await updateTransaction(editingTransaction.id, transactionData);
      setEditingTransaction(null);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteTransaction(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (editingTransaction) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setEditingTransaction(null)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mb-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Edit Transaction
          </h1>
        </div>

        <TransactionForm
          initialData={editingTransaction}
          onSubmit={handleUpdate}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          {transactions.length > 5 && (
            <a
              href="/categories"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium self-start sm:self-auto"
            >
              View all
            </a>
          )}
        </div>
        <TransactionList
          transactions={recentTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
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