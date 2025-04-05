import React, { useCallback, useEffect, useState, useRef } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, StatusBar, ActivityIndicator, Alert } from 'react-native';
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
import {
  getHomeTransactionByCategories,
  getHomeTransactionsSummary,
  getHomeMonthReport,
  getHomeSummaryReport
} from '@/redux/homeSlice';
import { getTotalSavingsByMonth } from '@/redux/goalsSlice';
import { setSelectedMonth } from '@/redux/dateRangeSlice';
import CryptoPortfolio from '@/components/Crypto/CryptoPortfolio';
import { useNavigation } from '@react-navigation/native';
import AddTransactionModal from '@/components/Transactions/AddTransactionModal';

const HomeScreen = () => {
  const dispatch = useAppDispatch();
  const currentMonthRef = useRef<string | null>(null);
  const navigation = useNavigation();
  // Lấy dữ liệu từ Redux store - sử dụng selector từ homeSlice
  const transactionSummaryState = useAppSelector((state: RootState) => state.home.transactionSummary);
  const transactionByCategoryState = useAppSelector((state: RootState) => state.home.transactionByCategory);
  const homeStatus = useAppSelector((state: RootState) => state.home.status);

  // Sử dụng dateRange từ Redux
  const dateRange = useAppSelector((state: RootState) => state.dateRange);
  const { fromDate: fromDateStr, toDate: toDateStr, selectedMonth } = dateRange;

  // Chuyển đổi chuỗi ISO thành Date để sử dụng
  const fromDate = new Date(fromDateStr);
  const toDate = new Date(toDateStr);

  // Các state quản lý dữ liệu trong component
  const [visibleDetailSummary, setVisibleDetailSummary] = useState(false);
  const [type, setType] = useState('salary');
  const [categories, setCategories] = useState<{ id: number; title: string; name: string; amount: string }[]>([]);
  const [balance, setBalance] = useState('0');
  const [transactionStats, setTransactionStats] = useState({ income: 0, expense: 0, savings: 0, totalSavings: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionModalVisible, setTransactionModalVisible] = useState(false);

  const fetchData = useCallback(async (data: any) => {
    // Tạo một chuỗi định danh cho tháng hiện tại để tránh fetch trùng lặp
    const monthIdentifier = `${fromDate.getFullYear()}-${fromDate.getMonth() + 1}`;

    // Nếu đã fetch dữ liệu cho tháng này rồi thì bỏ qua
    if (currentMonthRef.current === monthIdentifier) {
      console.log('Skipping data fetch - already loaded for:', monthIdentifier);
      return;
    }

    try {
      setIsLoading(true);
      console.log('Fetching data for month:', monthIdentifier);

      // Gọi các action từ homeSlice thay vì các slice chung
      await dispatch(getHomeTransactionsSummary(data));
      const reportResponse = await dispatch(getHomeMonthReport(data));
      await dispatch(getHomeSummaryReport({ ...data, type: 1 }));

      // Gọi action để lấy tổng tiết kiệm trong tháng
      const month = `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, '0')}`;
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

        // Cập nhật tháng đã fetch
        currentMonthRef.current = monthIdentifier;
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu tài chính:', error);
    } finally {
      setIsLoading(false);
    }
    // Chỉ phụ thuộc vào dispatch và selectedMonth, không phụ thuộc vào đối tượng Date
  }, [dispatch, selectedMonth]);

  // Fetch dữ liệu khi component mount hoặc khi selectedMonth thay đổi
  useEffect(() => {
    // Tạo data object từ các Date đã chuyển đổi
    const data = {
      startDate: formatDateUK(fromDate),
      endDate: formatDateUK(toDate),
    };

    // Chỉ fetch dữ liệu khi cả hai fromDate và toDate đều hợp lệ
    if (fromDate && toDate && fromDate <= toDate) {
      fetchData(data);
    }
  }, [fetchData, selectedMonth]);

  const handleDetailsByCategory = useCallback(async (item: any) => {
    const data = {
      startDate: formatDateUK(fromDate),
      endDate: formatDateUK(toDate),
      categoryId: item.categoryId
    };
    const res = await dispatch(getHomeTransactionByCategories(data));
    if (res?.meta.requestStatus === "fulfilled") {
      setVisibleDetailSummary(true);
    }
  }, [dispatch]);

  const handleSelectType = useCallback((name: string) => {
    setType(name);
  }, []);

  const handleMonthChange = useCallback((month: string) => {
    const monthIndex = parseInt(month);

    // Ngăn chặn việc gọi API lại nếu tháng được chọn giống với tháng hiện tại
    if (monthIndex === selectedMonth) {
      return;
    }

    // Reset currentMonthRef khi chuyển sang tháng mới để đảm bảo dữ liệu sẽ được tải lại
    const currentYear = new Date().getFullYear();
    const newMonthIdentifier = `${currentYear}-${monthIndex + 1}`;
    if (currentMonthRef.current !== newMonthIdentifier) {
      currentMonthRef.current = null;
    }

    // Cập nhật selectedMonth trong redux dateRange slice
    dispatch(setSelectedMonth(monthIndex));
  }, [selectedMonth, dispatch]);

  const handleAddTransaction = () => {
    // Handle adding new transaction
    //  setTransactionModalVisible(true);
  Alert.alert('Thông báo', 'Chức năng này chưa được triển khai.');
  };

  const handleViewAllTransactions = () => {
    // Handle viewing all transactions
    navigation.navigate('TransactionList' as never);
  };

  // Xác định khi nào hiển thị loading dựa trên trạng thái của homeSlice
  const showLoading = isLoading || homeStatus === 'loading';

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
          <VietnameseMonthPicker onChangeMonth={handleMonthChange} initialMonth={selectedMonth} />
        </View>
        {showLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
          </View>
        ) : (
          <>
            <CategoryTabs
              categories={categories}
              selectedType={type}
              onSelectType={handleSelectType}
            />
            {/* <CryptoPortfolio /> */}
            <TransactionSection
              transactions={Object.values(transactionSummaryState?.categoryTotals || {})}
              onDetailPress={handleDetailsByCategory}
              onViewAllPress={handleViewAllTransactions}
              onAddTransactionPress={handleAddTransaction}
            />
          </>
        )}
      </ScrollView>
      <FloatingActionButton onPress={handleAddTransaction} />
      <SummaryItemDetails
        visible={visibleDetailSummary}
        transactionByCategoryState={transactionByCategoryState}
        setVisibleDetailSummary={setVisibleDetailSummary}
      />
  <AddTransactionModal 
        visible={transactionModalVisible}
        onClose={() => setTransactionModalVisible(false)}
         onSubmit={handleAddTransaction}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ScaleUtils.floorScale(20),
  },
});

export default HomeScreen;