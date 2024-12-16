import { API_URL } from "@/config/api";
import { getHeader } from "@/config/header";
import { FixedExpense } from "@/utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Interface for the state
interface FixedExpenseState {
    expense: FixedExpense | null;
    expenseList: FixedExpense[] | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: FixedExpenseState = {
    expense: null,
    expenseList: null,
    status: 'idle',
    error: null,
};

// Helper function to handle API requests
const handleApiRequest = async (url: string, method: 'get' | 'post', data?: any) => {
    try {
        const headers = await getHeader();
        if (!headers) {throw new Error('Failed to get headers');}
        const response = await axios({
            url: `${API_URL}${url}`,
            method: method,
            data,
            headers,
        });

        return response.data.message.metadata;
    } catch (error) {
        console.log('Error:', error);
    }
};

// Thunks for async actions
export const addFixedExpense = createAsyncThunk("expense/add", async (newFixedExpense: FixedExpense) => {
    return await handleApiRequest("/fixed-expense/add", 'post', { data: newFixedExpense });
});

export const updateFixedExpense = createAsyncThunk("expense/update", async (updatedFixedExpense: FixedExpense) => {
    return await handleApiRequest("/fixed-expense/update", 'post', { data: updatedFixedExpense });
});

export const deleteFixedExpense = createAsyncThunk("expense/delete", async (id: number) => {
    return await handleApiRequest("/fixed-expense/delete", 'post', { id });
});

export const getFixedExpense = createAsyncThunk("expense/get-list", async (data: { startDate: string; endDate: string }) => {
    return await handleApiRequest(`/fixed-expense/get-list?startDate=${data.startDate}&endDate=${data.endDate}`, 'get');
});

// Slice to manage state
const fixExpenseSlice = createSlice({
    name: 'fixedExpense',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFixedExpense.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getFixedExpense.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.expenseList = action.payload;
                state.error = null;
            })
            .addCase(getFixedExpense.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(addFixedExpense.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(addFixedExpense.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.expenseList = action.payload;
                state.error = null;
            })
            .addCase(addFixedExpense.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(updateFixedExpense.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateFixedExpense.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.expenseList = action.payload;
                state.error = null;
            })
            .addCase(updateFixedExpense.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(deleteFixedExpense.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteFixedExpense.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.expenseList = action.payload;
                state.error = null;
            })
            .addCase(deleteFixedExpense.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    },
});

export default fixExpenseSlice.reducer;
