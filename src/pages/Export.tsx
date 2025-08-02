import React, { useState } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { ExportModal } from '../components/export/ExportModal';
import { Download, FileSpreadsheet, Filter } from 'lucide-react';

export const Export: React.FC = () => {
  const { transactions } = useTransactions();
  const [showExportModal, setShowExportModal] = useState(false);

  const totalTransactions = transactions.length;
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.totalAmount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.totalAmount, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Export Data
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Export your transaction data to Excel with customizable options
        </p>
      </div>

      {/* Export Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {totalTransactions}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Transactions
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <div className="text-green-600 dark:text-green-400 font-bold text-lg">₹</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(totalIncome)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Income
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <div className="text-red-600 dark:text-red-400 font-bold text-lg">₹</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(totalExpenses)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Expenses
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Export Options
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Available Features
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Select specific columns to export</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Filter by date range</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Filter by categories</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Formatted Excel output</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Include payment mode breakdowns</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Export Formats
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="w-8 h-8 text-green-600" />
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      Microsoft Excel (.xlsx)
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Compatible with Excel, Google Sheets, and other spreadsheet applications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowExportModal(true)}
              disabled={totalTransactions === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Export to Excel</span>
            </button>

            <button className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Advanced Filters</span>
            </button>
          </div>

          {totalTransactions === 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                No transactions available to export. Add some transactions first to use the export feature.
              </p>
            </div>
          )}
        </div>
      </div>

      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        transactions={transactions}
      />
    </div>
  );
};