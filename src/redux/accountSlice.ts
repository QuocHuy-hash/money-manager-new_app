import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
    token: string | null;
    user: string | null;
    bankinfo: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: UserState = {
    token: null,
    user: null,
    bankinfo: null,
    status: 'idle',
    error: null,
};

export const getInBankAccountInfo = createAsyncThunk("bankaccount/info", async () => {
    try {
        const response = await axios.get('https://oauth.casso.vn/v2/userInfo', {
            headers: { Authorization: 'Apikey AK_CS.b72572706bfc11ef9eef9daee9cc4b4e.AL0Ek1I7xDfcsFe7gDHGlQ4CNSqRNUmKhuIW9IzSVR4i0ACYmZYjk008UVjui3KlrkPVIdrJ' },
        });

        return response.data;
    } catch (error: any) {
        throw new Error('get info failed', error.message);

    }
});

const bankaccountSlice = createSlice({
    name: 'bankaccount',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getInBankAccountInfo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getInBankAccountInfo.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bankinfo = action.payload;
                state.error = null;
            })
            .addCase(getInBankAccountInfo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });

    },
});


export default bankaccountSlice.reducer;
