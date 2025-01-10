import commonStyles from '@/utils/commonStyles';
import { formatCurrency } from '@/utils/format';
import ScaleUtils from '@/utils/ScaleUtils';
import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface MetricCardProps {
  title: string;
  amount: string;
  isSelected?: boolean;
}
interface categoris {
  categories: any;
  reportMonth?: any;

  type: string;
  onSelect: (name: string) => void;
}
const MetricCard = memo(({ title, amount, isSelected }: MetricCardProps) => {
  return (
    <View style={[styles.card]}>
      <View style={styles.iconContainer}>
        <MaterialIcons
          name="account-balance-wallet"
          size={26}
          color={'#497ff2'}
        />
        <Text style={[styles.title]}>
          {title}
        </Text>
      </View>

      <Text style={[styles.amount]}>
        {formatCurrency(amount)}
      </Text>
    </View>
  );
},);


const FinancialMetrics = memo(({ categories, onSelect, type, reportMonth }: categoris) => {
  return (
    <View style={styles.container}>
      {categories && categories.map((category: any, index: number) => (
        <TouchableOpacity onPress={() => onSelect(category.name)} key={index}>
          <MetricCard title={category.title} amount={category.amount} isSelected={type == category.name ? true : false} />
        </TouchableOpacity>

      ))}
    </View>
  );
},);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    padding: ScaleUtils.scale(10),
    gap: ScaleUtils.scale(10),
  },
  card: {
    backgroundColor: 'white',
    borderRadius: ScaleUtils.scale(10),
    paddingHorizontal: ScaleUtils.scale(6),
    paddingVertical: ScaleUtils.scale(10),
    width: ScaleUtils.floorScale(120),
    ...commonStyles.alignCenter,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: ScaleUtils.floorVerticalScale(10),
    ...commonStyles.jusBetween,
    ...commonStyles.row,
  },
  title: {
    fontSize: ScaleUtils.scaleFontSize(12),
    marginTop: ScaleUtils.floorVerticalScale(5),
    marginHorizontal: ScaleUtils.floorScale(5),
    color: '#666',
    fontWeight: 'bold',
  },
  amount: {
    fontSize: ScaleUtils.scaleFontSize(12),
    fontWeight: 'bold',
    color: '#000',
  },
  selectedText: {
    color: '#fff',
  },
});

export default FinancialMetrics;