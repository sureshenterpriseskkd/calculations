import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { Transaction } from '../types';

export const AddTransaction: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction } = useTransactions();

  const handleSubmit = async (transactionData: Partial<Transaction>) => {
    // Ensure all required fields are present before calling addTransaction
    if (transactionData.type && transactionData.category && transactionData.name && 
        transactionData.totalAmount !== undefined && transactionData.paymentMode && transactionData.date) {
      await addTransaction(transactionData as Omit<Transaction, 'id' | 'userId' | 'createdAt' | 'updatedAt'>);
      navigate('/');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
          Add New Transaction
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add a new income or expense transaction to track your finances
        </p>
      </div>

      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
};