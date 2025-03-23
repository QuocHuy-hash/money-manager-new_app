import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import React, { useCallback, useState } from 'react';
import { Goal } from '@/utils/types';
import ScaleUtils from '@/utils/ScaleUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import commonStyles from '@/utils/commonStyles';
import { formatCurrency } from '@/utils/format';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';

const ListGoal = ({ data, fetchGoals }: { data: Goal[], fetchGoals: () => Promise<void> }) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await fetchGoals(); // Fetch lại danh sách mục tiêu
        setRefreshing(false);
    }, []);

    const renderItem = ({ item }: { item: Goal }) => {
        const percentageAchieved = calculatePercentage(item.current_amount, item.target_amount).toFixed(2); // Giới hạn đến 2 chữ số thập phân

        const handleDetails = () => {
            // router.push({
            //     pathname: '/goals/details',
            //     params: { item: JSON.stringify(item) },
            // });
            navigation.navigate('GoalDetailsView', { item });
        };

        return (
            <TouchableOpacity style={styles.goalItem} onPress={handleDetails}>
                <View style={[commonStyles.row, commonStyles.jusBetween]}>
                    <Text style={{ fontSize: ScaleUtils.scaleFontSize(12), fontWeight: "800", color: "#666" }}>
                        {item.name}
                    </Text>
                    <Text style={[styles.text_size, { color: 'green' }]}> +{percentageAchieved}%</Text>
                </View>

                <Text style={[styles.text_size]}>Số tiền hiện tại: {formatCurrency(item.current_amount.toString())}</Text>
                <Text style={[styles.text_size]}>Số tiền mục tiêu: {formatCurrency(item.target_amount.toString())}</Text>
                <Text style={[styles.text_size]}>Tiết kiệm mỗi tháng: {formatCurrency(item.monthly_saving_amount.toString())}</Text>

                <View style={[commonStyles.row, commonStyles.alignCenter, commonStyles.jusBetween]}>
                    <Text style={styles.text_time}>Bắt đầu: {new Date(item.createdAt).toLocaleDateString()}</Text>
                    <MaterialIcons name="access-time" size={30} color="green" />
                    <Text style={styles.text_time}>Kết thúc: {new Date(item.deadline).toLocaleDateString()}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                style={{ marginVertical: ScaleUtils.floorVerticalScale(10), padding: ScaleUtils.scale(10) }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            />
        </View>
    );
};

const calculatePercentage = (current: number, target: number): number => {
    return (current / target) * 100;
};

export default ListGoal;

const styles = StyleSheet.create({
    goalItem: {
        padding: ScaleUtils.scale(4),
        marginVertical: ScaleUtils.floorVerticalScale(4),
        borderColor: '#357a47',
        backgroundColor: 'white',
        shadowColor: '#133b1e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderRadius: ScaleUtils.scale(10),
    },
    text_time: {
        fontSize: ScaleUtils.scaleFontSize(12),
    },
    text_size: {
        fontSize: ScaleUtils.scaleFontSize(12),
    },
});
