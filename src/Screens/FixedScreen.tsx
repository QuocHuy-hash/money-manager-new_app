import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import ScaleUtils from '@/utils/ScaleUtils'
import { TouchableOpacity } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import commonStyles from '@/utils/commonStyles'
import DateRangePicker from '@/components/DateRangerPicker'
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook'
import { RootState } from '@/hooks/store'
import { deleteFixedExpense, getFixedExpense } from '@/redux/fixedExpenseSlice'
import { formatDateUK, getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/format';
import TransactionDetailsItem from '@/components/Transactions/TransactionDetailsItem'
import { FixedExpense, Transaction } from '@/utils/types'
import AddFixedExpenseModal from '@/components/FixedExpense/AddExpenseModal'
import TransactionDetails from '@/components/Transactions/TransactionDetails'
import { Alert } from 'react-native'
import { RefreshControl } from 'react-native'
import { KeyboardAvoidingView } from 'react-native'
import { Platform } from 'react-native'
const FixedScreen = () => {
    const dispatch = useAppDispatch();
    const fixedExpenseState = useAppSelector((state: RootState) => state.fixedExpense.expenseList);
    const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
    const [toDate, setToDate] = useState(getLastDayOfMonth());
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<FixedExpense | undefined>(undefined);
    const [refreshing, setRefreshing] = useState(false);

    const data = {
        startDate: formatDateUK(fromDate),
        endDate: formatDateUK(toDate),
    }
    useEffect(() => {
        fetchData(data);
    }, [dispatch]);

    const fetchData = useCallback(async (data: any) => {
        try {
            setRefreshing(true);
            await dispatch(getFixedExpense(data));
        } catch (error) {
            console.log("lỗi lấy dữ liệu chi phí cố định::", error);

        } finally {
            setRefreshing(false);
        }
    }, [])
    const handleConfirm = (startDate: any, endDate: any) => {
        if (startDate && endDate) {
            const data = {
                startDate,
                endDate
            }
        }
        setVisible(false);
    };
    const renderTransactionItem = ({ item }: { item: FixedExpense }) => {
        const data = { ...item, title: item.name }
        return <TransactionDetailsItem item={data} isEdit={true} onPressEdit={() => handleEdit(item)} handleDelete={() => handleDelete(item.id)} />;
    };
    const handleEdit = (item: FixedExpense) => {
        setSelectedExpense(item);
        setIsEdit(true);
        setModalVisible(true);
    };
    const handleDelete = (id: number) => {
        Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xóa chi phí này không?", [
            {
                text: "Hủy",
                onPress: () => { },
                style: "cancel"
            },
            {
                text: "Xóa",
                onPress: async () => {
                    try {
                        await dispatch(deleteFixedExpense(id));
                        await dispatch(getFixedExpense(data));
                    } catch (error) {
                        console.log("lỗi xóa chi phí cố định::", error);
                    }
                }
            }
        ]);
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <DateRangePicker
                visible={visible}
                onConfirm={handleConfirm}
                onCancel={() => setVisible(false)}
            />
            <View style={[commonStyles.row, commonStyles.jusBetween, { padding: ScaleUtils.scale(10) }]}>
                <Text style={{ fontSize: ScaleUtils.scaleFontSize(14), marginTop: 10, fontWeight: "700" }}>Chi phí cố định</Text>
                <View style={[commonStyles.row, commonStyles.jusBetween, { width: ScaleUtils.floorScale(60) }]}>
                    <TouchableOpacity onPress={() => setVisible(true)} style={[{}]}>
                        <MaterialIcons name="edit-calendar" size={30} color="blue" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setIsEdit(false); setModalVisible(true) }} >
                        <MaterialIcons name="add-circle" size={35} color="green" />
                    </TouchableOpacity>
                </View>
            </View>
            {/* line */}
            <View style={{ borderBottomWidth: 1, height: 2, borderBottomColor: "green", marginHorizontal: 10 }}></View>

            <View style={{ paddingHorizontal: ScaleUtils.scale(10), marginTop: ScaleUtils.floorScale(2) }}>
                <FlatList
                    data={fixedExpenseState || []}
                    renderItem={renderTransactionItem}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có giao dịch nào</Text>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(data)} />
                    }
                />
            </View>
            <AddFixedExpenseModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                isEdit={isEdit}
                item={selectedExpense}
            />
        </KeyboardAvoidingView >
    )
}

export default FixedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnAdd: {
        borderRadius: ScaleUtils.scaleFontSize(10),
        padding: ScaleUtils.scaleFontSize(6),
        marginVertical: 10,
    },
})