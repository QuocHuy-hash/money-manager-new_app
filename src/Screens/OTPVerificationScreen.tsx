import { useAppDispatch } from '@/hooks/reduxHook';
import { resendOTP, verifyOTP } from '@/redux/userSlice';
import { RootStackParamList } from '@/types/navigation';
import commonStyles from '@/utils/commonStyles';
import imageUtils from '@/utils/imageUtils';
import ScaleUtils from '@/utils/ScaleUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';

const OTPVerificationScreen = () => {
const navigation = useNavigation();
    const route = useRoute<RouteProp<RootStackParamList, 'verifyOTP'>>();
    const { email } = route.params;
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(0);
    // const router = useRouter();
    const dispatch = useAppDispatch();
    // Refs for input fields
    const inputRefs = useRef<(TextInput | null)[]>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (interval) {
            clearInterval(interval);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [timer]);
    // Function to handle OTP input
    const handleOtpChange = (text: string, index: number) => {
        // Only allow numbers
        if (/^\d+$/.test(text) || text === '') {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            // Automatically move to the next input
            if (text && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    // Handle backspace
    const handleBackspace = (key: string, index: number) => {
        if (key === 'Backspace' && index > 0 && otp[index] === '') {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const verifyOtp = async () => {
        if (otp.includes('')) {
            Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã xác thực (OTP)!');
            return;
        }
        const res = await dispatch(verifyOTP({email , otp: otp.join('') }));
        console.log("res", res);
        if (res.meta.requestStatus === "rejected") {
            Alert.alert('Lỗi', 'Mã xác thực chưa chính xác!');
        } else if (res.payload) {
            // Handle successful OTP verification
            Alert.alert('Thành công', 'Xác thực tài khoản thành công!', [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('LoginScreen' as never);
                    },
                },
            ]);
        } else {
            // Fallback in case something else goes wrong
            Alert.alert('Lỗi', 'Đã xảy ra lỗi, vui lòng thử lại sau!');
        }
    };

    const resendOtp = async () => {
        if (timer === 0) {
            setTimer(30);
            const res = await dispatch(resendOTP({ email }));
            if (res.meta.requestStatus === "fulfilled") {
                Alert.alert('Thành công', 'Gửi lại mã OTP thành công. Vui lòng kiểm tra Email của bạn!');
            } else {
                console.log("lỗi::", res);
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => {navigation.goBack()}} style={[{
                // backgroundColor: 'white',
                position: 'absolute',
                top: 0,
                left: 0,
                width: ScaleUtils.floorScale(40),
                height: ScaleUtils.floorVerticalScale(32)
                , borderRadius: 50
            }, commonStyles.alignCenter, commonStyles.jusCenter]}>
                 <MaterialIcons name="chevron-left" size={40} color="#4A90E2" />
            </TouchableOpacity>
            <Image
                source={imageUtils('otp_logo')}
                style={[{
                    width: ScaleUtils.floorScale(150),
                    height: ScaleUtils.floorVerticalScale(150),
                    marginBottom: ScaleUtils.floorVerticalScale(30),
                }]}
            />
            <Text style={styles.title}>Xác thực OTP</Text>

            <Text style={styles.subtitle}>{`Nhập OTP được gửi đến Email: ${email}`}</Text>

            <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                    <TextInput
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)} // Reference to each input
                        style={styles.otpInput}
                        keyboardType="numeric"
                        maxLength={1}
                        value={value}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        onKeyPress={({ nativeEvent: { key } }) => handleBackspace(key, index)}
                    />
                ))}
            </View>

            <Text style={styles.resendText}>
                Chưa nhận được OTP?{' '}
                <Text style={[styles.resendLink, { color: timer > 0 ? 'red' : '#5C9DF2' }]} onPress={resendOtp}>
                    Gửi lại OTP{timer > 0 ? ` (${timer}s)` : ''}
                </Text>
            </Text>

            <TouchableOpacity style={styles.verifyButton} onPress={verifyOtp}>
                <Text style={styles.verifyButtonText}>Xác thực</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    title: {
        fontSize: ScaleUtils.scaleFontSize(20),
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: ScaleUtils.scaleFontSize(14),
        color: '#333',
        marginVertical: ScaleUtils.floorVerticalScale(10),
        textAlign: 'center',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginVertical: ScaleUtils.floorVerticalScale(20),
    },
    otpInput: {
        borderBottomWidth: 2,
        borderBottomColor: '#5C9DF2',
        width: ScaleUtils.floorScale(30),
        textAlign: 'center',
        fontSize: ScaleUtils.scaleFontSize(20),
    },
    resendText: {
        fontSize: ScaleUtils.scaleFontSize(12),
        color: '#999',
        marginVertical: ScaleUtils.floorVerticalScale(8),
    },
    resendLink: {
        color: '#5C9DF2',
        fontWeight: 'bold',
    },
    verifyButton: {
        backgroundColor: '#5C9DF2',
        paddingVertical: ScaleUtils.floorVerticalScale(14),
        paddingHorizontal: 80,
        borderRadius: ScaleUtils.scale(15),
        marginTop: ScaleUtils.floorVerticalScale(30),
    },
    verifyButtonText: {
        color: '#fff',
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: 'bold',
    },
});

export default OTPVerificationScreen;
