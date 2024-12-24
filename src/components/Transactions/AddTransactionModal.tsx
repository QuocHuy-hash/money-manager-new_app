import React, { memo, useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, TouchableWithoutFeedback } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScaleUtils from '@/utils/ScaleUtils';
import { formatCurrency, formatDateTimeVietnamese, formatDateUK, getFirstDayOfMonth, getLastDayOfMonth, getTimeFromStartOfYearToNow } from '@/utils/format';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { addTransaction, getTransactionCategorys, getTransactions, getTransactionsSummary } from '@/redux/transactions.slice';
import { Transaction, types } from '@/utils/types';
import { RootState } from '@/hooks/store';
import { renderCategoryModal } from '../RenderCategoryModal';
import { renderTypeModal } from '../RenderTypeModal';
import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import commonStyles from '@/utils/commonStyles';

interface AddTransactionModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (transaction: Transaction) => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ visible, onClose, onSubmit }) => {
    const dispatch = useAppDispatch();
    const categoryListState = useAppSelector((state: RootState) => state.transaction.categoryList);
    const [amount, setAmount] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<Date>(new Date());
    const [type, setType] = useState<string>('');
    const [category, setCategory] = useState<string>('');
    const [category_id, setCategory_id] = useState<number | undefined>();
    const [note, setNote] = useState<string>('');
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [showTypeModal, setShowTypeModal] = useState<boolean>(false);
    const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
    const [fromDate, setFromDate] = useState(getTimeFromStartOfYearToNow().startOfYear);
    const [toDate, setToDate] = useState(getLastDayOfMonth());

    useEffect(() => {
        const getCategory = async () => {
            await dispatch(getTransactionCategorys());
        };
        getCategory();
    }, []);

    const handleAddTransaction = async () => {
        if (amount && description && category_id !== undefined) {
            const newTransaction: Transaction = {
                id: 0,
                amount,
                title: description,
                transaction_date: date,
                transaction_type: type,
                category_id,
                description: note,
            };
            const res = await dispatch(addTransaction(newTransaction));
            if (res?.meta.requestStatus === "fulfilled") {
                const data = {
                    startDate: formatDateUK(fromDate),
                    endDate: formatDateUK(toDate),
                };
                await dispatch(getTransactions(data));
                await dispatch(getTransactionsSummary(data));
            }
            // Reset form
            setAmount('');
            setDescription('');
            setDate(new Date());
            setType('');
            setCategory('');
            setCategory_id(undefined);
            setNote('');

            onClose();
        } else {
            // You might want to show an error message here
            console.log('Please fill in all required fields');
        }
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

    return (

        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Thêm mới giao dịch</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Số tiền"
                            value={formatCurrency(amount)}
                            onChangeText={handleAmountChange}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Mô tả"
                            value={description}
                            onChangeText={setDescription}
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
                                mode="datetime"
                                display="default"
                                onChange={handleDateChange}
                            />
                        )}

                        <TouchableOpacity style={styles.input} onPress={() => setShowTypeModal(true)}>
                            <Text>{type || 'Chọn loại'}</Text>
                        </TouchableOpacity>
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
                        <View style={[commonStyles.row, { justifyContent: 'space-between', width: '100%' }]}>
                            <TouchableOpacity style={[styles.addButton, { backgroundColor: "green" }]} onPress={handleAddTransaction}>
                                <Text style={styles.addButtonText}>Thêm</Text>
                                <MaterialIcons name="add-circle" size={24} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.addButton, { backgroundColor: "red" }]} onPress={onClose}>
                                <Text style={styles.closeButtonText}>Hủy</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>
            {renderTypeModal(types, showTypeModal, setType, () => setShowTypeModal(false))}
            {renderCategoryModal(categoryListState, showCategoryModal, (name, id) => {
                setCategory(name);
                setCategory_id(id);
            }, () => setShowCategoryModal(false))}
        </Modal>
    );
};

export default memo(AddTransactionModal);

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '90%',
        marginTop: ScaleUtils.scaleFontSize(150),
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
        paddingVertical: ScaleUtils.scaleFontSize(6),
        paddingHorizontal: ScaleUtils.scaleFontSize(20),
        borderRadius: ScaleUtils.scaleFontSize(6),
        marginTop: ScaleUtils.scaleFontSize(4),
    },
    addButtonText: {
        color: 'white',
        fontSize: ScaleUtils.scaleFontSize(16),
        marginRight: ScaleUtils.scaleFontSize(10),
    },

    closeButtonText: {
        color: 'white',
        fontSize: ScaleUtils.scaleFontSize(16),
    },


});
