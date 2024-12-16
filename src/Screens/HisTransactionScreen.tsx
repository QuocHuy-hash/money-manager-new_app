import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Animated } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TransactionItem from '@/components/Transactions/TransactionItem';
import { Dimensions } from 'react-native';
import TransactionDetails from '@/components/Transactions/TransactionDetails';
import ScaleUtils from '@/utils/ScaleUtils';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { getTransactionByCategorys, getTransactions, getTransactionsSummary } from '@/redux/transactions.slice';
import { RootState } from '@/hooks/store';
import { formatDateUK, getFirstDayOfMonth, getLastDayOfMonth, getTimeFromStartOfYearToNow } from '@/utils/format';
import DateRangePicker from '@/components/DateRangerPicker';
import commonStyles from '@/utils/commonStyles';
import SummaryItemDetails from '@/components/Transactions/SummaryItemDetails';
import Reports from '@/components/Statisticcal/Reports';

const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 4;

const TransactionList: React.FC = () => {
    const dispatch = useAppDispatch();
    const transactionListState = useAppSelector((state: RootState) => state.transaction.transactionList);
    const transactionSummaryState = useAppSelector((state: RootState) => state.transaction.transactionSummary);
    const transactionByCategoryState = useAppSelector((state: RootState) => state.transaction.transactionByCategory);
   
    const [fromDate, setFromDate] = useState(getTimeFromStartOfYearToNow().startOfYear); // Lấy ngày bắt đầu của năm
    const [toDate, setToDate] = useState(getLastDayOfMonth()); // Lấy ngày cuối cùng của tháng hiện tại

    const [activeTab, setActiveTab] = useState(1);
    const tabIndicatorPosition = useRef(new Animated.Value(TAB_WIDTH)).current;
    const [visible, setVisible] = useState(false);
    const [visibleDetailSummary, setVisibleDetailSummary] = useState(false);

    const data = {
        startDate: formatDateUK(fromDate),
        endDate: formatDateUK(toDate),
    }
    useEffect(() => {
        Animated.spring(tabIndicatorPosition, {
            toValue: activeTab * TAB_WIDTH,
            useNativeDriver: true,
        }).start();
    }, [activeTab]);

    useEffect(() => {
        getTransactionSummary(data);
        fetchTransactions(data);
    }, []);

    const handleTabPress = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };

    const getTransactionSummary = async (data: any) => {
        await dispatch(getTransactionsSummary(data));
    };
    const fetchTransactions = async (data: any) => {
        await dispatch(getTransactions(data));
    };

    const handleConfirm = (startDate: any, endDate: any) => {
        if (startDate && endDate) {
            const data = {
                startDate,
                endDate
            }
            getTransactionSummary(data);
            fetchTransactions(data);
        }
        setVisible(false);
    };
    const handleDetailsByCategory = async (item:any) => { 
        const data = {
            startDate: formatDateUK(fromDate),
            endDate: formatDateUK(toDate),
            categoryId: item.categoryId
        }
        const res = await dispatch(getTransactionByCategorys(data));
        if (res?.meta.requestStatus === "fulfilled") {
            setVisibleDetailSummary(true);
        }
}
    return (
        <SafeAreaView style={styles.container}>
            <DateRangePicker
                visible={visible}
                onConfirm={handleConfirm}
                onCancel={() => setVisible(false)}
            />
            <View style={styles.tabContainer}>
                <Animated.View
                    style={[
                        styles.tabIndicator,
                        { transform: [{ translateX: tabIndicatorPosition }] }
                    ]}
                />
                <TouchableOpacity style={styles.tab} onPress={() => handleTabPress(0)}>
                    <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>Chi tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => handleTabPress(1)}>
                    <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>Tổng quan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.tab} onPress={() => handleTabPress(2)}>
                    <Text style={[styles.tabText, activeTab === 2 && styles.activeTabText]}>Thống kê</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setVisible(true)} style={[styles.tab, commonStyles.row]}>
                    <MaterialIcons name="edit-calendar" size={26} color="#007AFF" />
                </TouchableOpacity>

            </View>
            
            {activeTab == 1 && (
                <FlatList
                    style={{ paddingHorizontal: ScaleUtils.floorScale(10) }}
                    data={Object.values(transactionSummaryState?.categoryTotals ?? {})}
                    renderItem={({ item }) => <TransactionItem item={item} handleDetails={() => handleDetailsByCategory(item)} />}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có giao dịch nào</Text>
                    }
                />
            )}
            <SummaryItemDetails
                visible={visibleDetailSummary}
                transactionByCategoryState={transactionByCategoryState}
                setVisibleDetailSummary={setVisibleDetailSummary}
            />
            {activeTab == 0 && (
                <TransactionDetails transactionListState={transactionListState} />
            )}
            {/* line */}
            {activeTab == 2 && (
                <Reports />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        height: ScaleUtils.floorVerticalScale(40),
        marginBottom: ScaleUtils.floorVerticalScale(6),
        position: 'relative',
    },
    tab: {
        paddingVertical: ScaleUtils.floorVerticalScale(6),
        paddingHorizontal: ScaleUtils.floorScale(2),
        justifyContent: 'center',
        width: TAB_WIDTH,
        alignItems: 'center',
    },
    tabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: TAB_WIDTH,
        height: 2,
        backgroundColor: '#007AFF',
    },
    tabText: {
        color: '#888',
        fontSize: ScaleUtils.scaleFontSize(14),
    },
    activeTabText: {
        color: '#007AFF',
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: ScaleUtils.floorVerticalScale(10),
    },
    datePickerButton: {
        alignItems: 'center',
    },
});

export default TransactionList;