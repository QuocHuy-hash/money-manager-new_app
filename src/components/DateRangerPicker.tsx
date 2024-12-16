import ScaleUtils from '@/utils/ScaleUtils';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';

interface DateRangePickerProps {
    onConfirm: (startDate: string, endDate: string) => void;
    onCancel: () => void;
    visible: boolean;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onConfirm, onCancel, visible }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentMonth, setCurrentMonth] = useState('');
    const [selectingStartDate, setSelectingStartDate] = useState(true);
    const [isInvalidRange, setIsInvalidRange] = useState(false);

    useEffect(() => {
        const now = new Date();
        setCurrentMonth(`Tháng ${now.getMonth() + 1} ${now.getFullYear()}`);
    }, []);

    useEffect(() => {
        if (startDate && endDate) {
            setIsInvalidRange(new Date(startDate) > new Date(endDate));
        } else {
            setIsInvalidRange(false);
        }
    }, [startDate, endDate]);

    const onDayPress = (day: DateData) => {
        if (selectingStartDate) {
            setStartDate(day.dateString);
            setEndDate('');
            setSelectingStartDate(false);
        } else {
            if (new Date(day.dateString) < new Date(startDate)) {
                setStartDate(day.dateString);
            } else {
                setEndDate(day.dateString);
            }
            setSelectingStartDate(true);
        }
    };

    const handleConfirm = () => {
        if (startDate && endDate && !isInvalidRange) {
            onConfirm(startDate, endDate);
        }
    };

    const getMarkedDates = () => {
        const markedDates: any = {};
        if (startDate) {
            markedDates[startDate] = { startingDay: true, color: isInvalidRange ? 'red' : '#5E9FFF', textColor: 'white' };
        }
        if (endDate) {
            markedDates[endDate] = { endingDay: true, color: isInvalidRange ? 'red' : '#5E9FFF', textColor: 'white' };
        }
        if (startDate && endDate) {
            const currentDate = new Date(startDate);
            const endDateObj = new Date(endDate);
            while (currentDate < endDateObj) {
                currentDate.setDate(currentDate.getDate() + 1);
                const dateString = currentDate.toISOString().split('T')[0];
                if (dateString !== endDate) {
                    markedDates[dateString] = { color: isInvalidRange ? 'red' : '#5E9FFF', textColor: 'white' };
                }
            }
        }
        return markedDates;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) {return '';}
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

    return (
        <Modal transparent visible={visible} animationType="slide">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={onCancel}>
                            <Text style={styles.cancelButton}>Hủy</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>{currentMonth}</Text>
                        <TouchableOpacity onPress={handleConfirm} disabled={isInvalidRange}>
                            <Text style={[styles.confirmButton, isInvalidRange && styles.disabledButton]}>Xác nhận</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dateRangeContainer}>
                        <TouchableOpacity
                            style={[styles.dateBox, selectingStartDate && styles.selectedDateBox, isInvalidRange && styles.invalidDateBox]}
                            onPress={() => setSelectingStartDate(true)}
                        >
                            <Text style={[styles.dateLabel, isInvalidRange && styles.invalidDateLabel]}>
                                {startDate ? `${formatDate(startDate)}` : 'Chọn ngày bắt đầu'}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.separator}>
                            <Text style={styles.separatorText}>-</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.dateBox, !selectingStartDate && styles.selectedDateBox, isInvalidRange && styles.invalidDateBox]}
                            onPress={() => setSelectingStartDate(false)}
                        >
                            <Text style={[styles.dateLabel, isInvalidRange && styles.invalidDateLabel]}>
                                {endDate ? ` ${formatDate(endDate)}` : 'Chọn ngày kết thúc'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Calendar
                        onDayPress={onDayPress}
                        markedDates={getMarkedDates()}
                        markingType={'period'}
                        theme={{
                            todayTextColor: '#5E9FFF',
                            selectedDayBackgroundColor: '#5E9FFF',
                            selectedDayTextColor: '#ffffff',
                        }}
                        onMonthChange={(month : any) => {
                            setCurrentMonth(`Tháng ${month.month} ${month.year}`);
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: ScaleUtils.floorVerticalScale(18),
        borderTopRightRadius: ScaleUtils.floorVerticalScale(18),
        padding: ScaleUtils.scale(20),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ScaleUtils.floorVerticalScale(10),
    },
    title: {
        fontSize: ScaleUtils.scaleFontSize(16),
        fontWeight: 'bold',
    },
    cancelButton: {
        color: '#007AFF',
        fontSize: ScaleUtils.scaleFontSize(14),
    },
    confirmButton: {
        color: '#007AFF',
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: 'bold',
    },
    disabledButton: {
        color: '#999999',
    },
    dateRangeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ScaleUtils.floorVerticalScale(10),
    },
    dateBox: {
        flex: 1,
        backgroundColor: '#F0F0F0',
        padding: ScaleUtils.scale(10),
        borderRadius: ScaleUtils.scale(5),
    },
    selectedDateBox: {
        backgroundColor: '#E6F2FF',
        borderColor: '#5E9FFF',
        borderWidth: 1,
    },
    invalidDateBox: {
        backgroundColor: '#FFE6E6',
        borderColor: 'red',
        borderWidth: 1,
    },
    dateLabel: {
        textAlign: 'center',
    },
    invalidDateLabel: {
        color: 'red',
    },
    separator: {
        paddingHorizontal: ScaleUtils.floorScale(10),
    },
    separatorText: {
        fontSize: ScaleUtils.scaleFontSize(16),
    },
});

export default DateRangePicker;
