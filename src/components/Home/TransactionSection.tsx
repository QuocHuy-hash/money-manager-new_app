import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScaleUtils from '@/utils/ScaleUtils';
import TransactionItem from '@/components/Transactions/TransactionItem';

interface TransactionSectionProps {
  transactions: any[];
  onDetailPress: (item: any) => void;
  onViewAllPress: () => void;
  onAddTransactionPress: () => void;
}

const TransactionSection = ({ 
  transactions, 
  onDetailPress, 
  onViewAllPress,
  onAddTransactionPress
}: TransactionSectionProps) => {
  
  const renderSectionHeader = () => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Giao dịch gần đây</Text>
      <TouchableOpacity onPress={onViewAllPress}>
        <Text style={styles.viewAllText}>Xem tất cả</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyTransactions = () => (
    <View style={styles.emptyContainer}>
      <MaterialIcons name="receipt-long" size={60} color="#ccc" />
      <Text style={styles.emptyText}>Không có giao dịch nào</Text>
      <TouchableOpacity style={styles.addButton} onPress={onAddTransactionPress}>
        <Text style={styles.addButtonText}>+ Thêm giao dịch mới</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      {renderSectionHeader()}
      <View style={styles.transactionsList}>
        {transactions.length > 0 ? (
          transactions
            .filter((item: any) => item.categoryName !== 'Lương')
            .map((item, index) => (
              <TransactionItem
                key={index}
                item={item}
                handleDetails={() => onDetailPress(item)}
              />
            ))
        ) : (
          renderEmptyTransactions()
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
});

export default TransactionSection; 