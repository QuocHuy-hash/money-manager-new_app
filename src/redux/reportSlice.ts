import {API_URL} from '@/config/api';
import {getHeader} from '@/config/header';
import {Goal, Transaction} from '@/utils/types';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

interface ReportState {
  dailyReport: any;
  summaryReport: any;
  goalsReport: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: ReportState = {
  dailyReport: null,
  summaryReport: null,
  goalsReport: null,
  status: 'idle',
  error: null,
};

const makeRequest = async (
  url: string,
  method: 'get' | 'post',
  data?: Goal,
) => {
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
  }
};
export const getSummaryReport = createAsyncThunk(
  'report/summary',
  async (data: {startDate: string; endDate: string; type: number}) => {
    return await makeRequest(
      `/report/expense-summary?startDate=${data.startDate}&endDate=${data.endDate}&type=${data.type}`,
      'get',
    );
  },
);
export const getGoalReport = createAsyncThunk(
  'report/goals',
  async (goalId: number) => {
    return await makeRequest(`/report/goal?goalId=${goalId}`, 'get');
  },
);
const reportSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getSummaryReport.pending, state => {
        state.status = 'loading';
      })
      .addCase(getSummaryReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summaryReport = action.payload;
        state.error = null;
      })
      .addCase(getSummaryReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(getGoalReport.pending, state => {
        state.status = 'loading';
      })
      .addCase(getGoalReport.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.goalsReport = action.payload;
        state.error = null;
      })
      .addCase(getGoalReport.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default reportSlice.reducer;
