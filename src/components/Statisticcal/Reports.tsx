import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { RootState } from '@/hooks/store';
import ScaleUtils from '@/utils/ScaleUtils';
import { getYearlyReport } from '@/redux/reportSlice';
import Loading from '../Loading';

const { width } = Dimensions.get('window');

const Reports = () => {
  const dispatch = useAppDispatch();
  const yearlyData = useAppSelector((state: RootState) => state.report.yearlyReport);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchYearlyReportData();
  }, []);

  const fetchYearlyReportData = async () => {
    try {
      setIsLoading(true);
      const result = await dispatch(getYearlyReport()).unwrap();
    } catch (error) {
      console.log("error fetching data", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!yearlyData) {
    return (
      <View style={styles.container}>
        <Loading size="large" color="#ff6347" />
      </View>
    );
  }

  const { totalIncome, totalExpenses, totalSavings } = yearlyData.yearlyTotals;

  const calculateMaxValue = () => {
    return Math.max(
      ...yearlyData.income,
      ...yearlyData.expenses,
      ...yearlyData.savings
    );
  };
  const formatYAxisLabels = (maxValue: number) => {
    const step = maxValue / 4; // Chia trục Y thành 5 phần (0, 1/4, 2/4, 3/4, 4/4)
    return Array.from({ length: 5 }, (_, i) => {
      const valueInMillions = (step * i) / 1000000; // Chia cho 1,000,000 để đổi sang triệu
      if (valueInMillions === 0) return '0M'; // Trường hợp đặc biệt cho giá trị 0
      // Nếu là số nguyên (không có phần thập phân), hiển thị dạng "8M"
      if (valueInMillions % 1 === 0) {
        return `${valueInMillions}M`;
      }
      // Nếu có phần thập phân, hiển thị dạng "8.6M" (bỏ các số 0 không cần thiết)
      return `${valueInMillions.toFixed(1).replace(/\.0$/, '')}M`;
    });
  };
  // Prepare data for the line chart
  const prepareLineChartData = () => {
    const incomeData = [];
    const expensesData = [];
    const savingsData = [];

    for (let i = 0; i < yearlyData.months.length; i++) {
      // Income data points (blue)
      const incomeValueInMillions = yearlyData.income[i] / 1000000;
      incomeData.push({
        value: yearlyData.income[i],
        label: yearlyData.months[i],
        dataPointColor: '#3273dc',
        dataPointText: yearlyData.income[i] > 0
          ? (incomeValueInMillions % 1 === 0
            ? `${incomeValueInMillions}M`
            : `${incomeValueInMillions.toFixed(1).replace(/\.0$/, '')}M`)
          : '',
        showDataPoint: i % 2 === 0 && yearlyData.income[i] > 0,
        textColor: '#3273dc',
        textShiftY: 12,
        textShiftX: 6,
      });

      // Expenses data points (red)
      const expensesValueInMillions = yearlyData.expenses[i] / 1000000;
      expensesData.push({
        value: yearlyData.expenses[i],
        label: yearlyData.months[i],
        dataPointColor: '#ff3860',
        dataPointText: yearlyData.expenses[i] > 0
          ? (expensesValueInMillions % 1 === 0
            ? `${expensesValueInMillions}M`
            : `${expensesValueInMillions.toFixed(1).replace(/\.0$/, '')}M`)
          : '',
        showDataPoint: i % 2 === 0 && yearlyData.expenses[i] > 0,
        textColor: '#ff3860',
        textShiftY: -5,
        textShiftX: -4,
      });

      // Savings data points (green)
      const savingsValueInMillions = yearlyData.savings[i] / 1000000;
      savingsData.push({
        value: yearlyData.savings[i],
        label: yearlyData.months[i],
        dataPointColor: '#48c774',
        dataPointText: yearlyData.savings[i] > 0
          ? (savingsValueInMillions % 1 === 0
            ? `${savingsValueInMillions}M`
            : `${savingsValueInMillions.toFixed(1).replace(/\.0$/, '')}M`)
          : '',
        showDataPoint: i % 2 === 0 && yearlyData.savings[i] > 0,
        textColor: '#48c774',
        textShiftY: -6,
        textShiftX: -4,
      });
    }

    return { incomeData, expensesData, savingsData };
  };
  const { incomeData, expensesData, savingsData } = prepareLineChartData();

  // Prepare data for the pie chart
  const preparePieChartData = () => {
    const colors = ['#3273dc', '#ffdd57', '#48c774', '#ff3860', '#9966ff'];
    const pieData = [];

    let index = 0;
    for (const category in yearlyData.categoryBreakdown) {
      const value = yearlyData.categoryBreakdown[category as keyof typeof yearlyData.categoryBreakdown];
      if (value > 0) { // Chỉ thêm vào pie chart nếu giá trị > 0
        pieData.push({
          value,
          color: colors[index % colors.length],
          text: `${((value / totalExpenses) * 100).toFixed(0)}%`,
          label: category,
        });
        index++;
      }
    }

    return pieData;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Báo cáo tài chính {selectedYear}</Text>
        <Text style={styles.headerSubtitle}>Tổng quan cho cả năm</Text>
      </View>

      {/* Summary cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#edf2ff' }]}>
          <Text style={styles.summaryLabel}>Thu nhập</Text>
          <Text style={[styles.summaryValue, { color: '#3273dc' }]}>
            {`${totalIncome.toLocaleString()} đ`}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#fff5f5' }]}>
          <Text style={styles.summaryLabel}>Chi tiêu</Text>
          <Text style={[styles.summaryValue, { color: '#ff3860' }]}>
            {`${totalExpenses.toLocaleString()} đ`}
          </Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#effaf3' }]}>
          <Text style={styles.summaryLabel}>Tiết kiệm</Text>
          <Text style={[styles.summaryValue, { color: '#48c774' }]}>
            {`${totalSavings.toLocaleString()} đ`}
          </Text>
        </View>
      </View>

      {/* Line chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Biểu đồ theo dõi hàng tháng</Text>
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#3273dc' }]} />
            <Text style={styles.legendText}>Thu nhập</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#ff3860' }]} />
            <Text style={styles.legendText}>Chi tiêu</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#48c774' }]} />
            <Text style={styles.legendText}>Tiết kiệm</Text>
          </View>
        </View>

        <View style={styles.lineChartContainer}>
          <LineChart
            data={incomeData}
            data2={expensesData}
            data3={savingsData}
            height={240}
            width={width - 40}
            noOfSections={4}
            spacing={(width - 50) / 12}
            color1="#3273dc"
            color2="#ff3860"
            color3="#48c774"
            thickness={2}
            startFillColor1="#3273dc20"
            startFillColor2="#ff386020"
            startFillColor3="#48c77420"
            endFillColor1="#3273dc01"

            endFillColor2="#ff386001"
            endFillColor3="#48c77401"
            startOpacity={0.2}
            endOpacity={0.0}
            initialSpacing={2}
            yAxisTextStyle={{ color: '#999' }}
            xAxisLabelTexts={yearlyData.months}
            xAxisLabelTextStyle={{ color: '#999', fontSize: ScaleUtils.scaleFontSize(10) }}
            hideDataPoints={false}
            hideRules
            curved
            showVerticalLines
            verticalLinesColor="#e5e5e5"
            xAxisColor="#e5e5e5"
            yAxisColor="#e5e5e5"
            yAxisLabelTexts={formatYAxisLabels(calculateMaxValue())}
          />
        </View>
      </View>

      {/* Category breakdown */}
      <View style={styles.pieChartContainer}>
        <Text style={styles.chartTitle}>Chi tiêu theo danh mục</Text>
        <View style={styles.pieChart}>
          <PieChart
            data={preparePieChartData()}
            donut
            showText
            textColor="white"
            radius={100}
            textSize={14}
            fontWeight="bold"
            innerRadius={50}
            innerCircleColor="#fff"
            centerLabelComponent={() => (
              <View style={styles.centerLabel}>
                <Text style={styles.totalAmount}>
                  {`${totalExpenses.toLocaleString()} đ`}
                </Text>
                <Text style={styles.totalLabel}>Chi tiêu</Text>
              </View>
            )}
          />
        </View>

        {/* Category legend */}
        <View style={styles.categoryLegend}>
          {Object.entries(yearlyData.categoryBreakdown)
            .filter(([, amount]) => (amount as number) > 0) // Chỉ hiển thị các danh mục có giá trị > 0
            .map(([category, amount], index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryLeft}>
                  <View
                    style={[
                      styles.categoryColor,
                      { backgroundColor: ['#3273dc', '#ffdd57', '#48c774', '#ff3860', '#9966ff'][index % 5] },
                    ]}
                  />
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <Text style={styles.categoryAmount}>{
                  `${(amount as number).toLocaleString()} đ`
                }</Text>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: ScaleUtils.scale(10),
  },
  headerContainer: {
    marginBottom: ScaleUtils.scale(15),
    marginTop: ScaleUtils.scale(10),
  },
  headerTitle: {
    fontSize: ScaleUtils.scaleFontSize(18),
    fontWeight: 'bold',
    color: '#363636',
  },
  headerSubtitle: {
    fontSize: ScaleUtils.scaleFontSize(12),
    color: '#7a7a7a',
    marginTop: 5,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ScaleUtils.scale(20),
  },
  summaryCard: {
    flex: 1,
    borderRadius: ScaleUtils.scale(10),
    paddingVertical: ScaleUtils.scale(15),
    paddingHorizontal: ScaleUtils.scale(4),
    marginHorizontal: ScaleUtils.scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: ScaleUtils.scaleFontSize(12),
    color: '#7a7a7a',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: ScaleUtils.scaleFontSize(12),
    fontWeight: 'bold',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: ScaleUtils.scale(10),
    padding: ScaleUtils.scale(15),
    marginBottom: ScaleUtils.scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chartTitle: {
    fontSize: ScaleUtils.scaleFontSize(16),
    fontWeight: 'bold',
    color: '#363636',
    marginBottom: ScaleUtils.scale(15),
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: ScaleUtils.scale(10),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: ScaleUtils.scale(20),
  },
  legendColor: {
    width: ScaleUtils.scale(12),
    height: ScaleUtils.scale(12),
    borderRadius: ScaleUtils.scale(6),
    marginRight: ScaleUtils.scale(5),
  },
  legendText: {
    fontSize: ScaleUtils.scaleFontSize(10),
    color: '#7a7a7a',
  },
  lineChartContainer: {
    alignItems: 'center',
    marginTop: ScaleUtils.scale(10),
    paddingBottom: ScaleUtils.scale(10),
  },
  pieChartContainer: {
    backgroundColor: '#fff',
    borderRadius: ScaleUtils.scale(10),
    padding: ScaleUtils.scale(15),
    marginBottom: ScaleUtils.scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pieChart: {
    alignItems: 'center',
    marginVertical: ScaleUtils.scale(20),
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: ScaleUtils.scaleFontSize(12),
    fontWeight: 'bold',
    color: '#363636',
  },
  totalLabel: {
    fontSize: ScaleUtils.scaleFontSize(12),
    color: '#7a7a7a',
  },
  categoryLegend: {
    marginTop: ScaleUtils.scale(20),
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: ScaleUtils.scale(6),
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryColor: {
    width: ScaleUtils.scale(12),
    height: ScaleUtils.scale(12),
    borderRadius: ScaleUtils.scale(6),
    marginRight: ScaleUtils.scale(10),
  },
  categoryName: {
    fontSize: ScaleUtils.scaleFontSize(12),
    color: '#363636',
  },
  categoryAmount: {
    fontSize: ScaleUtils.scaleFontSize(12),
    fontWeight: '500',
    color: '#363636',
  },
});

export default Reports;