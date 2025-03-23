import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import ScaleUtils from '@/utils/ScaleUtils';
import { formatCurrency, formatDate } from '@/utils/format';
import commonStyles from '@/utils/commonStyles';

const MongthyList = ({ data }: { data: any, }) => {
    const renderItem = ({ item }: { item: any }) => {
        return (
            <View style={styles.goalItem}>
                <Text style={[styles.text_size, { color: 'blue', flex: 1 }]}>
                    {formatDate(item.createdAt.toString())}
                </Text>
                <Text style={[styles.text_size, { fontWeight: "600", color: "#666", flex: 1, textAlign: 'center' }]}>
                    {formatCurrency(item.amount_saved ? item.amount_saved.toString() : 0)}
                </Text>
                <Text style={[styles.text_size, { color: "green", flex: 1, textAlign: 'center' }]}>
                    {`${Math.floor(item.percentage_of_goal)}%`}
                </Text>
            </View>
        );
    };

    const ListHeader = () => (
        <View style={[styles.goalItem, styles.headerItem]}>
            <Text style={[styles.headerText, { flex: 1 }]}>Ngày</Text>
            <Text style={[styles.headerText, { flex: 1, textAlign: 'center' }]}>Số tiền</Text>
            <View style={[{ flex: 1, }, commonStyles.alignCenter]}>
                <Text style={[styles.headerText, { flex: 1, textAlign: 'right' }]}>Tiến độ</Text>
                <Text style={[{ fontSize: ScaleUtils.scaleFontSize(10), flex: 1, textAlign: 'right' }]}>(so với tổng MT)</Text>
            </View>
        </View>
    );

    return (
        <View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ListHeaderComponent={ListHeader}
                style={{ marginVertical: ScaleUtils.floorVerticalScale(10), padding: ScaleUtils.scale(10) }}
            />
            {data && data.length === 0 && (
                <Text style={{ textAlign: 'center', marginTop: 100, fontSize: ScaleUtils.scaleFontSize(16) }}>
                    Không có dữ liệu
                </Text>
            )}
        </View>
    );
};

export default MongthyList;

const styles = StyleSheet.create({
    goalItem: {
        padding: ScaleUtils.scale(2),
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        borderRadius: ScaleUtils.scale(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    headerItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#555',
        marginBottom: ScaleUtils.floorVerticalScale(10),
    },
    headerText: {
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: 'bold',
        color: '#000',
    },
    text_size: {
        fontSize: ScaleUtils.scaleFontSize(12),
    },
});
