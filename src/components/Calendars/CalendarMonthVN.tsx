import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import commonStyles from '@/utils/commonStyles';
import ScaleUtils from '@/utils/ScaleUtils';
interface VietnameseMonthPickerProps { 
    onChangeMonth: (month: string) => void;
    initialMonth?: number;
}

const VietnameseMonthPicker = ({ onChangeMonth, initialMonth }: VietnameseMonthPickerProps) => {
    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
    ];

    const currentMonth = new Date().getMonth();
    const [selectedMonth, setSelectedMonth] = useState(initialMonth !== undefined ? initialMonth : currentMonth);
    const flatListRef = useRef<FlatList>(null);

    // Scroll to the current month initially
    useEffect(() => {
        if (flatListRef.current) {
            // Skip the scroll if it's already visible
            flatListRef.current.scrollToIndex({
                index: selectedMonth,
                animated: true,
                viewPosition: 0.5 // Center the selected month
            });
        }
    }, []);

    // Update selectedMonth when initialMonth changes
    useEffect(() => {
        if (initialMonth !== undefined && initialMonth !== selectedMonth) {
            setSelectedMonth(initialMonth);
            
            // Scroll to the newly selected month
            if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                    index: initialMonth,
                    animated: true,
                    viewPosition: 0.5 // Center the selected month
                });
            }
        }
    }, [initialMonth]);

    const handleScrollLeft = useCallback(() => {
        const newIndex = Math.max(selectedMonth - 1, 0);
        setSelectedMonth(newIndex);
        onChangeMonth(newIndex.toString());
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }, [selectedMonth, onChangeMonth]);

    const handleScrollRight = useCallback(() => {
        const newIndex = Math.min(selectedMonth + 1, months.length - 1);
        setSelectedMonth(newIndex);
        onChangeMonth(newIndex.toString());
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    },[selectedMonth, onChangeMonth]);

    const handleMonthPress = useCallback((index: number) => {
        setSelectedMonth(index);
        onChangeMonth(index.toString());
        flatListRef.current?.scrollToIndex({ index, animated: true });
    }, [onChangeMonth]);

    const renderMonth = ({ item, index }: { item: string; index: number }) => (
        <TouchableOpacity
            onPress={() => handleMonthPress(index)}
            style={[
                styles.monthButton,
                selectedMonth === index && styles.selectedMonthButton,
            ]}
        >
            <Text
                style={[
                    styles.monthText,
                    selectedMonth === index && styles.selectedMonthText,
                ]}
            >
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleScrollLeft} style={styles.iconContainer}>
                <MaterialIcons name="chevron-left" size={30} color="#fff" />
            </TouchableOpacity>
            <FlatList
                ref={flatListRef}
                data={months}
                renderItem={renderMonth}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.monthsContainer}
                getItemLayout={(data, index) => ({
                    length: ScaleUtils.scale(60),
                    offset: ScaleUtils.scale(60) * index,
                    index,
                })}
                initialScrollIndex={selectedMonth}
            />
            <TouchableOpacity onPress={handleScrollRight} style={styles.iconContainer}>
                <MaterialIcons name="chevron-right" size={30} color="#fff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        ...commonStyles.row,
        ...commonStyles.alignCenter,
    },
    iconContainer: {
        backgroundColor: '#497ff2',
        borderRadius: ScaleUtils.scale(5),
        padding: ScaleUtils.scale(2),
    },
    monthsContainer: {
        alignItems: 'center',
    },
    monthButton: {
        width: ScaleUtils.scale(60),
        paddingVertical: ScaleUtils.floorVerticalScale(5),
        marginHorizontal: ScaleUtils.floorScale(5),
        borderRadius: ScaleUtils.scale(5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedMonthButton: {
        backgroundColor: '#497ff2',
    },
    monthText: {
        fontSize: 16,
        color: '#333',
    },
    selectedMonthText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default VietnameseMonthPicker;
