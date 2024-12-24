
import TypeIcon from '@/common/renderTypeIcon';
import commonStyles from '@/utils/commonStyles';
import { formatCurrency, formatDateTime } from '@/utils/format';
import ScaleUtils from '@/utils/ScaleUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const TransactionDetailsItem = ({ item, isEdit, onPressEdit, handleDelete }: { item: any, isEdit: boolean, onPressEdit?: () => void, handleDelete?: () => void }) => {
    const [showPrice, setShowPrice] = React.useState(false);
    return (
        <View style={commonStyles.transactionItem}>
            <View style={commonStyles.iconContainer}>
                <TypeIcon type={item.category?.name} size={24} color={item.transaction_type == 'Chi tiêu' ? "#497ff2" : "#497ff2"} />
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionDate}>{formatDateTime(item.transaction_date)}</Text>

            </View>
            <View style={[]}>
                <View style={styles.amountContainer}>

                    <Text style={styles.amount}>
                        {item.transaction_type === 'Thu nhập'
                            ? (showPrice ? formatCurrency(item.amount) : '******')
                            : formatCurrency(item.amount)
                        }
                    </Text>
                    {item.transaction_type === 'Thu nhập' ? (
                        <TouchableOpacity onPress={() => setShowPrice(!showPrice)}>
                            <MaterialIcons name={showPrice ? 'visibility' : 'visibility-off'} size={20} color="#497ff2" />
                        </TouchableOpacity>
                    ) : null}
                    {/* <Text style={styles.percentage}>{item.percentage}</Text> */}
                </View>
                {isEdit && onPressEdit ? (
                    <View style={[commonStyles.row, commonStyles.jusEnd]}>
                        <TouchableOpacity onPress={onPressEdit}>
                            <MaterialIcons name="create-outline" size={24} color="green" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDelete}>
                            <MaterialIcons name="trash-outline" size={24} color="red" />
                        </TouchableOpacity>

                    </View>
                ) : (<></>)}


            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    transactionDetails: {
        flex: 1,

    },
    transactionTitle: {
        color: '#555',
        marginBottom: ScaleUtils.scaleFontSize(4),
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: 'bold',
    },
    transactionDate: {
        color: '#888',
        fontSize: ScaleUtils.scaleFontSize(10),
    },
    amountContainer: {
        alignItems: 'flex-end',
        flexDirection: 'row',
    },
    amount: {
        fontSize: ScaleUtils.scaleFontSize(12),
        fontWeight: 'bold',
        marginRight: ScaleUtils.floorScale(4),
    },
    percentage: {
        color: '#FF3B30',
        fontSize: ScaleUtils.scaleFontSize(12),
    },
});

export default TransactionDetailsItem;
