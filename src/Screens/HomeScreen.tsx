import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { FlatList } from 'react-native';
import ScaleUtils from '@/utils/ScaleUtils';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { RootState } from '@/hooks/store';
import TransactionItem from '@/components/Transactions/TransactionItem';
import { formatDateUK, getLastDayOfMonth, getTimeFromStartOfYearToNow } from '@/utils/format';
import { getTransactionByCategorys, getTransactionsSummary } from '@/redux/transactions.slice';
import SummaryItemDetails from '@/components/Transactions/SummaryItemDetails';
import { getMonthReport, getSummaryReport } from '@/redux/reportSlice';
import FinancialMetrics from '@/components/Card/MetricCard';
import VietnameseCalendar from '@/components/Calendars/CalendarMonthVN';



export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const transactionSummaryState = useAppSelector((state: RootState) => state.transaction.transactionSummary);
  const reportMonth = useAppSelector((state: RootState) => state.report.reportMonth);
  const transactionByCategoryState = useAppSelector((state: RootState) => state.transaction.transactionByCategory);
  const [selectMonth, setSelectMonth] = useState('');
  const [fromDate, setFromDate] = useState(getTimeFromStartOfYearToNow().startOfYear);
  const [toDate, setToDate] = useState(getLastDayOfMonth());
  const [visibleDetailSummary, setVisibleDetailSummary] = useState(false);
  const [type, setType] = useState('salary');
  const [categories, setCategories] = useState<{ id: number; title: string; name: string; amount: string }[]>([]);

  useEffect(() => {
    const data = {
      startDate: formatDateUK(fromDate),
      endDate: formatDateUK(toDate),
    }
    getTransactionSummary(data);
    getTotalTransactionMonth(data);
  }, [fromDate, toDate ]);

  useEffect(() => {
    fetchSummary()
  }, []);
  const getTransactionSummary = async (data: any) => {
    await dispatch(getTransactionsSummary(data));
  };
  const getTotalTransactionMonth = async (data: any) => {
    try {
      await dispatch(getTransactionsSummary(data));
      const reportResponse = await dispatch(getMonthReport(data));

      if (reportResponse?.meta.requestStatus === 'fulfilled') {
        const reportData = reportResponse.payload;
        const formattedCategories = [
          { id: 1, title: 'Tổng thu', name: 'salary', amount: reportData.salary.toString() },
          { id: 2, title: 'Tổng chi', name: 'expense', amount: reportData.expense.toString() },
        ];
        setCategories(formattedCategories);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
    await dispatch(getMonthReport(data));
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

  const hanldeSelectType = useCallback((name: string) => {
    setType(name);
  }, [type]);
  const onChangeMonth = useCallback((month: string) => {
    const newMonth = parseInt(month) + 1;
    setSelectMonth(newMonth.toString());
  }, [selectMonth]);
  return (
    <View style={styles.container}>

      <FinancialMetrics categories={categories} onSelect={hanldeSelectType} type={type}/>
      <View style={{ marginTop: ScaleUtils.floorVerticalScale(5), marginBottom: ScaleUtils.floorVerticalScale(10) }}>
        <VietnameseCalendar onChangeMonth={onChangeMonth} />
      </View>
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
  sectionTitle: {
    fontSize: ScaleUtils.scaleFontSize(14),
    fontWeight: 'bold',
    marginVertical: ScaleUtils.floorVerticalScale(10),
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