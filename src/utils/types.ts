export interface Transaction {
  id: number;
  amount: string;
  title: string;
  transaction_date: Date;
  transaction_type: string;
  category_id: number;
  description: string;
}
export interface CategoryItem {
  id: number;
  title: string;
  name: string;
  amount: string;
}

export interface TransactionStatsType {
  income: number;
  expense: number;
  savings: number;
  totalSavings: number;
}
export interface FixedExpense {
  id: number;
  category_id: number;
  description: string;
  start_date: string;
  end_date: string;
  amount: string;
  name: string;
  frequency: string;
}
export interface InfoViewProps {
  firstName: string;
  lastName: string;
  email: string;
  phone_number: string;
  user_name: string;
  status: string;
  verify: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface UserState {
  token: string | null;
  user: string | null;
  info: any | null;
  users: string | null;
  avatar: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}
export interface Goal {
  id: number;
  user_id: number;
  name: string;
  target_amount: number;
  current_amount: number;
  deadline: Date;
  monthly_saving_amount: number;
  missed_saving_amount: number;
  updated_saving_date: Date;
  reminder_day: number;
  createdAt: string;
  status: 'active' | 'inactive';
}
interface ReportData {
  amount_saved: number;
  month: string;
  percentage_of_goal: number;
}

interface GoalProgressData {
  currentAmount: string;
  goalName: string;
  reportData: ReportData[];
  targetAmount: string;
  totalSaved: number;
}
export interface ImageUploadData {
  uri: string;
  type: string;
  name: string;
}

//yearly data
export type YearlyFinancialData = {
  months: string[];
  income: number[];
  expenses: number[];
  savings: number[];
  categoryBreakdown: {
    [key: string]: number;
  };
  // Yearly totals
  yearlyTotals: {
    totalIncome: number;
    totalExpenses: number;
    totalSavings: number;
  };
};

// Nếu bạn muốn giữ dạng mảng như mẫu của bạn
export const mockYearlyTypes: YearlyFinancialData[] = [
  {
    months: [],
    income: [],
    expenses: [],
    savings: [],
    categoryBreakdown: {},
    yearlyTotals: {
      totalIncome: 0,
      totalExpenses: 0,
      totalSavings: 0,
    },
  },
];
export const types = [
  {id: 1, name: 'Chi tiêu'},
  {id: 2, name: 'Thu nhập'},
  {id: 3, name: 'Tiết kiệm'},
];

export const frequencyOptions = [
  {label: 'Ngày', value: 'daily'},
  {label: 'Tuần', value: 'weekly'},
  {label: 'Tháng', value: 'monthly'},
  {label: 'Quý', value: 'quarterly'},
  {label: 'Năm', value: 'annually'},
];
