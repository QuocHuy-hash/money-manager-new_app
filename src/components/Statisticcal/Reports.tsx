import { StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { RootState } from '@/hooks/store';
import Summary from './Summary';

const Reports = () => {
  const dispatch = useAppDispatch();
  const summaryState = useAppSelector((state: RootState) => state.report.summaryReport);
  const [chartData, setChartData] = useState<{ series: number[]; categories: string[]; totalAmount: number }>({
    series: [],
    categories: [],
    totalAmount: 0,
  });

  useEffect(() => {
    if (summaryState) {
      const chartData = getChartData(summaryState);
      setChartData(chartData);
    }
  }, [summaryState]);

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
    <View>
      {chartData.categories.length > 0 && chartData.series.length > 0 && (
        <Summary data={chartData} />
      )}
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({});
