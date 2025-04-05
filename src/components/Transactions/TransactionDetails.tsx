import React, { memo, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScaleUtils from '@/utils/ScaleUtils';
import commonStyles from '@/utils/commonStyles';
import AddTransactionModal from './AddTransactionModal';
import { Transaction } from '@/utils/types';
import TransactionDetailsItem from './TransactionDetailsItem';

const TransactionDetails = (data: any) => {
    const [activeTab, setActiveTab] = useState(1);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        // Animate the transition between the two tabs
        Animated.timing(animatedValue, {
            toValue: activeTab === 1 ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [activeTab]);

    const backgroundColorTab1 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['white', 'blue'],
    });

    const backgroundColorTab2 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['blue', 'white'],
    });

    const textColorTab1 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#555', '#fff'],
    });

    const textColorTab2 = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#fff', '#555'],
    });

    const handleAddTransaction = (transaction: Transaction) => {
        // Xử lý khi thêm giao dịch mới
        console.log('Transaction Added:', transaction);
    };

    const renderTransactionItem = ({ item }: { item: Transaction }) => {
        return <TransactionDetailsItem item={item} isEdit={false} />;
    };

    return (

        <View style={styles.tabContainer}>
            <View style={[commonStyles.row, commonStyles.jusBetween]}>
                <View style={[commonStyles.row]}>
                    <TouchableOpacity onPress={() => setActiveTab(0)}>
                        <Animated.View style={[styles.tab, { backgroundColor: backgroundColorTab1 }]}>
                            <Animated.Text style={[styles.tabText, { color: textColorTab1 }]}>
                                Chi tiêu
                            </Animated.Text>
                        </Animated.View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setActiveTab(1)}>
                        <Animated.View style={[styles.tab, { backgroundColor: backgroundColorTab2 }]}>
                            <Animated.Text style={[styles.tabText, { color: textColorTab2 }]}>
                                Thu nhập
                            </Animated.Text>
                        </Animated.View>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[commonStyles.jusCenter, styles.btnAdd, commonStyles.row]}
                    onPress={() => setModalVisible(true)}
                >handleAddTransaction
                    <Text style={{ color: '#497ff2', fontSize: ScaleUtils.scaleFontSize(12), fontWeight: 'bold' }}>
                        Thêm mới
                    </Text>
                    <MaterialIcons name="add-circle" size={20} color="#497ff2" />
                </TouchableOpacity>
            </View>
            <AddTransactionModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleAddTransaction}
            />
            {/* FlatList để hiển thị giao dịch */}
            <FlatList
                data={data.transactionListState && Array.isArray(data.transactionListState) ? data.transactionListState.filter((item: any) =>
                    activeTab === 0 ? item.transaction_type === 'Chi tiêu' : item.transaction_type === 'Thu nhập'
                ) : []}
                renderItem={renderTransactionItem}
                keyExtractor={(item) => item.id.toString()}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có giao dịch nào</Text>
                }
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default memo(TransactionDetails);

const styles = StyleSheet.create({
    tabContainer: {
        flex: 1,
        paddingHorizontal: ScaleUtils.floorScale(10),
        marginBottom: ScaleUtils.floorVerticalScale(16),
    },
    tab: {
        padding: ScaleUtils.scaleFontSize(4),
        borderRadius: 10,
        marginHorizontal: 5,
    },
    tabText: {
        fontSize: ScaleUtils.scaleFontSize(12),
        fontWeight: 'bold',
    },
    btnAdd: {
        borderRadius: ScaleUtils.scaleFontSize(10),
        padding: ScaleUtils.scaleFontSize(6),
        marginVertical: ScaleUtils.floorVerticalScale(2),
    },
});
