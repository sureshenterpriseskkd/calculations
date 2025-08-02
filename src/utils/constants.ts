export const CATEGORIES = [
  'Family',
  'Work',
  'Travel',
  'Food & Dining',
  'Shopping',
  'Health & Medical',
  'Education',
  'Entertainment',
  'Transportation',
  'Utilities',
  'Investment',
  'Charity',
  'Others'
];

export const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'online', label: 'Online' },
  { value: 'both', label: 'Both (Cash + Online)' }
];

export const EXPORT_COLUMNS = [
  { value: 'date', label: 'Date' },
  { value: 'type', label: 'Type (Income/Expense)' },
  { value: 'category', label: 'Category' },
  { value: 'name', label: 'Name/Description' },
  { value: 'totalAmount', label: 'Total Amount' },
  { value: 'paymentMode', label: 'Payment Mode' },
  { value: 'cashAmount', label: 'Cash Amount' },
  { value: 'onlineAmount', label: 'Online Amount' }
];