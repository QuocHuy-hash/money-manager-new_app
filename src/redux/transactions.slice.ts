import {API_URL} from '@/config/api';
import {getHeader} from '@/config/header';
import {Transaction} from '@/utils/types';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

interface TransactionState {
  transaction: any;
  transactionList: any;
  transactionByCategory: any;
  transactionSummary: any;
  categoryList: any;
  monthlySavings: any; // Lịch sử tiết kiệm hàng tháng
  goalReport: any; // Báo cáo mục tiêu tài chính
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: TransactionState = {
  transaction: null,
  transactionList: null,
  transactionByCategory: null,
  transactionSummary: null,
  categoryList: null,
  monthlySavings: null,
  goalReport: null,
  status: 'idle',
  error: null,
};

const makeRequest = async (url: string, method: 'get' | 'post', data?: any) => {
  try {
    const headers = await getHeader();
    if (!headers) {
      throw new Error('Failed to get headers');
    }

    const response = await axios({
      url: `${API_URL}${url}`,
      method,
      data,
      headers,
    });

    return response.data.message.metadata;
  } catch (error) {
    console.log('Error:', error);
    throw error;
  }
};

// Async Thunks for Transaction Operations
export const addTransaction = createAsyncThunk(
  'transaction/add',
  async (newTransaction: Transaction) => {
    return await makeRequest('/transaction/add', 'post', {
      data: newTransaction,
    });
  },
);

export const getTransactions = createAsyncThunk(
  'transaction/get-list',
  async (data: {startDate: string; endDate: string}) => {
    return await makeRequest(
      `/transaction/get-list?startDate=${data.startDate}&endDate=${data.endDate}`,
      'get',
    );
  },
);

export const getTransactionsSummary = createAsyncThunk(
  'transaction/get-list-summary',
  async (data: {startDate: string; endDate: string}) => {
    return await makeRequest(
      `/transaction/get-list-summary?startDate=${data.startDate}&endDate=${data.endDate}`,
      'get',
    );
  },
);

export const getTransactionCategories = createAsyncThunk(
  'transaction/get-categories',
  async () => {
    return await makeRequest('/transaction/get-categories', 'get');
  },
);

export const getTransactionByCategories = createAsyncThunk(
  'transaction/get-by-category',
  async ({
    startDate,
    endDate,
    categoryId,
  }: {
    startDate: string;
    endDate: string;
    categoryId: number;
  }) => {
    return await makeRequest(
      `/transaction/get-by-category?startDate=${startDate}&endDate=${endDate}&categoryId=${categoryId}`,
      'get',
    );
  },
);

export const getGoalReport = createAsyncThunk(
  'financialGoal/get-report',
  async (goalId: number) => {
    return await makeRequest(`/financial-goal/report/${goalId}`, 'get');
  },
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Transaction Thunks
      .addCase(addTransaction.pending, state => {
        state.status = 'loading';
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactionList = action.payload;
        state.error = null;
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(getTransactions.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactionList = action.payload;
        state.error = null;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(getTransactionsSummary.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTransactionsSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactionSummary = action.payload;
        state.error = null;
      })
      .addCase(getTransactionsSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(getTransactionCategories.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTransactionCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categoryList = action.payload;
        state.error = null;
      })
      .addCase(getTransactionCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(getTransactionByCategories.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTransactionByCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactionByCategory = action.payload;
        state.error = null;
      })
      .addCase(getTransactionByCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(getGoalReport.pending, state => {
        state.status = 'loading';
      })
      .addCase(getGoalReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.goalReport = action.payload;
        state.error = null;
      })
      .addCase(getGoalReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default transactionSlice.reducer;
