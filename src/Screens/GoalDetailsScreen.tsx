import { StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native'
import React, { memo, useEffect, useState } from 'react'
import commonStyles from '@/utils/commonStyles'

import ScaleUtils from '@/utils/ScaleUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { delGoal, getGoals, getMonthlySaving, updateSavingAmount } from '@/redux/goalsSlice';
import { RootState } from '@/hooks/store';
import MongthyList from '@/components/Goals/MonthyList';
import { formatCurrency } from '@/utils/format';
import { getGoalReport } from '@/redux/reportSlice';
import GoalProgressChart from '@/components/Statisticcal/GoalProgressChart';
import Loading from '@/components/Loading';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';

const GoalDetailsView = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { params } = useRoute<RouteProp<RootStackParamList, 'GoalDetailsView'>>();

    const dispatch = useAppDispatch();
    const reportGoalState = useAppSelector((state: RootState) => state.report.goalsReport);
    const monthlySavingState = useAppSelector((state: RootState) => state.goals.monthlySaving);
    const { item: itemString } = params;
    const item = typeof itemString === 'string' ? JSON.parse(itemString) : itemString;

    // State quản lý modal và số tiền
    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        fetchMonthSaving();
    }, [])
    useEffect(() => {
        fetchGoalReport();
    }, [])
    const fetchMonthSaving = async () => {
        try {
            await dispatch(getMonthlySaving(item.id));
        } catch (error) {
            console.log("Loi lay danh sach tiet kiem:", error);
        }
    }

    const fetchGoalReport = async () => {
        try {
            await dispatch(getGoalReport(item.id));
        } catch (error) {
            console.log("Lỗi lấy báo cáo mục tiêu:", error);
        }
    }
    const handleUpdate = async () => {
        if (amount) {
            try {
                setIsLoading(true);
                await dispatch(updateSavingAmount({ id: item.id, amount_saved: Number(amount) }));
                fetchMonthSaving();
                setModalVisible(false);
                setAmount('');
                setIsLoading(false);
            } catch (error) {
                console.log("Lỗi cập nhật số tiền:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            alert("Vui lòng nhập số tiền hợp lệ");
        }
    }
    const handleDelete = async () => {
        Alert.alert("Xác nhận", "Bạn có chắc chắn muốn xoá mục tiêu này?", [
            { text: "Hủy", onPress: () => console.log("Cancel Pressed"), style: "cancel" },
            {
                text: "Xoá", onPress: async () => {
                    try {
                        await dispatch(delGoal(item.id.toString()));
                        navigation.goBack();
                    } catch (error) {
                        console.log("Lỗi xoá mục tiêu:", error);
                    } finally {
                        await dispatch(getGoals());
                    }
                }
            }
        ]);
    }

    return (
        <View>
            <View style={[commonStyles.row, commonStyles.jusBetween, { width: "98%" }]} >
                <View>
                    <TouchableOpacity onPress={() => navigation.goBack() } style={[{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: ScaleUtils.floorScale(40),
                        height: ScaleUtils.floorVerticalScale(32),
                        borderRadius: 50
                    }, commonStyles.alignCenter, commonStyles.jusCenter]}>
                        <MaterialIcons name="chevron-left" size={40} color="#4A90E2" />
                    </TouchableOpacity>

                    <Text style={{
                        fontSize: ScaleUtils.scaleFontSize(14), marginLeft: ScaleUtils.floorScale(40),
                        fontWeight: "bold", marginTop: ScaleUtils.floorVerticalScale(8)
                    }}>{item.name}</Text>
                </View>
                <View style={[commonStyles.row, { marginTop: ScaleUtils.floorVerticalScale(4) }]}>
                    <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.btnStyle, { backgroundColor: 'green' }]}>
                        <Text style={{ color: "#fff" }}>Đóng tiền</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete()} style={[styles.btnStyle, { backgroundColor: "red" }]}>
                        <Text style={{ color: "#fff" }}>Xoá mục tiêu</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Hiển thị Modal */}
            < Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Nhập số tiền muốn đóng</Text>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            placeholder="Nhập số tiền"
                            value={amount}
                            onChangeText={setAmount}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.textStyle}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSubmit]}
                                onPress={handleUpdate}
                            >
                                <Text style={styles.textStyle}>Cập nhật</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal >

            <View style={styles.goalItem}>
                {reportGoalState && (<GoalProgressChart data={reportGoalState} target={item.target_amount} />)}
                {/* <Text style={[styles.text_size]}>Số tiền hiện tại: {formatCurrency(item.current_amount.toString())}</Text>
                <Text style={[styles.text_size]}>Số tiền mục tiêu: {formatCurrency(item.target_amount.toString())}</Text>
                <View style={[]}>
                    <Text style={styles.text_time}>Bắt đầu: {new Date(item.createdAt).toLocaleDateString()}</Text>
                    <Text style={styles.text_time}>Kết thúc: {new Date(item.deadline).toLocaleDateString()}</Text>
                </View> */}
            </View>
            <View>
                <MongthyList data={monthlySavingState} />
            </View>
            {isLoading && <Loading />}
        </View >
    )
};

export default GoalDetailsView;

const styles = StyleSheet.create({
    goalItem: {
        padding: ScaleUtils.scale(5),
        marginTop: ScaleUtils.floorVerticalScale(10),
        backgroundColor: "#f9f9f9",
    },
    text_time: {
        fontSize: ScaleUtils.scaleFontSize(14),
    },
    text_size: {
        fontSize: ScaleUtils.scaleFontSize(14),
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: ScaleUtils.scale(14),
        padding: ScaleUtils.scale(20),
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: ScaleUtils.floorVerticalScale(15),
        textAlign: 'center',
        fontSize: ScaleUtils.scaleFontSize(16),
        fontWeight: 'bold',
    },
    input: {
        height: ScaleUtils.floorVerticalScale(36),
        borderColor: 'gray',
        borderWidth: 1,
        width: '100%',
        marginBottom: ScaleUtils.floorVerticalScale(10),
        paddingHorizontal: ScaleUtils.floorScale(10),
        borderRadius: 5,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: ScaleUtils.scale(5),
        padding: ScaleUtils.scale(10),
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: 'red',
        flex: 1,
        marginRight: ScaleUtils.floorScale(10),
    },
    buttonSubmit: {
        backgroundColor: 'green',
        flex: 1,
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    btnStyle: {
        height: ScaleUtils.floorVerticalScale(25),
        paddingHorizontal: ScaleUtils.scale(10),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: ScaleUtils.scale(10),
        marginHorizontal: ScaleUtils.floorScale(2),
    }
});
