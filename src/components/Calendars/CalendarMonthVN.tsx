import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import commonStyles from '@/utils/commonStyles';
import ScaleUtils from '@/utils/ScaleUtils';

const VietnameseMonthPicker = () => {
    const months = [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
    ];

    const currentMonth = new Date().getMonth();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const flatListRef = useRef<FlatList>(null);

    // Scroll to the current month initially
    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: currentMonth, animated: true });
        }
    }, []);

    const handleScrollLeft = () => {
        const newIndex = Math.max(selectedMonth - 1, 0);
        setSelectedMonth(newIndex);
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    };

    const handleScrollRight = () => {
        const newIndex = Math.min(selectedMonth + 1, months.length - 1);
        setSelectedMonth(newIndex);
        flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    };

    const renderMonth = ({ item, index }: { item: string; index: number }) => (
        <View
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
        </View>
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
                initialScrollIndex={currentMonth}
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
