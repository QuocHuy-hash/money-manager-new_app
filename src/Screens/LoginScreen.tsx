import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,  Alert } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { KeyboardAvoidingView } from 'react-native';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard } from 'react-native';
import Loading from '@/components/Loading';
import commonStyles from '@/utils/commonStyles';
import { login } from '@/redux/userSlice';
import { useAppDispatch } from '@/hooks/reduxHook';
import ScaleUtils from '@/utils/ScaleUtils';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '@/types/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

const LoginScreen = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const dispatch = useAppDispatch();
    const [isRememberMe, setIsRememberMe] = useState(false);
    const [userName, setUserName] = useState('huy12345');
    const [password, setPassword] = useState('123456');
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleLoginWithPassword = async () => {
        Keyboard.dismiss();
        setIsLoading(true);
        if (!userName || !password) {
            return Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
        } else {
            const res = await dispatch(login({ userName, password }));
            if (res?.meta.requestStatus == "fulfilled") {
                if (isRememberMe) {saveLoginInfo(userName, password);}
                setIsLoading(false);
                navigation.navigate("HomeScreen");
            } else {
                setIsLoading(false);
                Alert.alert('Lỗi', 'Đăng nhập thất bại');
            }

        }
    };
    useEffect(() => {
        getLoginInfo();
    }, []);
    const getLoginInfo = async () => {
        setIsLoading(true);
        try {
            const username = await AsyncStorage.getItem("username");
            const password = await AsyncStorage.getItem("password");

            if (username !== null && password !== null) {
                setUserName(username);
                    setPassword(password);
                    setIsRememberMe(true);
                // await handleLoginWithPassword();
                setIsLoading(false);
                return;
            }
        } catch (error) {
            console.error("Error retrieving login information:", error);
            setIsLoading(false);
            return null;
        }
    };
    const saveLoginInfo = async (username: string, password: string) => {
        try {
            // Save login information to AsyncStorage
            await AsyncStorage.setItem("username", username);
            await AsyncStorage.setItem("password", password);
            console.log('Login information saved successfully');
        } catch (error) {
            console.error('Error saving login information:', error);
        }
    };
    const handleToSignup = () => {
        navigation.navigate("RegisterScr");
    };
    return (
        <KeyboardAvoidingView style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined} >
            <Text style={styles.headerText}>Đăng nhập với mật khẩu</Text>
            <TextInput
                style={styles.input}
                placeholder="Tên đăng nhập"
                placeholderTextColor="#fff"
                value={userName}
                onChangeText={setUserName}
                autoCapitalize="none"
            />
            <View style={[commonStyles.row]}>

                <TextInput
                    style={[styles.input, { width: '100%' }]}
                    placeholder="Mật khẩu"
                    value={password}
                    placeholderTextColor="#fff"
                    onChangeText={setPassword}
                    secureTextEntry={!showPass}
                />
                <TouchableOpacity style={{
                    position: "absolute", right: 5,
                    marginTop: ScaleUtils.floorVerticalScale(10),
                }} onPress={() => { setShowPass(!showPass); }}>
                    <MaterialIcons name={showPass ? 'visibility' : 'visibility-off'} size={24} color="#4A90E2" />
                </TouchableOpacity>

            </View>
            <View style={styles.row}>
                <View style={[commonStyles.row]}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                        onPress={() => setIsRememberMe(!isRememberMe)}
                    >
                        <MaterialIcons
                            name={isRememberMe ? 'checkbox' : 'square-outline'}
                            size={24}
                            color="#4A90E2"
                        />
                    </TouchableOpacity>
                    <Text style={{ marginLeft: ScaleUtils.floorScale(6), marginTop: ScaleUtils.floorVerticalScale(4), color: '#FFFFFF' }}>
                        Ghi nhớ tài khoản
                    </Text>
                </View>
                <TouchableOpacity style={{ marginTop: ScaleUtils.floorVerticalScale(4) }}>
                    <Text style={styles.forgotPasswordText}>Quên mật khẩu</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.signInButton} onPress={handleLoginWithPassword}>
                <Text style={styles.signInButtonText}>ĐĂNG NHẬP</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToSignup}>
                <Text style={styles.signUpText}>
                    Chưa có tài khoản? <Text style={styles.signUpLink}>Đăng ký</Text>
                </Text>
            </TouchableOpacity>
            {/* {isLoading && <Loading size="large" color="#ff6347" />} */}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: ScaleUtils.floorScale(18),
        backgroundColor: '#1E1E1E', // Dark background color
    },
    headerText: {
        fontSize: ScaleUtils.scaleFontSize(26),
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: ScaleUtils.floorVerticalScale(22),
        textAlign: 'center',
    },
    socialButton: {
        flexDirection: 'row',
        backgroundColor: '#2E2E2E',
        padding: ScaleUtils.scale(15),
        marginBottom: ScaleUtils.floorVerticalScale(15),
        alignItems: 'center',
        borderRadius: 5,
    },
    socialButtonText: {
        flex: 1,
        textAlign: 'center',
        color: '#FFFFFF',
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: '600',
    },
    orText: {
        color: '#FFFFFF',
        fontSize: ScaleUtils.scaleFontSize(14),
        textAlign: 'center',
        marginVertical: ScaleUtils.floorVerticalScale(15),
    },
    passwordButton: {
        backgroundColor: '#4A90E2',
        padding: ScaleUtils.scale(15),
        alignItems: 'center',
        borderRadius: 5,
    },
    passwordButtonText: {
        color: '#FFFFFF',
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#2E2E2E',
        color: '#FFFFFF',
        padding: ScaleUtils.scale(14),
        marginBottom: ScaleUtils.floorVerticalScale(15),
        borderRadius: 5,
        fontSize: ScaleUtils.scaleFontSize(14),
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    forgotPasswordText: {
        color: '#4A90E2',
    },
    signInButton: {
        backgroundColor: '#4A90E2',
        padding: ScaleUtils.scale(14),
        alignItems: 'center',
        borderRadius: 5,
    },
    signInButtonText: {
        color: '#FFFFFF',
        fontSize: ScaleUtils.scale(14),
        fontWeight: '600',
    },
    signUpText: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: ScaleUtils.floorVerticalScale(18),
    },
    signUpLink: {
        color: '#4A90E2',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
