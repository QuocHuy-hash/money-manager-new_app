import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScaleUtils from '@/utils/ScaleUtils';
import commonStyles from '@/utils/commonStyles';

import { useAppDispatch, useAppSelector } from '@/hooks/reduxHook';
import { getUser } from '@/redux/userSlice';
import { RootState } from '@/hooks/store';
import Loading from '@/components/Loading';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';

// infoState {"api_key": null, "createdAt": "2024-10-06T03:31:59.858Z", "email": "huy343536@gmail.com", "firstName": "Quoc", "full_name": null, "id": 1, "lastName": "Huy", "password": "$2b$10$m10XLVlpgsQT4gZ6KFiTP.yXXLZeMm0IPCNmF03E.CAJThzolltmG", "phone_number": "0987654321", "status": "inactive", "token_device": null, "updatedAt": "2024-10-06T03:32:21.006Z", "userId": null, "user_name": "huy12345", "verify": true}


const AccountView = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const infoState = useAppSelector((state: RootState) => state.users.info);
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    getInformation()
  }, []);
  const getInformation = useCallback(async () => {
    setIsLoading(true);
    try {
      await dispatch(getUser());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }


  }, []);

  const handleLogOut = () => {
    navigation.navigate('LoginScreen');
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, commonStyles.row, commonStyles.alignCenter, commonStyles.jusBetween]}>
        <Text style={styles.headerText}>Profile</Text>
        <TouchableOpacity style={styles.cameraButton}>
          <MaterialIcons name="image" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Image
          source={{ uri: 'https://example.com/profile-picture.jpg' }}
          style={styles.profilePicture}
        />
        <View style={styles.onlineIndicator} />
        <Text style={styles.name}>{`${infoState ? infoState.firstName : ""} ${infoState ? infoState.lastName: ""}`}</Text>
        <Text style={styles.email}>{`${infoState ? infoState.email : ""}`}</Text>
      </View>

      <View style={styles.accountDetails}>
        <Text style={styles.sectionTitle}>Tài khoản</Text>
        <TouchableOpacity style={styles.accountItem} onPress={() => { navigation.navigate('InfoView', { infoState: JSON.stringify(infoState) }) }}>
          <MaterialIcons name="person" size={24} color="green" />
          <View style={styles.accountItemText}>
            <Text style={styles.accountItemTitle}>Thông tin tài khoản </Text>
            <Text style={styles.accountItemSubtitle}>Thông tin chi tiết tài khoản</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountItem}>
          <MaterialIcons name="verified-user" size={24} color="green" />
          <View style={styles.accountItemText}>
            <Text style={styles.accountItemTitle}>Xác minh danh tính</Text>
            <Text style={styles.accountItemSubtitle}>Kiểm tra trạng thái xác minh</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountItem}>
          <MaterialIcons name="history" size={24} color="green" />
          <View style={styles.accountItemText}>
            <Text style={styles.accountItemTitle}>Lịch sử giao dịch</Text>
            <Text style={styles.accountItemSubtitle}>Xem lại toàn bộ giao dịch chưa đồng bộ</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.accountItem} onPress={() => {
          handleLogOut();

        }}  >
          <MaterialIcons name="logout" size={24} color="red" />
          <View style={styles.accountItemText}>
            <Text style={styles.accountItemTitle}>Đăng xuất</Text>
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>
      {isLoading && <Loading size="large" color="#ff6347" />}
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4169E1',
  },
  header: {
    paddingHorizontal: ScaleUtils.floorScale(20),
    width: ScaleUtils.floorScale(360),
    height: ScaleUtils.floorVerticalScale(50),
    paddingTop: ScaleUtils.floorVerticalScale(10),
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  cameraButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    padding: 10,
  },
  profileInfo: {
    alignItems: 'center',
    height: ScaleUtils.floorVerticalScale(150),
  },
  profilePicture: {
    width: ScaleUtils.floorScale(80),
    height: ScaleUtils.floorVerticalScale(70),
    backgroundColor: "red",
    borderRadius: ScaleUtils.scale(50),
  },
  onlineIndicator: {
    width: ScaleUtils.floorScale(15),
    height: ScaleUtils.floorVerticalScale(13),
    borderRadius: 7.5,
    backgroundColor: '#4CD964',
    position: 'absolute',
    borderWidth: 2,
    top: 10,
    right: 165,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },

  accountDetails: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  accountItemText: {
    flex: 1,
    marginLeft: 15,
  },
  accountItemTitle: {
    fontSize: 16,
    color: '#333',
  },
  accountItemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

export default AccountView;