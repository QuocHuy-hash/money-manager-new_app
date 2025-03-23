import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getFirstDayOfMonth, getLastDayOfMonth, getTimeFromStartOfYearToNow } from '@/utils/format';

interface DateRangeState {
  fromDate: string;
  toDate: string;
  selectedMonth: number;
}

const initialState: DateRangeState = {
  fromDate: getFirstDayOfMonth().toISOString(),
  toDate: getLastDayOfMonth().toISOString(),
  selectedMonth: new Date().getMonth(),
};

const dateRangeSlice = createSlice({
  name: 'dateRange',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ fromDate: Date; toDate: Date }>) => {
      state.fromDate = action.payload.fromDate.toISOString();
      state.toDate = action.payload.toDate.toISOString();
      state.selectedMonth = new Date(action.payload.fromDate).getMonth();
    },
    setSelectedMonth: (state, action: PayloadAction<number>) => {
      state.selectedMonth = action.payload;
      
      const currentYear = new Date().getFullYear();
      const selectedMonthDate = new Date(currentYear, action.payload, 1);
      
      state.fromDate = getFirstDayOfMonth(selectedMonthDate).toISOString();
      state.toDate = getLastDayOfMonth(selectedMonthDate).toISOString();
    },
    resetDateRange: (state) => {
      state.fromDate = getFirstDayOfMonth().toISOString();
      state.toDate = getLastDayOfMonth().toISOString();
      state.selectedMonth = new Date().getMonth();
    }
  },
});

export const { setDateRange, setSelectedMonth, resetDateRange } = dateRangeSlice.actions;

export default dateRangeSlice.reducer; 