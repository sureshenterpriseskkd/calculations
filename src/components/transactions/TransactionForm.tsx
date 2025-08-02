import React, { useState, useEffect } from 'react';
import { Transaction } from '../../types';
import { CATEGORIES, PAYMENT_MODES } from '../../utils/constants';
import { Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface TransactionFormProps {
  onSubmit: (transaction: Partial<Transaction>) => void;
  initialData?: Transaction;
  loading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  onSubmit,
  initialData,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    name: '',
    totalAmount: '',
    paymentMode: 'cash' as 'cash' | 'online' | 'both',
    cashAmount: '',
    onlineAmount: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        category: initialData.category,
        name: initialData.name,
        totalAmount: initialData.totalAmount.toString(),
        paymentMode: initialData.paymentMode,
        cashAmount: initialData.cashAmount?.toString() || '',
        onlineAmount: initialData.onlineAmount?.toString() || '',
        date: initialData.date.toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle payment mode changes
    if (name === 'paymentMode') {
      if (value !== 'both') {
        setFormData(prev => ({
          ...prev,
          cashAmount: '',
          onlineAmount: ''
        }));
      }
    }

    // Handle total amount changes for 'both' payment mode
    if (name === 'totalAmount' && formData.paymentMode === 'both') {
      const total = parseFloat(value) || 0;
      const cash = parseFloat(formData.cashAmount) || 0;
      const remaining = Math.max(0, total - cash);
      setFormData(prev => ({
        ...prev,
        onlineAmount: remaining.toString()
      }));
    }

    if (name === 'cashAmount' && formData.paymentMode === 'both') {
      const total = parseFloat(formData.totalAmount) || 0;
      const cash = parseFloat(value) || 0;
      const remaining = Math.max(0, total - cash);
      setFormData(prev => ({
        ...prev,
        onlineAmount: remaining.toString()
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const category = showCustomCategory ? customCategory : formData.category;
    if (!category || !formData.name || !formData.totalAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const totalAmount = parseFloat(formData.totalAmount);
    if (isNaN(totalAmount) || totalAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Validate payment mode amounts
    if (formData.paymentMode === 'both') {
      const cashAmount = parseFloat(formData.cashAmount) || 0;
      const onlineAmount = parseFloat(formData.onlineAmount) || 0;
      
      if (cashAmount + onlineAmount !== totalAmount) {
        toast.error('Cash + Online amounts must equal total amount');
        return;
      }
    }

    const transactionData: Partial<Transaction> = {
      type: formData.type,
      category,
      name: formData.name,
      totalAmount,
      paymentMode: formData.paymentMode,
      date: new Date(formData.date),
    };

    if (formData.paymentMode === 'both') {
      transactionData.cashAmount = parseFloat(formData.cashAmount) || 0;
      transactionData.onlineAmount = parseFloat(formData.onlineAmount) || 0;
    }

    onSubmit(transactionData);

    // Reset form if not editing
    if (!initialData) {
      setFormData({
        type: 'expense',
        category: '',
        name: '',
        totalAmount: '',
        paymentMode: 'cash',
        cashAmount: '',
        onlineAmount: '',
        date: new Date().toISOString().split('T')[0],
      });
      setCustomCategory('');
      setShowCustomCategory(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {initialData ? 'Edit Transaction' : 'Add New Transaction'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category *
            </label>
            {!showCustomCategory ? (
              <div className="flex space-x-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required={!showCustomCategory}
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowCustomCategory(true)}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Enter custom category"
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => {
                    setShowCustomCategory(false);
                    setCustomCategory('');
                  }}
                  className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name/Description *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., Birthday Function, Client Meeting"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Total Amount *
            </label>
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Payment Mode *
          </label>
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            {PAYMENT_MODES.map(mode => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>
        </div>

        {formData.paymentMode === 'both' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cash Amount *
              </label>
              <input
                type="number"
                name="cashAmount"
                value={formData.cashAmount}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Online Amount *
              </label>
              <input
                type="number"
                name="onlineAmount"
                value={formData.onlineAmount}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>{initialData ? 'Update Transaction' : 'Add Transaction'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};