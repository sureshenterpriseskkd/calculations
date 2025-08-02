import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Transaction } from '../../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  transactions: Transaction[];
  type: 'bar' | 'doughnut' | 'line';
  title: string;
}

export const Chart: React.FC<ChartProps> = ({ transactions, type, title }) => {
  const generateChartData = () => {
    if (type === 'bar') {
      // Monthly income vs expense
      const monthlyData = transactions.reduce((acc, transaction) => {
        const month = transaction.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        if (!acc[month]) {
          acc[month] = { income: 0, expense: 0 };
        }
        acc[month][transaction.type] += transaction.totalAmount;
        return acc;
      }, {} as Record<string, { income: number; expense: number }>);

      const labels = Object.keys(monthlyData).slice(-6); // Last 6 months
      
      return {
        labels,
        datasets: [
          {
            label: 'Income',
            data: labels.map(month => monthlyData[month]?.income || 0),
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 1,
          },
          {
            label: 'Expense',
            data: labels.map(month => monthlyData[month]?.expense || 0),
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
          },
        ],
      };
    }

    if (type === 'doughnut') {
      // Category-wise breakdown
      const categoryData = transactions.reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.totalAmount;
        return acc;
      }, {} as Record<string, number>);

      const colors = [
        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
        '#F97316', '#06B6D4', '#84CC16', '#EC4899', '#6B7280'
      ];

      return {
        labels: Object.keys(categoryData),
        datasets: [
          {
            data: Object.values(categoryData),
            backgroundColor: colors.slice(0, Object.keys(categoryData).length),
            borderColor: colors.slice(0, Object.keys(categoryData).length),
            borderWidth: 2,
          },
        ],
      };
    }

    if (type === 'line') {
      // Daily trend for the last 30 days
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        return date;
      });

      const dailyData = last30Days.map(date => {
        const dayTransactions = transactions.filter(t => 
          t.date.toDateString() === date.toDateString()
        );
        const income = dayTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + t.totalAmount, 0);
        const expense = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + t.totalAmount, 0);
        
        return {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          net: income - expense
        };
      });

      return {
        labels: dailyData.map(d => d.date),
        datasets: [
          {
            label: 'Net Amount',
            data: dailyData.map(d => d.net),
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      };
    }

    return { labels: [], datasets: [] };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: title,
        padding: { top: 10, bottom: 15 },
        font: {
          size: window.innerWidth < 640 ? 14 : 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: window.innerWidth < 640 ? 10 : 12,
          },
          callback: function(value: any) {
            const formattedValue = new Intl.NumberFormat('en-IN', {
              notation: window.innerWidth < 640 ? 'compact' : 'standard',
              compactDisplay: 'short'
            }).format(value);
            return '₹' + formattedValue;
          },
        },
      },
    } : undefined,
  };

  const chartData = generateChartData();

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="h-64 sm:h-80">
        {type === 'bar' && <Bar data={chartData} options={options} />}
        {type === 'doughnut' && <Doughnut data={chartData} options={options} />}
        {type === 'line' && <Line data={chartData} options={options} />}
      </div>
    </div>
  );
};