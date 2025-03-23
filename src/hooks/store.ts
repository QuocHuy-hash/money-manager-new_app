import { configureStore } from '@reduxjs/toolkit';
import bankaccountSlice from '../redux/accountSlice';
import usersSlice from '../redux/userSlice';
import transactionsSlice from '../redux/transactions.slice';
import fixExpenseSlice from '../redux/fixedExpenseSlice';
import goalsSlice from '../redux/goalsSlice';
import reportSlice from '../redux/reportSlice';
import homeSlice from '../redux/homeSlice';
import dateRangeSlice from '../redux/dateRangeSlice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            bankaccount: bankaccountSlice,
            users: usersSlice,
            transaction: transactionsSlice,
            fixedExpense: fixExpenseSlice,
            goals: goalsSlice,
            report: reportSlice,
            home: homeSlice,
            dateRange: dateRangeSlice,
        },
    });
};
// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
