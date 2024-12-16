import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import ScaleUtils from '@/utils/ScaleUtils';
import commonStyles from '@/utils/commonStyles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { InfoViewProps } from '@/utils/types';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';

const InfoView = () => {
   const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { params } = useRoute<RouteProp<RootStackParamList, 'InfoView'>>();
    const { infoState: itemString } = params;

    const parsedInfoState: InfoViewProps = JSON.parse(itemString || '{}');
    return (
        <View style={styles.container}>
            <View style={[{
                // backgroundColor: 'white',
                position: 'absolute',
                flexDirection: 'row',
                top: 0,
                left: 0,
                zIndex: 10,
                height: ScaleUtils.floorVerticalScale(32)
                , borderRadius: 50
            }, commonStyles.alignCenter, commonStyles.jusCenter]}>
                <TouchableOpacity onPress={() => navigation.goBack() } >
                    <MaterialIcons name="chevron-left" size={40} color="#4A90E2" />
                </TouchableOpacity>
                <Text style={{ fontSize: ScaleUtils.scaleFontSize(16), fontWeight: "bold", color: '#4A90E2' }}>Thông tin tài khoản</Text>
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Họ & tên:</Text>
                <Text style={styles.value}>{parsedInfoState.firstName} {parsedInfoState.lastName}</Text>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{parsedInfoState.email}</Text>
                <Text style={styles.label}>Số điện thoại:</Text>
                <Text style={styles.value}>{parsedInfoState.phone_number}</Text>
                <Text style={styles.label}>Tên đăng nhập:</Text>
                <Text style={styles.value}>{parsedInfoState.user_name}</Text>
                <Text style={styles.label}>Xác minh:</Text>
                <Text style={styles.value}>{parsedInfoState.verify ? 'Đã xác minh' : 'Chưa xác minh'}</Text>
                <Text style={styles.label}>Ngày tạo:</Text>
                <Text style={styles.value}>{new Date(parsedInfoState.createdAt).toLocaleDateString()}</Text>
                <Text style={styles.label}>Cập nhật lần cuối:</Text>
                <Text style={styles.value}>{new Date(parsedInfoState.updatedAt).toLocaleDateString()}</Text>
            </View>
        </View>
    )
}

export default InfoView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    infoContainer: {
        width: '100%',
        height: '100%',
        marginTop: ScaleUtils.floorVerticalScale(42),
        backgroundColor: '#F9F9F9',
        padding: 20,
        borderRadius: 8,
    },
    label: {
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: '600',
        marginBottom: 4,
    },
    value: {
        fontSize: ScaleUtils.scaleFontSize(14),
        color: '#444',
        marginBottom: 12,
    },
})