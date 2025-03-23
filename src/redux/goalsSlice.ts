import {API_URL} from '@/config/api';
import {getHeader} from '@/config/header';
import {Goal, Transaction} from '@/utils/types';
import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from 'axios';

interface GoalsState {
  goals: any;
  monthlySaving: any;
  totalSavingsByMonth: any;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: GoalsState = {
  goals: null,
  monthlySaving: null,
  totalSavingsByMonth: null,
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

// Thunk hiện có
export const getGoals = createAsyncThunk('goals/get-list', async () => {
  return await makeRequest('/goal/get-by-user', 'get');
});

export const getMonthlySaving = createAsyncThunk(
  'goals/get-month-saving',
  async (goalId: number) => {
    return await makeRequest(
      `/goal/get-monthly-saving?goalId=${goalId}`,
      'get',
    );
  },
);

export const createGoals = createAsyncThunk('goals/add', async (data: any) => {
  return await makeRequest('/goal/add', 'post', data);
});

export const updateSavingAmount = createAsyncThunk(
  'goals/update-saving-amount',
  async (data: any) => {
    return await makeRequest('/goal/update', 'post', data);
  },
);

export const delGoal = createAsyncThunk('goals/delete', async (id: Goal) => {
  return await makeRequest(`/goal/delete?id=${id}`, 'post');
});

export const getTotalSavingsByMonth = createAsyncThunk(
  'goals/get-total-by-month',
  async ({month}: {month: string}) => {
    return await makeRequest(`/goal/get-total-by-month?month=${month}`, 'get');
  },
);

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      // Các case hiện có
      .addCase(getGoals.pending, state => {
        state.status = 'loading';
      })
      .addCase(getGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.goals = action.payload;
        state.error = null;
      })
      .addCase(getGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(createGoals.pending, state => {
        state.status = 'loading';
      })
      .addCase(createGoals.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.goals = action.payload;
        state.error = null;
      })
      .addCase(createGoals.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(getMonthlySaving.pending, state => {
        state.status = 'loading';
      })
      .addCase(getMonthlySaving.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthlySaving = action.payload;
        state.error = null;
      })
      .addCase(getMonthlySaving.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(updateSavingAmount.pending, state => {
        state.status = 'loading';
      })
      .addCase(updateSavingAmount.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.monthlySaving = action.payload;
        state.error = null;
      })
      .addCase(updateSavingAmount.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(getTotalSavingsByMonth.pending, state => {
        state.status = 'loading';
      })
      .addCase(getTotalSavingsByMonth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.totalSavingsByMonth = action.payload;
        state.error = null;
      })
      .addCase(getTotalSavingsByMonth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default goalsSlice.reducer;
