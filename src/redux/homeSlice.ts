import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '@/config/api';
import {getHeader} from '@/config/header';

// Các function helper
const makeRequest = async (endpoint: string, method: string, data?: any) => {
  try {
    const headers = await getHeader();
    if (!headers) {
      throw new Error('Failed to get headers');
    }

    const response = await axios({
      url: `${API_URL}${endpoint}`,
      method,
      headers,
      data,
    });

    return response.data.message.metadata;
  } catch (error) {
    console.error(`Error in ${method} request to ${endpoint}:`, error);
    throw error;
  }
};

// Các action async thunk cho Home Screen
export const getHomeTransactionsSummary = createAsyncThunk(
  'home/getTransactionsSummary',
  async (data: {startDate: string; endDate: string}) => {
    return await makeRequest(
      `/transaction/get-list-summary?startDate=${data.startDate}&endDate=${data.endDate}`,
      'get',
    );
  },
);

export const getHomeMonthReport = createAsyncThunk(
  'home/getMonthReport',
  async (data: {startDate: string; endDate: string}) => {
    return await makeRequest(
      `/report/summary?startDate=${data.startDate}&endDate=${data.endDate}`,
      'get',
    );
  },
);

export const getHomeSummaryReport = createAsyncThunk(
  'home/getSummaryReport',
  async (data: {startDate: string; endDate: string; type: number}) => {
    return await makeRequest(
      `/report/expense-summary?startDate=${data.startDate}&endDate=${data.endDate}&type=${data.type}`,
      'get',
    );
  },
);

export const getHomeTransactionByCategories = createAsyncThunk(
  'home/getTransactionByCategories',
  async (data: {startDate: string; endDate: string; categoryId: number}) => {
    return await makeRequest(
      `/transaction/by-category?startDate=${data.startDate}&endDate=${data.endDate}&categoryId=${data.categoryId}`,
      'get',
    );
  },
);

// Định nghĩa interface cho state của Home
interface HomeState {
  transactionSummary: any;
  transactionByCategory: any;
  monthReport: any;
  summaryReport: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Giá trị khởi tạo
const initialState: HomeState = {
  transactionSummary: null,
  transactionByCategory: null,
  monthReport: null,
  summaryReport: null,
  status: 'idle',
  error: null,
};

// Tạo slice cho Home
const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    resetHomeState: state => {
      state.transactionSummary = null;
      state.transactionByCategory = null;
      state.monthReport = null;
      state.summaryReport = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // getHomeTransactionsSummary
      .addCase(getHomeTransactionsSummary.pending, state => {
        state.status = 'loading';
      })
      .addCase(getHomeTransactionsSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactionSummary = action.payload;
      })
      .addCase(getHomeTransactionsSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // getHomeMonthReport
      .addCase(getHomeMonthReport.pending, state => {
        state.status = 'loading';
      })
      .addCase(getHomeMonthReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthReport = action.payload;
      })
      .addCase(getHomeMonthReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // getHomeSummaryReport
      .addCase(getHomeSummaryReport.pending, state => {
        state.status = 'loading';
      })
      .addCase(getHomeSummaryReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summaryReport = action.payload;
      })
      .addCase(getHomeSummaryReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })

      // getHomeTransactionByCategories
      .addCase(getHomeTransactionByCategories.pending, state => {
        state.status = 'loading';
      })
      .addCase(getHomeTransactionByCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.transactionByCategory = action.payload;
      })
      .addCase(getHomeTransactionByCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export const {resetHomeState} = homeSlice.actions;
export default homeSlice.reducer;
