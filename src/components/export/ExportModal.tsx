import React, { useState } from 'react';
import { Transaction, ExportOptions } from '../../types';
import { exportToExcel } from '../../utils/exportUtils';
import { EXPORT_COLUMNS, CATEGORIES } from '../../utils/constants';
import { Download, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  transactions
}) => {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'date', 'type', 'category', 'name', 'totalAmount', 'paymentMode'
  ]);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleColumnToggle = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column');
      return;
    }

    setLoading(true);
    try {
      const options: ExportOptions = {
        columns: selectedColumns,
      };

      if (dateRange.start && dateRange.end) {
        options.dateRange = {
          start: new Date(dateRange.start),
          end: new Date(dateRange.end)
        };
      }

      if (selectedCategories.length > 0) {
        options.categories = selectedCategories;
      }

      exportToExcel(transactions, options);
      toast.success('Export completed successfully!');
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const availableCategories = Array.from(
    new Set(transactions.map(t => t.category))
  ).sort();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Export to Excel
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Column Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Select Columns
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {EXPORT_COLUMNS.map(column => (
                  <label
                    key={column.value}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.value)}
                      onChange={() => handleColumnToggle(column.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {column.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Date Range (Optional)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter */}
            {availableCategories.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Categories (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {availableCategories.map(category => (
                    <label
                      key={category}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {category}
                      </span>
                    </label>
                  ))}
                </div>
                {selectedCategories.length > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {selectedCategories.length} categories selected
                  </p>
                )}
              </div>
            )}

            {/* Export Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Export Summary
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• {selectedColumns.length} columns selected</li>
                <li>• {transactions.length} total transactions</li>
                {dateRange.start && dateRange.end && (
                  <li>• Date range: {dateRange.start} to {dateRange.end}</li>
                )}
                {selectedCategories.length > 0 && (
                  <li>• {selectedCategories.length} categories filtered</li>
                )}
              </ul>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={loading || selectedColumns.length === 0}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};