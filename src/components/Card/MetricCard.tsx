import commonStyles from '@/utils/commonStyles';
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
  type: string;
  onSelect: (name: string) => void;
}
const MetricCard = memo(({ title, amount, isSelected }: MetricCardProps) => {
  return (
    <View style={[styles.card, isSelected && styles.selectedCard]}>
      <View style={styles.iconContainer}>
        <MaterialIcons
          name="account-balance-wallet"
          size={24}
          color={isSelected ? '#fff' : '#000'}
        />
        <Text style={[styles.title, isSelected && styles.selectedText]}>
          {title}
        </Text>
      </View>

      <Text style={[styles.amount, isSelected && styles.selectedText]}>
        ${amount}
      </Text>
    </View>
  );
},);


const FinancialMetrics = memo(({ categories, onSelect, type }: categoris) => {
  return (
    <View style={styles.container}>
      {categories && categories.map((category: any, index: number) => (
        <TouchableOpacity onPress={() => onSelect(category.name)}>
          <MetricCard title={category.title} amount={category.amount} isSelected={type == category.name ? true : false} />
        </TouchableOpacity>

      ))}
    </View>
  );
},);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: ScaleUtils.scale(10),
    gap: ScaleUtils.scale(10),
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: ScaleUtils.scale(10),
    padding: ScaleUtils.scale(14),
    width: ScaleUtils.floorScale(100),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCard: {
    backgroundColor: '#497ff2',
  },
  iconContainer: {
    marginBottom: ScaleUtils.floorVerticalScale(10),
    ...commonStyles.jusBetween,
    ...commonStyles.row,
  },
  title: {
    fontSize: ScaleUtils.scaleFontSize(12),
    color: '#666',
    fontWeight: 'bold',
    marginBottom: 4,
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