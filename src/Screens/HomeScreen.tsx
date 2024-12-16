import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { FlatList } from 'react-native';
// import VPBankCard from '@/components/Card/VPBankCard';
import ScaleUtils from '@/utils/ScaleUtils';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { RootState } from '@/hooks/store';
import TransactionItem from '@/components/Transactions/TransactionItem';
import { formatDateUK, getFirstDayOfMonth, getLastDayOfMonth, getTimeFromStartOfYearToNow } from '@/utils/format';
import { getTransactionByCategorys, getTransactionsSummary } from '@/redux/transactions.slice';
import SummaryItemDetails from '@/components/Transactions/SummaryItemDetails';
// import CryptoPortfolio from '@/components/Crypto/CryptoPortfolio';
import ButtonHome from '@/components/ButtonHome';
import Summary from '@/components/Statisticcal/Summary';
import { getSummaryReport } from '@/redux/reportSlice';
import Loading from '@/components/Loading';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const transactionSummaryState = useAppSelector((state: RootState) => state.transaction.transactionSummary);
  const transactionByCategoryState = useAppSelector((state: RootState) => state.transaction.transactionByCategory);
  const summaryState = useAppSelector((state: RootState) => state.report.summaryReport);

  const [fromDate, setFromDate] = useState(getTimeFromStartOfYearToNow().startOfYear);
  const [toDate, setToDate] = useState(getLastDayOfMonth());
  const [visibleDetailSummary, setVisibleDetailSummary] = useState(false);
  const [chartData, setChartData] = useState<{ series: number[]; categories: string[]; totalAmount: number }>({
    series: [],
    categories: [],
    totalAmount: 0,
  });
  useEffect(() => {
    const data = {
      startDate: formatDateUK(fromDate),
      endDate: formatDateUK(toDate),
    }
    getTransactionSummary(data);
  }, []);

  useEffect(() => {
    fetchSummary()
  }, []);
  const getTransactionSummary = async (data: any) => {
    await dispatch(getTransactionsSummary(data));
  };
  const handleDetailsByCategory = async (item: any) => {
    const data = {
      startDate: formatDateUK(fromDate),
      endDate: formatDateUK(toDate),
      categoryId: item.categoryId
    }
    const res = await dispatch(getTransactionByCategorys(data));
    if (res?.meta.requestStatus === "fulfilled") {
      setVisibleDetailSummary(true);
    }
  }

  const fetchSummary = async () => {
    const data = {
      startDate: formatDateUK(fromDate),
      endDate: formatDateUK(toDate),
      type: 1
    }
    try {
      await dispatch(getSummaryReport(data));
    } catch (error) {
      console.log("Lỗi lấy báo cáo chi tiêu:", error);
    }

  }
  useEffect(() => {
    if (summaryState) {
      const chartData = getChartData(summaryState);
      setChartData(chartData);
    }
  }, [summaryState]);
  const getChartData = (summaryState: any) => {
    const { expenseByCategory } = summaryState;
    if (Array.isArray(expenseByCategory)) {
      console.error("Expected an object, but received an array:", expenseByCategory);
      return { series: [], categories: [], totalAmount: 0 };
    }
    const series = [];
    const categories = [];
    let totalAmount = 0;
    for (const key in expenseByCategory) {
      if (expenseByCategory.hasOwnProperty(key)) {
        const { totalAmount: amount, categoryName } = expenseByCategory[key];
        series.push(amount);
        categories.push(categoryName);
        totalAmount += amount;
      }
    }
    return { series, categories, totalAmount };
  };
  const categories: { id: number, name: string; icon: string }[] = [
    { id: 1, name: 'Chi phí', icon: 'attach-money' },
    { id: 2, name: 'Mục tiêu', icon: 'flag' },
    { id: 3, name: 'Đầu tư', icon: 'trending-up' },
    { id: 4, name: 'Khác', icon: 'more-horiz' }
  ];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialIcons name="menu" size={30} color="#000" />
        <MaterialIcons name="notifications" size={30} color="#000" />
      </View>

      <Text style={styles.sectionTitle}>Thống kê các khoản chi trong tháng</Text>
      {/* <VPBankCard /> */}
      {/* <CryptoPortfolio /> */}

      {chartData.categories.length > 0 && chartData.series.length > 0 && (
        <Summary data={chartData} />
      )}

      <View style={{ marginTop: ScaleUtils.floorVerticalScale(10), marginBottom: ScaleUtils.floorVerticalScale(-12) }}>
        <Text style={{ fontSize: ScaleUtils.floorVerticalScale(12), fontWeight: "500" }}>Danh mục</Text>
      </View>
      <ButtonHome categories={categories} />
      <Text style={styles.sectionTitle}>Giao dịch của bạn</Text>
      <FlatList
        data={Object.values(transactionSummaryState?.categoryTotals ?? {})}
        renderItem={({ item }) => <TransactionItem item={item} handleDetails={() => handleDetailsByCategory(item)} />}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có giao dịch nào</Text>
        }
      />


      <SummaryItemDetails
        visible={visibleDetailSummary}
        transactionByCategoryState={transactionByCategoryState}
        setVisibleDetailSummary={setVisibleDetailSummary}
      />
      {/* {isLoading && <Loading />} */}
    </View>
  )
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: ScaleUtils.floorScale(10),

  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: ScaleUtils.floorVerticalScale(5),
  },
  sectionTitle: {
    fontSize: ScaleUtils.scaleFontSize(14),
    fontWeight: 'bold',
    marginVertical: ScaleUtils.floorVerticalScale(5),
  },
  card: {
    padding: ScaleUtils.floorScale(20),
    borderRadius: ScaleUtils.scale(10),
    backgroundColor: '#e74c3c',
    marginBottom: ScaleUtils.floorVerticalScale(20),
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: ScaleUtils.floorVerticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: ScaleUtils.floorScale(10),
  },
  transactionTitle: {
    fontWeight: 'bold',
  },
  transactionTime: {
    color: '#888',
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionPrice: {
    fontWeight: 'bold',
  },
  transactionPercentage: {
    color: 'red',
  },
});