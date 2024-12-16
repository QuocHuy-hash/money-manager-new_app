import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScaleUtils from '@/utils/ScaleUtils';
import commonStyles from '@/utils/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { RootState } from '@/hooks/store';
import { getGoals } from '@/redux/goalsSlice';
import ListGoal from '@/components/Goals/ListGoal';
import { Goal } from '@/utils/types';
import AddModal from '@/components/Goals/AddModal';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';
import { useNavigation } from '@react-navigation/native';

const GoalsScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const dispatch = useAppDispatch();
    const goalsState: Goal[] = useAppSelector((state: RootState) => state.goals.goals);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    useEffect(() => {
        fetchGoals()
    }, []);
    const fetchGoals = async () => {
        try {
            await dispatch(getGoals());
        } catch (error) {
            console.log("Loi lay danh sach muc tieu:", error);
        }

    }

    const handleAddTransaction = async (goal: Goal) => {

    }
    return (
        <View style={styles.container}>
            <View style={[{ width: "100%" }, commonStyles.row, commonStyles.jusBetween]} >
                    <Text style={{
                        fontSize: ScaleUtils.scaleFontSize(14), marginLeft: ScaleUtils.floorScale(10),
                        fontWeight: "bold", marginTop: ScaleUtils.floorVerticalScale(8)
                    }}>Danh sách mục tiêu</Text>
                <View style={[commonStyles.row, commonStyles.jusBetween,]}>
                    <View style={[commonStyles.row, commonStyles.jusBetween, { width: ScaleUtils.floorScale(50) }]}>
                        <TouchableOpacity onPress={() => { setIsEdit(false); setModalVisible(true) }} >
                            <MaterialIcons name="add-circle" size={40} color="green" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <AddModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onSubmit={handleAddTransaction}
            />

            <View>
                <ListGoal data={goalsState} fetchGoals={fetchGoals} />
            </View>
        </View>
    )
}

export default GoalsScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})