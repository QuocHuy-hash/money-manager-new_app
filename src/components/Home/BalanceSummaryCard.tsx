import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import ScaleUtils from '@/utils/ScaleUtils';
import { formatCurrency } from '@/utils/format';

interface BalanceSummaryCardProps {
  balance: string;
  income: number;
  expense: number;
  savings: number;
}

const BalanceSummaryCard = ({ balance, income, expense, savings }: BalanceSummaryCardProps) => {
  return (
    <View style={styles.cardContainer}>
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
            <Text style={styles.statAmount}>{formatCurrency(income.toString())}</Text>
            <Text style={styles.statLabel}>Thu nhập</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <MaterialIcons name="arrow-upward" size={20} color="#EA4335" />
            <Text style={styles.statAmount}>{formatCurrency(expense.toString())}</Text>
            <Text style={styles.statLabel}>Chi tiêu</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <MaterialIcons name="savings" size={20} color="#FBBC05" />
            <Text style={styles.statAmount}>{formatCurrency(savings.toString())}</Text>
            <Text style={styles.statLabel}>Tiết kiệm</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: ScaleUtils.floorScale(16),
    borderRadius: ScaleUtils.scale(16),
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryCard: {
    borderRadius: ScaleUtils.scale(16),
    overflow: 'hidden',
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
});

export default BalanceSummaryCard; 