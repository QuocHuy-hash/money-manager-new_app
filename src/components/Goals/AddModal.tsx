import React, { memo, useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScaleUtils from '@/utils/ScaleUtils';
import { formatCurrency, formatDateTimeVietnamese } from '@/utils/format';
import { useAppDispatch } from '@/hooks/reduxHook';
import { getTransactionCategorys } from '@/redux/transactions.slice';
import { Goal } from '@/utils/types';
import commonStyles from '@/utils/commonStyles';
import { createGoals, getGoals } from '@/redux/goalsSlice';
import { Platform } from 'react-native';
import { KeyboardAvoidingView } from 'react-native';

interface AddModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (goal: Goal) => void;
}

const AddModal: React.FC<AddModalProps> = memo(({ visible, onClose, onSubmit }) => {
    const dispatch = useAppDispatch();

    const [name, setName] = useState<string>('');
    const [targetAmount, setTargetAmount] = useState<string>('');
    const [currentAmount, setCurrentAmount] = useState<string>('');
    const [deadline, setDeadline] = useState<Date>(new Date());
    const [reminderDay, setReminderDay] = useState<number>(10);
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    useEffect(() => {
        const getCategory = async () => {
            await dispatch(getTransactionCategorys());
        };
        getCategory();
    }, []);

    const handleAddTransaction = async () => {
        if (name && targetAmount && currentAmount && deadline) {
            const newGoal = {
                name,
                target_amount: Number(targetAmount),
                current_amount: Number(currentAmount),
                deadline,
                reminder_day: reminderDay,
            };
            const res = await dispatch(createGoals(newGoal));
            console.log('res', res);
            if (res?.meta.requestStatus === "fulfilled") {
                await dispatch(getGoals());
            }
            onClose();
        } else {
            console.log('Please fill in all required fields');
        }
    };

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDeadline(selectedDate);
        }
    };

    const handleAmountChange = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setTargetAmount(numericValue);
    };
    const handleAmountCurrent = (text: string) => {
        const numericValue = text.replace(/[^0-9]/g, '');
        setCurrentAmount(numericValue);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                                <Text style={styles.modalTitle}>Thêm mục tiêu mới</Text>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Tên mục tiêu</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập tên mục tiêu"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Số tiền mục tiêu</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập số tiền mục tiêu"
                                        value={formatCurrency(targetAmount)}
                                        onChangeText={handleAmountChange}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Số tiền hiện tại</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập số tiền hiện tại"
                                        value={formatCurrency(currentAmount)}
                                        onChangeText={handleAmountCurrent}
                                        keyboardType="numeric"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Ngày thông báo nhắc nhở*</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập ngày"
                                        value={reminderDay.toString()}
                                        onChangeText={(text) => setReminderDay(Number(text))}
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>Chọn ngày</Text>
                                    <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
                                        <Text>{formatDateTimeVietnamese(deadline)}</Text>
                                    </TouchableOpacity>
                                    {showDatePicker && (
                                        <DateTimePicker
                                            value={deadline}
                                            mode="date"
                                            display="default"
                                            onChange={handleDateChange}
                                        />
                                    )}
                                </View>
                                <View style={[commonStyles.row, commonStyles.jusAround, commonStyles.alignCenter]}>
                                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                        <Text style={styles.closeButtonText}>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
                                        <Text style={styles.addButtonText}>Thêm</Text>
                                        <MaterialIcons name="add-circle" size={24} color="white" />
                                    </TouchableOpacity>
                                </View>

                            </ScrollView>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </KeyboardAvoidingView>
    );
});

export default memo(AddModal);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: ScaleUtils.scaleFontSize(12),
        padding: ScaleUtils.scaleFontSize(16),
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: ScaleUtils.scaleFontSize(20),
        fontWeight: '600',
        marginBottom: ScaleUtils.scaleFontSize(16),
        color: '#333',
    },
    inputGroup: {
        width: '100%',
        marginBottom: ScaleUtils.scaleFontSize(12),
    },
    label: {
        marginBottom: 4,
        fontSize: ScaleUtils.scaleFontSize(14),
        color: '#555',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: ScaleUtils.scaleFontSize(8),
        padding: ScaleUtils.scaleFontSize(10),
        backgroundColor: '#f9f9f9',
    },
    datePicker: {
        width: ScaleUtils.floorScale(280),
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: ScaleUtils.scaleFontSize(8),
        padding: ScaleUtils.scaleFontSize(10),
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingVertical: ScaleUtils.scaleFontSize(12),
        paddingHorizontal: ScaleUtils.scaleFontSize(20),
        borderRadius: ScaleUtils.scaleFontSize(8),
        marginTop: ScaleUtils.scaleFontSize(16),
    },
    addButtonText: {
        color: 'white',
        fontSize: ScaleUtils.scaleFontSize(16),
        marginRight: ScaleUtils.scaleFontSize(8),
    },
    closeButton: {
        marginTop: ScaleUtils.scaleFontSize(12),
    },
    closeButtonText: {
        color: '#F44336',
        fontSize: ScaleUtils.scaleFontSize(16),
    },
});
