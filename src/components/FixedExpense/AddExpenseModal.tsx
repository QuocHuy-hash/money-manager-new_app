import React, { memo, useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScaleUtils from '@/utils/ScaleUtils';
import { formatCurrency, formatDateTimeVietnamese, formatDateUK, getFirstDayOfMonth, getLastDayOfMonth } from '@/utils/format';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { getTransactionCategorys, getTransactions } from '@/redux/transactions.slice';
import { FixedExpense, frequencyOptions } from '@/utils/types';
import { RootState } from '@/hooks/store';
import { renderCategoryModal } from '../RenderCategoryModal';
import { addFixedExpense, getFixedExpense, updateFixedExpense } from '@/redux/fixedExpenseSlice';
import { format } from 'date-fns';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';

interface AddFixedExpenseModalProps {
    visible: boolean;
    onClose: () => void;
    item?: FixedExpense;
    isEdit: boolean;
}

const AddFixedExpenseModal: React.FC<AddFixedExpenseModalProps>
    = memo(({ visible, onClose, item, isEdit }) => {
        const dispatch = useAppDispatch();
        const categoryListState = useAppSelector((state: RootState) => state.transaction.categoryList);
        const [amount, setAmount] = useState<string>(item?.amount || '');
        const [description, setDescription] = useState<string>(item?.name || '');
        const [date, setDate] = useState<Date>(item ? new Date(item.start_date) : new Date());
        const [category, setCategory] = useState<string>('');
        const [category_id, setCategory_id] = useState<number | undefined>(item?.category_id);
        const [note, setNote] = useState<string>(item?.description || '');
        const [frequency, setFrequency] = useState<string>(item?.frequency || '');
        const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
        const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
        const [fromDate, setFromDate] = useState(getFirstDayOfMonth());
        const [toDate, setToDate] = useState(getLastDayOfMonth());

        useEffect(() => {
            if (isEdit && item) {
                setAmount(item.amount);
                setDescription(item.name);
                setDate(new Date(item.start_date));
                setCategory_id(item.category_id);
                setNote(item.description || '');
                setFrequency(item.frequency || '');
            } else {
                resetForm();
            }
        }, [isEdit, item]);
        useEffect(() => {
            const getCategory = async () => {
                await dispatch(getTransactionCategorys());
            };
            getCategory();
        }, [dispatch]);

        const handleAddTransaction = async () => {
            if (amount && description && category_id !== undefined) {
                const formattedStartDate = format(date, 'yyyy-MM-dd HH:mm:ss');
                const formattedEndDate = format(date, 'yyyy-MM-dd HH:mm:ss');

                const newFixedExpense = {
                    id: isEdit && item ? item.id : 0,
                    amount,
                    name: description,
                    start_date: formattedStartDate,
                    end_date: formattedEndDate,
                    category_id,
                    description: note,
                    frequency,
                };
                let res;
                if (isEdit && item) {
                    // Nếu là update
                    res = await dispatch(updateFixedExpense(newFixedExpense));

                } else {
                    // Thêm mới
                    res = await dispatch(addFixedExpense(newFixedExpense));
                }
                console.log('res', res);
                if (res?.meta.requestStatus === "fulfilled") {
                    const data = {
                        startDate: formatDateUK(fromDate),
                        endDate: formatDateUK(toDate),
                    };
                    await dispatch(getFixedExpense(data));
                }

                resetForm();
                onClose();
            } else {
                console.log('Please fill in all required fields');
            }
        };
        const resetForm = () => {
            setAmount('');
            setDescription('');
            setDate(new Date());
            setCategory('');
            setCategory_id(undefined);
            setNote('');
            setFrequency('');
        };
        const handleDateChange = (event: any, selectedDate?: Date) => {
            setShowDatePicker(false);
            if (selectedDate) {
                setDate(selectedDate);
            }
        };

        const handleAmountChange = (text: string) => {
            const numericValue = text.replace(/[^0-9]/g, '');
            setAmount(numericValue);
        };

        const handleFrequencyChange = (value: string) => {
            setFrequency(value);
        };

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>{isEdit ? 'Chỉnh sửa chi phí cố định' : 'Thêm mới chi phí cố định'}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Mô tả"
                                value={description}
                                onChangeText={setDescription}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Số tiền"
                                value={formatCurrency(amount)}
                                onChangeText={handleAmountChange}
                                keyboardType="numeric"
                            />


                            <TouchableOpacity
                                style={styles.input}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text>{formatDateTimeVietnamese(date)}</Text>
                            </TouchableOpacity>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={date}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}

                            <TouchableOpacity style={styles.input} onPress={() => setShowCategoryModal(true)}>
                                <Text>{category || 'Chọn danh mục'}</Text>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.input}
                                placeholder="Ghi chú (tùy chọn)"
                                value={note}
                                onChangeText={setNote}
                                multiline
                            />

                            <Text style={styles.sectionTitle}>Chọn tần suất</Text>
                            <View style={styles.checkboxGroup}>
                                {frequencyOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={styles.checkboxContainer}
                                        onPress={() => handleFrequencyChange(option.value)}
                                    >
                                        <MaterialIcons
                                            name={frequency === option.value ? 'radio-button-on' : 'radio-button-off'}
                                            size={20}
                                            color="green"
                                        />
                                        <Text style={styles.checkboxLabel}>{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
                                <Text style={styles.addButtonText}>Thêm</Text>
                                <MaterialIcons name="add-circle" size={24} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {renderCategoryModal(categoryListState, showCategoryModal, (name, id) => {
                        setCategory(name);
                        setCategory_id(id);
                    }, () => setShowCategoryModal(false))}
                </Modal>
            </KeyboardAvoidingView>
        );
    });
export default memo(AddFixedExpenseModal);

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
        borderRadius: ScaleUtils.scaleFontSize(10),
        padding: ScaleUtils.scaleFontSize(16),
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: ScaleUtils.scaleFontSize(18),
        fontWeight: 'bold',
        marginBottom: ScaleUtils.scaleFontSize(10),
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: ScaleUtils.scaleFontSize(6),
        padding: ScaleUtils.scaleFontSize(8),
        marginBottom: ScaleUtils.scaleFontSize(10),
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'green',
        paddingVertical: ScaleUtils.scaleFontSize(10),
        paddingHorizontal: ScaleUtils.scaleFontSize(20),
        borderRadius: ScaleUtils.scaleFontSize(6),
        marginTop: ScaleUtils.scaleFontSize(10),
    },
    addButtonText: {
        color: 'white',
        fontSize: ScaleUtils.scaleFontSize(16),
        marginRight: ScaleUtils.scaleFontSize(10),
    },
    closeButton: {
        marginTop: ScaleUtils.scaleFontSize(10),
    },
    closeButtonText: {
        color: 'red',
        fontSize: ScaleUtils.scaleFontSize(16),
    },
    sectionTitle: {
        fontSize: ScaleUtils.scaleFontSize(16),
        fontWeight: 'bold',
        marginBottom: ScaleUtils.scaleFontSize(10),
    },
    checkboxGroup: {
        flexDirection: 'row',         // Horizontal layout
        flexWrap: 'wrap',             // Allow wrapping
        marginBottom: ScaleUtils.scaleFontSize(10),
        justifyContent: 'center',     // Optional: Center the checkboxes
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: ScaleUtils.scaleFontSize(5),
        marginRight: ScaleUtils.scaleFontSize(6),  // Add spacing between checkboxes
    },
    checkboxLabel: {
        marginLeft: ScaleUtils.scaleFontSize(2),
    },
});
