import * as XLSX from 'xlsx';
import { Transaction, ExportOptions } from '../types';

export const exportToExcel = (transactions: Transaction[], options: ExportOptions) => {
  let filteredTransactions = [...transactions];

  // Filter by date range if specified
  if (options.dateRange) {
    filteredTransactions = filteredTransactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= options.dateRange!.start && 
             transactionDate <= options.dateRange!.end;
    });
  }

  // Filter by categories if specified
  if (options.categories && options.categories.length > 0) {
    filteredTransactions = filteredTransactions.filter(transaction => 
      options.categories!.includes(transaction.category)
    );
  }

  // Map transactions to export format
  const exportData = filteredTransactions.map(transaction => {
    const row: any = {};
    
    if (options.columns.includes('date')) {
      row['Date'] = transaction.date.toLocaleDateString();
    }
    if (options.columns.includes('type')) {
      row['Type'] = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
    }
    if (options.columns.includes('category')) {
      row['Category'] = transaction.category;
    }
    if (options.columns.includes('name')) {
      row['Name/Description'] = transaction.name;
    }
    if (options.columns.includes('totalAmount')) {
      row['Total Amount'] = transaction.totalAmount;
    }
    if (options.columns.includes('paymentMode')) {
      row['Payment Mode'] = transaction.paymentMode.charAt(0).toUpperCase() + 
                           transaction.paymentMode.slice(1);
    }
    if (options.columns.includes('cashAmount') && transaction.cashAmount) {
      row['Cash Amount'] = transaction.cashAmount;
    }
    if (options.columns.includes('onlineAmount') && transaction.onlineAmount) {
      row['Online Amount'] = transaction.onlineAmount;
    }

    return row;
  });

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(exportData);

  // Add some styling
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  for (let i = range.s.r; i <= range.e.r; i++) {
    for (let j = range.s.c; j <= range.e.c; j++) {
      const cellAddress = XLSX.utils.encode_cell({ r: i, c: j });
      if (!ws[cellAddress]) continue;
      
      // Style header row
      if (i === 0) {
        ws[cellAddress].s = {
          font: { bold: true },
          fill: { fgColor: { rgb: "EEEEEE" } }
        };
      }
    }
  }

  // Set column widths
  ws['!cols'] = options.columns.map(() => ({ width: 15 }));

  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

  // Generate filename with current date
  const fileName = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Save file
  XLSX.writeFile(wb, fileName);
};