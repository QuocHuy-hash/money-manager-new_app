import TypeIcon from '@/common/renderTypeIcon';
import commonStyles from '@/utils/commonStyles';
import { formatCurrency, formatDate } from '@/utils/format';
import ScaleUtils from '@/utils/ScaleUtils';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
interface handleDetails {
    handleDetails?: (item : any) => void
    item: any
}
const TransactionItem = ({ item, handleDetails }: handleDetails) => {
    if (item.categoryName === 'Lương') {return null;}
    return (
        <TouchableOpacity style={commonStyles.transactionItem} onPress={handleDetails}>
            <View style={commonStyles.iconContainer}>
                <TypeIcon type={item?.categoryName} size={24} color="#497ff2" />
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.categoryName}</Text>
                <Text style={styles.transactionDate}>{formatDate(item.representativeDate)}</Text>

                {/* <Text style={styles.transactionDate}>{formatCurrency(item.totalAmount)}</Text> */}
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.amount}>{formatCurrency(item.totalAmount)}</Text>
                <Text style={styles.percentage}>{`-${item.percentage} %`}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        color: '#555',
        fontSize: ScaleUtils.scaleFontSize(12),
        fontWeight: 'bold',
    },
    transactionDate: {
        color: '#888',
        fontSize: ScaleUtils.scaleFontSize(10),
    },
    amountContainer: {
        alignItems: 'flex-end',
    },
    amount: {
        fontSize: ScaleUtils.scaleFontSize(12),
    },
    percentage: {
        color: '#FF3B30',
        fontSize: ScaleUtils.scaleFontSize(12),
    },
});

export default TransactionItem;
