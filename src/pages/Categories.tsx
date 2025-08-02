import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionList } from '../components/transactions/TransactionList';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Transaction, CategoryStats } from '../types';
import { ChevronRight, Plus, Minus, TrendingUp, TrendingDown } from 'lucide-react';

export const Categories: React.FC = () => {
  const { transactions, updateTransaction, deleteTransaction } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const categoryStats = useMemo(() => {
    const stats = transactions.reduce((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = {
          category: transaction.category,
          income: 0,
          expense: 0,
          total: 0,
          count: 0
        };
      }

      acc[transaction.category][transaction.type] += transaction.totalAmount;
      acc[transaction.category].count += 1;

      return acc;
    }, {} as Record<string, CategoryStats>);

    // Calculate totals and sort by total amount
    return Object.values(stats)
      .map(stat => ({
        ...stat,
        total: stat.income - stat.expense
      }))
      .sort((a, b) => (b.income + b.expense) - (a.income + a.expense));
  }, [transactions]);

  const selectedCategoryTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    return transactions
      .filter(t => t.category === selectedCategory)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [transactions, selectedCategory]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

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

  if (editingTransaction) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setEditingTransaction(null)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium mb-2"
          >
            ← Back to Categories
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

  if (selectedCategory) {
    const categoryData = categoryStats.find(c => c.category === selectedCategory);
    
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Categories
          </button>
          <ChevronRight className="w-4 h-4" />
          <span>{selectedCategory}</span>
        </div>

        {categoryData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {selectedCategory} Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">
                    Income
                  </span>
                </div>
                <p className="text-lg font-bold text-green-700 dark:text-green-300 mt-1">
                  {formatCurrency(categoryData.income)}
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Minus className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    Expense
                  </span>
                </div>
                <p className="text-lg font-bold text-red-700 dark:text-red-300 mt-1">
                  {formatCurrency(categoryData.expense)}
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                categoryData.total >= 0 
                  ? 'bg-blue-50 dark:bg-blue-900/20' 
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                <div className="flex items-center space-x-2">
                  {categoryData.total >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${
                    categoryData.total >= 0 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    Net
                  </span>
                </div>
                <p className={`text-lg font-bold mt-1 ${
                  categoryData.total >= 0 
                    ? 'text-blue-700 dark:text-blue-300' 
                    : 'text-red-700 dark:text-red-300'
                }`}>
                  {categoryData.total >= 0 ? '' : '-'}{formatCurrency(categoryData.total)}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Transactions
                  </span>
                </div>
                <p className="text-lg font-bold text-gray-700 dark:text-gray-300 mt-1">
                  {categoryData.count}
                </p>
              </div>
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Transactions in {selectedCategory}
          </h3>
          <TransactionList
            transactions={selectedCategoryTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showCategory={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage transactions by category
        </p>
      </div>

      {categoryStats.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No transactions found. Add your first transaction to see categories.
          </p>
          <a
            href="/add"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryStats.map((category) => (
            <div
              key={category.category}
              onClick={() => setSelectedCategory(category.category)}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-md transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {category.category}
                </h3>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-600 dark:text-green-400">Income</span>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    {formatCurrency(category.income)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-600 dark:text-red-400">Expense</span>
                  <span className="font-medium text-red-700 dark:text-red-300">
                    {formatCurrency(category.expense)}
                  </span>
                </div>

                <hr className="border-gray-200 dark:border-gray-600" />

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Net
                  </span>
                  <span className={`font-bold ${
                    category.total >= 0 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {category.total >= 0 ? '' : '-'}{formatCurrency(category.total)}
                  </span>
                </div>

                <div className="text-center pt-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {category.count} transactions
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};