import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { RootState } from '@/hooks/store';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

// Components
import TransactionItem from '@/components/Transactions/TransactionItem';
import SummaryItemDetails from '@/components/Transactions/SummaryItemDetails';

// Utils
import ScaleUtils from '@/utils/ScaleUtils';
import commonStyles from '@/utils/commonStyles';
import { formatDateUK, getFirstDayOfMonth, getLastDayOfMonth, formatCurrency } from '@/utils/format';

// Redux actions
import { getTransactionByCategories, getTransactionsSummary } from '@/redux/transactions.slice';
import { getMonthReport, getSummaryReport } from '@/redux/reportSlice';
import VietnameseMonthPicker from '@/components/Calendars/CalendarMonthVN';
import { getTotalSavingsByMonth } from '@/redux/goalsSlice';
import { Goal } from '@/utils/types';

const HomeScreen = () => {
  const dispatch = useAppDispatch();

  // Lấy dữ liệu từ Redux store
  const transactionSummaryState = useAppSelector((state: RootState) => state.transaction.transactionSummary);
  const transactionByCategoryState = useAppSelector((state: RootState) => state.transaction.transactionByCategory);
  // const reportMonth = useAppSelector((state: RootState) => state.report.reportMonth);
  // const totalSavingsByMonth = useAppSelector((state: RootState) => state.goals.totalSavingsByMonth);
  // const monthlySavings = useAppSelector((state: RootState) => state.transaction.monthlySavings);

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

  // Cập nhật fromDate và toDate khi selectedMonth thay đổi, sau đó fetch lại dữ liệu
  const handleMonthChange = useCallback((month: string) => {
    const monthIndex = parseInt(month);
    setSelectedMonth(monthIndex);

    // Cập nhật fromDate và toDate dựa trên tháng mới
    // const newFromDate = getFirstDayOfMonth(new Date(new Date().getFullYear(), monthIndex));
    // const newToDate = getLastDayOfMonth(new Date(new Date().getFullYear(), monthIndex));
    // setFromDate(newFromDate);
    // setToDate(newToDate);
  }, []);

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerMonth}>
        {new Date(fromDate).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
      </Text>
      <TouchableOpacity style={styles.settingsButton}>
        <MaterialIcons name="settings" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );

  const renderSummaryCard = () => (
    <LinearGradient
      colors={['#4285F4', '#34A853']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.summaryCard}
    >
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Số dư</Text>
        <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <MaterialIcons name="arrow-downward" size={20} color="#34A853" />
          <Text style={styles.statAmount}>{formatCurrency(transactionStats.income.toString())}</Text>
          <Text style={styles.statLabel}>Thu nhập</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <MaterialIcons name="arrow-upward" size={20} color="#EA4335" />
          <Text style={styles.statAmount}>{formatCurrency(transactionStats.expense.toString())}</Text>
          <Text style={styles.statLabel}>Chi tiêu</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <MaterialIcons name="savings" size={20} color="#FBBC05" />
          <Text style={styles.statAmount}>{formatCurrency(transactionStats.totalSavings.toString())}</Text>
          <Text style={styles.statLabel}>Tiết kiệm</Text>
        </View>
      </View>
    </LinearGradient>
  );

  const renderCategoryTabs = () => (
    <View style={styles.categoryTabs}>
      {categories && categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryTab,
            type === category.name && styles.selectedCategoryTab
          ]}
          onPress={() => handleSelectType(category.name)}
        >
          <MaterialIcons
            name={category.name === 'salary' ? 'attach-money' : 'shopping-cart'}
            size={18}
            color={type === category.name ? '#fff' : '#555'}
          />
          <Text style={[
            styles.categoryTabText,
            type === category.name && styles.selectedCategoryTabText
          ]}>
            {category.title}
          </Text>
          <Text style={[
            styles.categoryTabAmount,
            type === category.name && styles.selectedCategoryTabText
          ]}>
            {formatCurrency(category.amount)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderEmptyTransactions = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="receipt-long" size={60} color="#ccc" />
      <Text style={styles.emptyText}>Không có giao dịch nào</Text>
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>+ Thêm giao dịch mới</Text>
      </TouchableOpacity>
    </View>
  );

  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
      <TouchableOpacity>
        <Text style={styles.viewAllText}>Xem tất cả</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#f5f5f5" barStyle="dark-content" />
      {renderHeader()}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderSummaryCard()}
        <View style={styles.monthPickerContainer}>
          <VietnameseMonthPicker onChangeMonth={handleMonthChange} />
        </View>
        {renderCategoryTabs()}
        {renderSectionHeader()}
        <View style={styles.transactionsList}>
          {Object.values(transactionSummaryState?.categoryTotals || {}).length > 0 ? (
            Object.values(transactionSummaryState?.categoryTotals || {})
              .filter((item: any) => item.categoryName !== 'Lương')
              .map((item, index) => (
                <TransactionItem
                  key={index}
                  item={item}
                  handleDetails={() => handleDetailsByCategory(item)}
                />
              ))
          ) : (
            renderEmptyTransactions()
          )}
        </View>
      </ScrollView>
      <TouchableOpacity style={styles.floatingButton}>
        <MaterialIcons name="add" size={24} color="#fff" />
      </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ScaleUtils.floorScale(16),
    paddingVertical: ScaleUtils.floorVerticalScale(12),
    backgroundColor: '#f5f5f5',
  },
  headerMonth: {
    fontSize: ScaleUtils.scaleFontSize(18),
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    padding: ScaleUtils.scale(8),
  },
  summaryCard: {
    margin: ScaleUtils.floorScale(16),
    borderRadius: ScaleUtils.scale(16),
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  balanceContainer: {
    padding: ScaleUtils.floorScale(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: ScaleUtils.scaleFontSize(14),
    marginBottom: ScaleUtils.floorVerticalScale(4),
  },
  balanceAmount: {
    color: '#fff',
    fontSize: ScaleUtils.scaleFontSize(24),
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: ScaleUtils.floorScale(16),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statAmount: {
    color: '#fff',
    fontSize: ScaleUtils.scaleFontSize(14),
    fontWeight: 'bold',
    marginTop: ScaleUtils.floorVerticalScale(4),
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: ScaleUtils.scaleFontSize(12),
    marginTop: ScaleUtils.floorVerticalScale(2),
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: ScaleUtils.floorScale(4),
  },
  monthPickerContainer: {
    marginVertical: ScaleUtils.floorVerticalScale(10),
  },
  categoryTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ScaleUtils.floorScale(16),
    marginBottom: ScaleUtils.floorVerticalScale(16),
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: ScaleUtils.floorVerticalScale(12),
    marginHorizontal: ScaleUtils.floorScale(6),
    backgroundColor: '#fff',
    borderRadius: ScaleUtils.scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategoryTab: {
    backgroundColor: '#4285F4',
  },
  categoryTabText: {
    fontSize: ScaleUtils.scaleFontSize(12),
    fontWeight: 'bold',
    color: '#555',
    marginTop: ScaleUtils.floorVerticalScale(4),
  },
  categoryTabAmount: {
    fontSize: ScaleUtils.scaleFontSize(12),
    color: '#333',
    marginTop: ScaleUtils.floorVerticalScale(4),
  },
  selectedCategoryTabText: {
    color: '#fff',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ScaleUtils.floorScale(16),
    marginBottom: ScaleUtils.floorVerticalScale(8),
  },
  sectionTitle: {
    fontSize: ScaleUtils.scaleFontSize(16),
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: ScaleUtils.scaleFontSize(12),
    color: '#4285F4',
  },
  transactionsList: {
    paddingHorizontal: ScaleUtils.floorScale(16),
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ScaleUtils.floorVerticalScale(30),
  },
  emptyText: {
    marginTop: ScaleUtils.floorVerticalScale(16),
    fontSize: ScaleUtils.scaleFontSize(14),
    color: '#888',
  },
  addButton: {
    marginTop: ScaleUtils.floorVerticalScale(16),
    paddingVertical: ScaleUtils.floorVerticalScale(8),
    paddingHorizontal: ScaleUtils.floorScale(16),
    backgroundColor: '#4285F4',
    borderRadius: ScaleUtils.scale(20),
  },
  addButtonText: {
    color: '#fff',
    fontSize: ScaleUtils.scaleFontSize(14),
  },
  floatingButton: {
    position: 'absolute',
    right: ScaleUtils.floorScale(14),
    bottom: ScaleUtils.floorVerticalScale(14),
    width: ScaleUtils.scale(40),
    height: ScaleUtils.scale(40),
    borderRadius: ScaleUtils.scale(28),
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default HomeScreen;