import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { RootState } from '@/hooks/store';

// Components
import SummaryItemDetails from '@/components/Transactions/SummaryItemDetails';
import VietnameseMonthPicker from '@/components/Calendars/CalendarMonthVN';
import {
  Header,
  BalanceSummaryCard,
  CategoryTabs,
  TransactionSection,
  FloatingActionButton
} from '@/components/Home';

// Utils
import ScaleUtils from '@/utils/ScaleUtils';
import { formatDateUK, getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/format';

// Redux actions
import { getTransactionByCategories, getTransactionsSummary } from '@/redux/transactions.slice';
import { getMonthReport, getSummaryReport } from '@/redux/reportSlice';
import { getTotalSavingsByMonth } from '@/redux/goalsSlice';

const HomeScreen = () => {
  const dispatch = useAppDispatch();

  // Lấy dữ liệu từ Redux store
  const transactionSummaryState = useAppSelector((state: RootState) => state.transaction.transactionSummary);
  const transactionByCategoryState = useAppSelector((state: RootState) => state.transaction.transactionByCategory);

  // Các state quản lý dữ liệu trong component
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
  const [toDate, setToDate] = useState(getLastDayOfMonth());
  const [visibleDetailSummary, setVisibleDetailSummary] = useState(false);
  const [type, setType] = useState('salary');
  const [categories, setCategories] = useState<{ id: number; title: string; name: string; amount: string }[]>([]);
  const [balance, setBalance] = useState('0');
  const [transactionStats, setTransactionStats] = useState({ income: 0, expense: 0, savings: 0, totalSavings: 0 });

  // Fetch dữ liệu khi fromDate hoặc toDate thay đổi
  useEffect(() => {
    const data = {
      startDate: formatDateUK(fromDate),
      endDate: formatDateUK(toDate),
    };
    fetchData(data);
  }, [fromDate, toDate]);

  // Cập nhật khoảng ngày khi tháng thay đổi
  useEffect(() => {
    setFromDate(getFirstDayOfMonth());
    setToDate(getLastDayOfMonth());
  }, [selectedMonth]);

  const fetchData = useCallback(async (data: any) => {
    try {
      // Gọi các action để lấy dữ liệu giao dịch
      await dispatch(getTransactionsSummary(data));
      const reportResponse = await dispatch(getMonthReport(data));
      await dispatch(getSummaryReport({ ...data, type: 1 }));

      // Gọi action để lấy tổng tiết kiệm trong tháng
      const month = `${new Date().getFullYear()}-${String(selectedMonth + 1).padStart(2, '0')}`;
      const savingsResponse = await dispatch(getTotalSavingsByMonth({ month }));

      // Xử lý dữ liệu báo cáo khi nhận được
      if (reportResponse?.meta.requestStatus === 'fulfilled') {
        const reportData = reportResponse.payload;

        const formattedCategories = [
          { id: 1, title: 'Tổng thu', name: 'salary', amount: reportData.salary.toString() },
          { id: 2, title: 'Tổng chi', name: 'expense', amount: reportData.expense.toString() },
        ];

        setCategories(formattedCategories);

        const income = parseFloat(reportData.salary) || 0;
        const expense = parseFloat(reportData.expense) || 0;
        const totalSavings = savingsResponse.payload?.totalSavings || 0;
        const currentBalance = income - (expense + totalSavings);

        setBalance(currentBalance.toString());
        setTransactionStats({
          income,
          expense,
          savings: 0,
          totalSavings,
        });
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tài chính:', error);
    }
  }, [dispatch, selectedMonth]);

  const handleDetailsByCategory = async (item: any) => {
    const data = {
      startDate: formatDateUK(fromDate),
      endDate: formatDateUK(toDate),
      categoryId: item.categoryId
    };
    const res = await dispatch(getTransactionByCategories(data));
    if (res?.meta.requestStatus === "fulfilled") {
      setVisibleDetailSummary(true);
    }
  };

  const handleSelectType = useCallback((name: string) => {
    setType(name);
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    const monthIndex = parseInt(month);
    setSelectedMonth(monthIndex);
  }, []);

  const handleAddTransaction = () => {
    // Handle adding new transaction
    console.log('Add new transaction');
  };

  const handleViewAllTransactions = () => {
    // Handle viewing all transactions
    console.log('View all transactions');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      <Header
        currentMonth={fromDate}
        onSettingsPress={() => console.log('Settings pressed')}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BalanceSummaryCard
          balance={balance}
          income={transactionStats.income}
          expense={transactionStats.expense}
          savings={transactionStats.totalSavings}
        />
        <View style={styles.monthPickerContainer}>
          <VietnameseMonthPicker onChangeMonth={handleMonthChange} />
        </View>
        <CategoryTabs
          categories={categories}
          selectedType={type}
          onSelectType={handleSelectType}
        />
        <TransactionSection
          transactions={Object.values(transactionSummaryState?.categoryTotals || {})}
          onDetailPress={handleDetailsByCategory}
          onViewAllPress={handleViewAllTransactions}
          onAddTransactionPress={handleAddTransaction}
        />
      </ScrollView>
      <FloatingActionButton onPress={handleAddTransaction} />
      <SummaryItemDetails
        visible={visibleDetailSummary}
        transactionByCategoryState={transactionByCategoryState}
        setVisibleDetailSummary={setVisibleDetailSummary}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: ScaleUtils.floorVerticalScale(80),
  },
  monthPickerContainer: {
    marginVertical: ScaleUtils.floorVerticalScale(10),
  },
});

export default HomeScreen;