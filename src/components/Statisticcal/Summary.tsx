import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { PieChart } from 'react-native-gifted-charts';
import commonStyles from '@/utils/commonStyles';
import ScaleUtils from '@/utils/ScaleUtils';

interface SummaryProps {
  data: {
    categories: string[];
    series: number[];
    totalAmount: number;
  };
}

const Summary = ({ data }: SummaryProps) => {
  const defaultSliceColor = ['#0e3fa1', '#ffb300', 'green', '#ff6c00', '#ff3c00'];

  // Ensure data exists and has required properties
  if (!data || !Array.isArray(data.series) || !Array.isArray(data.categories)) {
    return <Text>Invalid data format</Text>;
  }

  const { series, categories, totalAmount } = data;

  // Convert data to format required by react-native-gifted-charts
  const pieData = series.map((value, index) => ({
    value,
    text: `${((value / totalAmount) * 100).toFixed(2)}%`,
    color: defaultSliceColor[index],
    label: categories[index],
  }));
  return (
    <View style={styles.container}>
      <View style={styles.chartWrapper}>
        <View style={styles.pieChartContainer}>
          <PieChart
            data={pieData}
            donut
            showText
            textSize={10}
            textColor="white"
            radius={80}
            isThreeD={false}
            innerRadius={45}
            innerCircleColor={'#fff'}
            centerLabelComponent={() => {
              return (
                <View style={styles.centerLabel}>
                  <Text style={styles.totalAmount}>
                    {totalAmount.toLocaleString()}
                  </Text>
                </View>
              );
            }}
          />
        </View>
      </View>

      <View style={styles.legendContainer}>
        {categories.map((category: string, index: number) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={[
                styles.colorIndicator,
                { backgroundColor: defaultSliceColor[index] },
              ]}
            />
            <View style={styles.legendTextContainer}>
              <Text
                style={[
                  styles.categoryText,
                  { color: defaultSliceColor[index] },
                ]}
              >
                {category}
              </Text>
              {/* <Text style={styles.percentageText}>
                {calculatePercentage(series[index])}%
              </Text> */}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: ScaleUtils.scale(10),
borderRadius: ScaleUtils.scale(8),
    alignItems: 'center',
  },
  chartWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieChartContainer: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderRadius: ScaleUtils.scale(8),
    padding: ScaleUtils.scale(6),
  },
  centerLabel: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: ScaleUtils.scaleFontSize(10),
    fontWeight: 'bold',
    color: '#333',
  },
  legendContainer: {
    flex: 1,
    marginLeft: ScaleUtils.floorScale(12),
  },
  legendItem: {
    flexDirection: 'row',
    marginVertical: ScaleUtils.floorVerticalScale(2),
  },
  colorIndicator: {
    width: ScaleUtils.floorScale(12),
    height: ScaleUtils.floorVerticalScale(10),
    borderRadius: ScaleUtils.scale(4),
    marginRight: ScaleUtils.floorScale(8),
  },
  legendTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: ScaleUtils.scaleFontSize(10),
    fontWeight: 'bold',
  },

});

export default Summary;
