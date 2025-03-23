import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TransactionItem from '@/components/Transactions/TransactionItem';
import { Dimensions } from 'react-native';
import TransactionDetails from '@/components/Transactions/TransactionDetails';
import ScaleUtils from '@/utils/ScaleUtils';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { getTransactionByCategories, getTransactions, getTransactionsSummary } from '@/redux/transactions.slice';
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
    
    // Quản lý ngày tháng riêng cho Transaction screen
    const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
    const [toDate, setToDate] = useState(getLastDayOfMonth());

    const [activeTab, setActiveTab] = useState(1);
    const tabIndicatorPosition = useRef(new Animated.Value(TAB_WIDTH)).current;
    const [visible, setVisible] = useState(false);
    const [visibleDetailSummary, setVisibleDetailSummary] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Tạo object data từ fromDate và toDate
    const getQueryData = () => ({
        startDate: formatDateUK(fromDate),
        endDate: formatDateUK(toDate),
    });
    
    useEffect(() => {
        Animated.spring(tabIndicatorPosition, {
            toValue: activeTab * TAB_WIDTH,
            useNativeDriver: true,
        }).start();
    }, [activeTab]);

    // Load dữ liệu ban đầu
    useEffect(() => {
        refreshTransactionData();
    }, []);

    // Refresh dữ liệu khi ngày tháng thay đổi
    useEffect(() => {
        refreshTransactionData();
    }, [fromDate, toDate]);

    const refreshTransactionData = async () => {
        try {
            setIsLoading(true);
            const data = getQueryData();
            await Promise.all([
                getTransactionSummary(data),
                fetchTransactions(data)
            ]);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu giao dịch:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTabPress = (tabIndex: number) => {
        setActiveTab(tabIndex);
    };

    const getTransactionSummary = async (data: any) => {
        return dispatch(getTransactionsSummary(data));
    };
    
    const fetchTransactions = async (data: any) => {
        return dispatch(getTransactions(data));
    };

    const handleConfirm = (startDate: string, endDate: string) => {
        if (startDate && endDate) {
            // Chuyển đổi string date sang Date object
            const fromDateObj = new Date(startDate.split('-').join('/'));
            const toDateObj = new Date(endDate.split('-').join('/'));
            
            // Cập nhật state trong component
            setFromDate(fromDateObj);
            setToDate(toDateObj);
            
            setVisible(false);
        }
    };
    
    const handleDetailsByCategory = async (item: any) => {
        const data = {
            ...getQueryData(),
            categoryId: item.categoryId
        };
        const res = await dispatch(getTransactionByCategories(data));
        if (res?.meta.requestStatus === "fulfilled") {
            setVisibleDetailSummary(true);
        }
    };

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

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text>Đang tải dữ liệu...</Text>
                </View>
            ) : (
                <>
                    {activeTab === 1 && (
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
                    {activeTab === 0 && (
                        <TransactionDetails transactionListState={transactionListState} />
                    )}
                    {activeTab === 2 && (
                        <Reports customDateRange={{ fromDate, toDate }} />
                    )}
                </>
            )}

            <SummaryItemDetails
                visible={visibleDetailSummary}
                transactionByCategoryState={transactionByCategoryState}
                setVisibleDetailSummary={setVisibleDetailSummary}
            />
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
        height: ScaleUtils.floorVerticalScale(35),
        marginBottom: ScaleUtils.floorVerticalScale(10),
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
        fontWeight: 'bold',
        fontSize: ScaleUtils.scaleFontSize(12),
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TransactionList;