import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { RootState } from '@/hooks/store';
import Summary from './Summary';
import { getSummaryReport } from '@/redux/reportSlice';
import { formatDateUK } from '@/utils/format';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScaleUtils from '@/utils/ScaleUtils';
import DateRangePicker from '@/components/DateRangerPicker';
import { setDateRange } from '@/redux/dateRangeSlice';

interface ReportsProps {
  customDateRange?: {
    fromDate: Date;
    toDate: Date;
  };
}

const Reports = ({ customDateRange }: ReportsProps) => {
  const dispatch = useAppDispatch();
  const summaryState = useAppSelector((state: RootState) => state.report.summaryReport);
  const reportStatus = useAppSelector((state: RootState) => state.report.status);
  
  // Sử dụng dateRange từ props nếu có, nếu không thì lấy từ Redux
  const dateRange = useAppSelector((state: RootState) => state.dateRange);
  
  // Xác định ngày tháng để sử dụng
  const fromDate = customDateRange ? customDateRange.fromDate : new Date(dateRange.fromDate);
  const toDate = customDateRange ? customDateRange.toDate : new Date(dateRange.toDate);
  
  const [chartData, setChartData] = useState<{ series: number[]; categories: string[]; totalAmount: number }>({
    series: [],
    categories: [],
    totalAmount: 0,
  });
  const [visible, setVisible] = useState(false);

  const fetchReportData = useCallback(async () => {
    const data = {
      startDate: formatDateUK(fromDate),
      endDate: formatDateUK(toDate),
      type: 1
    };
    await dispatch(getSummaryReport(data));
  }, [
    dispatch,
    customDateRange ? 
      `${customDateRange.fromDate.toISOString()}-${customDateRange.toDate.toISOString()}` : 
      `${dateRange.fromDate}-${dateRange.toDate}`
  ]);
  
  // Fetch dữ liệu khi dateRange thay đổi
  useEffect(() => {
    fetchReportData();
  // Sử dụng fetchReportData làm dependency để React cập nhật khi nó thay đổi
  }, [fetchReportData]);

  // Xử lý dữ liệu báo cáo khi summaryState thay đổi
  useEffect(() => {
    if (summaryState) {
      const chartData = getChartData(summaryState);
      setChartData(chartData);
    }
  }, [summaryState]);
  
  const handleConfirm = (startDate: string, endDate: string) => {
    if (startDate && endDate) {
      // Chuyển đổi string date sang Date object
      const fromDateObj = new Date(startDate.split('-').join('/'));
      const toDateObj = new Date(endDate.split('-').join('/'));
      
      // Chỉ cập nhật Redux nếu không dùng customDateRange
      if (!customDateRange) {
        // Cập nhật dateRange trong Redux
        dispatch(setDateRange({ fromDate: fromDateObj, toDate: toDateObj }));
      }
      
      setVisible(false);
    }
  };

  const getChartData = useCallback((summaryState: any) => {
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
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.datePickerContainer}>
        <Text style={styles.dateRangeText}>
          {`${fromDate.toLocaleDateString('vi-VN')} - ${toDate.toLocaleDateString('vi-VN')}`}
        </Text>
        {!customDateRange && (
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setVisible(true)}
          >
            <MaterialIcons name="date-range" size={24} color="#4285F4" />
          </TouchableOpacity>
        )}
      </View>
      
      {reportStatus === 'loading' ? (
        <View style={styles.loadingContainer}>
          <Text>Đang tải dữ liệu...</Text>
        </View>
      ) : chartData.categories.length > 0 && chartData.series.length > 0 ? (
        <Summary data={chartData} />
      ) : (
        <View style={styles.emptyContainer}>
          <Text>Không có dữ liệu báo cáo</Text>
        </View>
      )}
      
      {!customDateRange && (
        <DateRangePicker
          visible={visible} 
          onCancel={() => setVisible(false)}
          onConfirm={handleConfirm}
        />
      )}
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: ScaleUtils.floorScale(16),
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ScaleUtils.floorVerticalScale(16),
    paddingHorizontal: ScaleUtils.floorScale(8),
  },
  dateRangeText: {
    fontSize: ScaleUtils.scaleFontSize(14),
    fontWeight: 'bold',
    color: '#333',
  },
  datePickerButton: {
    padding: ScaleUtils.floorScale(8),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ScaleUtils.floorScale(20),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ScaleUtils.floorScale(20),
  }
});
