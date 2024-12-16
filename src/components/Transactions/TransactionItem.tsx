import TypeIcon from '@/common/renderTypeIcon';
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
        <TouchableOpacity style={styles.transactionItem} onPress={handleDetails}>
            <View style={styles.iconContainer}>

                <TypeIcon type={item?.categoryName} size={24} color="red" />
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
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: ScaleUtils.floorScale(8),
        borderWidth: 1,
        borderColor: '#f0f0f0',
        marginVertical: ScaleUtils.floorVerticalScale(3),
        paddingVertical: ScaleUtils.scaleFontSize(4),
        paddingHorizontal: ScaleUtils.floorScale(10),
        shadowColor: '#133b1e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: ScaleUtils.floorScale(30),
        height: ScaleUtils.floorVerticalScale(36),
        borderRadius: ScaleUtils.floorScale(20),
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: ScaleUtils.floorScale(12),
    },
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
