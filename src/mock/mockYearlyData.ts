// Mock data for yearly financial report
export const mockYearlyData = {
  // Monthly data for the year 2024
  months: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  // Income data (in thousands VND)
  income: [
    9200, 8500, 9800, 9500, 10500, 10800, 11200, 11000, 10800, 12000, 11500,
    12500,
  ],
  // Expenses data (in thousands VND)
  expenses: [
    7500, 6800, 7200, 8000, 8500, 7800, 8200, 8500, 7900, 8800, 9200, 8500,
  ],
  // Savings data (in thousands VND)
  savings: [
    1700, 1700, 2600, 1500, 2000, 3000, 3000, 2500, 2900, 3200, 2300, 4000,
  ],
  // Category breakdown for the entire year
  categoryBreakdown: {
    'Ăn uống': 37400,
    'Sức khỏe': 19800,
    'Đi lại': 15600,
    'Giải trí': 12800,
    Khác: 10800,
  },
  // Yearly totals
  yearlyTotals: {
    totalIncome: 127300,
    totalExpenses: 96400,
    totalSavings: 30900,
  },
};
