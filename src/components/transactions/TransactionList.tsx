import React, { useState } from 'react';
import { Transaction } from '../../types';
import { Edit, Trash2, Calendar, CreditCard, Tag } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  showCategory?: boolean;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEdit,
  onDelete,
  showCategory = true
}) => {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPaymentMode = (transaction: Transaction) => {
    if (transaction.paymentMode === 'both') {
      return `Cash: ${formatCurrency(transaction.cashAmount || 0)}, Online: ${formatCurrency(transaction.onlineAmount || 0)}`;
    }
    return transaction.paymentMode.charAt(0).toUpperCase() + transaction.paymentMode.slice(1);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    onEdit(transaction);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                {showCategory && (
                  <th className="hidden lg:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                )}
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="hidden lg:table-cell px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {transaction.date.toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 lg:px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.name}
                      </p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                      {/* Show category and payment mode on smaller tablets */}
                      {showCategory && (
                        <div className="lg:hidden flex items-center space-x-1 mt-1">
                          <Tag className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{transaction.category}</span>
                        </div>
                      )}
                      <div className="lg:hidden flex items-center space-x-1 mt-1">
                        <CreditCard className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {transaction.paymentMode === 'both' ? 'Cash+Online' : transaction.paymentMode}
                        </span>
                      </div>
                    </div>
                  </td>

                  {showCategory && (
                    <td className="hidden lg:table-cell px-4 lg:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {transaction.category}
                        </span>
                      </div>
                    </td>
                  )}

                  <td className="px-4 lg:px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${
                      transaction.type === 'income'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {formatCurrency(transaction.totalAmount)}
                    </span>
                  </td>

                  <td className="hidden lg:table-cell px-4 lg:px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatPaymentMode(transaction)}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 lg:px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(transaction)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded transition-colors"
                        title="Edit transaction"
                        type="button"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className={`p-1 rounded transition-colors ${
                          deleteConfirm === transaction.id
                            ? 'text-red-700 bg-red-100 dark:bg-red-900/30'
                            : 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                        }`}
                        title={deleteConfirm === transaction.id ? 'Click again to confirm' : 'Delete transaction'}
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 truncate">
                  {transaction.name}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{transaction.date.toLocaleDateString()}</span>
                </div>
              </div>
              <span className={`text-lg font-semibold ml-2 ${
                transaction.type === 'income'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {transaction.type === 'expense' ? '-' : '+'}
                {formatCurrency(transaction.totalAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                transaction.type === 'income'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
              </span>
              
              {showCategory && (
                <div className="flex items-center space-x-1">
                  <Tag className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate max-w-[120px]">{transaction.category}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <CreditCard className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                  {transaction.paymentMode === 'both' ? 'Cash+Online' : transaction.paymentMode.charAt(0).toUpperCase() + transaction.paymentMode.slice(1)}
                </span>
              </div>
              
              <div className="flex items-center space-x-3 ml-2">
                <button
                  onClick={() => handleEdit(transaction)}
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 transition-colors"
                  title="Edit transaction"
                  type="button"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    deleteConfirm === transaction.id
                      ? 'text-red-700 bg-red-200 dark:bg-red-900/50'
                      : 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 bg-red-50 dark:bg-red-900/30'
                  }`}
                  title={deleteConfirm === transaction.id ? 'Tap again to confirm' : 'Delete transaction'}
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {transaction.paymentMode === 'both' && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Cash:</span>
                    <span>{formatCurrency(transaction.cashAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Online:</span>
                    <span>{formatCurrency(transaction.onlineAmount || 0)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};