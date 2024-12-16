import { API_URL } from "@/config/api";
import { getHeader } from "@/config/header";
import { Transaction } from "@/utils/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface TransactionState {
    transaction: any;
    transactionList: any;
    transactionByCategory: any;
    transactionSummary: any;
    categoryList: any;
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
    status: 'idle',
    error: null,
};
const makeRequest = async (url: string, method: 'get' | 'post', data?: any) => {
    try {
        const headers = await getHeader();
        if (!headers) {throw new Error('Failed to get headers');}

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

// Async Thunks for Transaction Operations
export const addTransaction = createAsyncThunk("transaction/add", async (newTransaction: Transaction) => {
    return await makeRequest("/transaction/add", 'post', { data: newTransaction });
});

export const getTransactions = createAsyncThunk("transaction/get-list", async (data: { startDate: string, endDate: string }) => {
    return await makeRequest(`/transaction/get-list?startDate=${data.startDate}&endDate=${data.endDate}`, 'get');
});

export const getTransactionsSummary = createAsyncThunk("transaction/get-list-summary", async (data: { startDate: string, endDate: string }) => {
    return await makeRequest(`/transaction/get-list-summary?startDate=${data.startDate}&endDate=${data.endDate}`, 'get');
});

export const getTransactionCategorys = createAsyncThunk("transaction/get-categorys", async () => {
    return await makeRequest("/transaction/get-categorys", 'get');
});
export const getTransactionByCategorys = createAsyncThunk("transaction/get-by-category", async ({ startDate, endDate, categoryId }: { startDate: string, endDate: string, categoryId: number }) => {
    return await makeRequest(`/transaction/get-by-category?startDate=${startDate}&endDate=${endDate}&categoryId=${categoryId}`, 'get');
});
const transactionSlice = createSlice({
    name: 'bankaccount',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(addTransaction.pending, (state) => {
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
            }).addCase(getTransactionCategorys.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTransactionCategorys.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categoryList = action.payload;
                state.error = null;
            })
            .addCase(getTransactionCategorys.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            }).addCase(getTransactionsSummary.pending, (state) => {
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
            }).addCase(getTransactions.pending, (state) => {
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
            }).addCase(getTransactionByCategorys.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getTransactionByCategorys.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.transactionByCategory = action.payload;
                state.error = null;
            })
            .addCase(getTransactionByCategorys.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });

    },
});


export default transactionSlice.reducer;
