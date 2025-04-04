import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useAppDispatch } from '@/hooks/reduxHook';
import { registerUser } from '@/redux/userSlice';
import { Alert } from 'react-native';
import commonStyles from '@/utils/commonStyles';
import Loading from '@/components/Loading';
import ScaleUtils from '@/utils/ScaleUtils';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/types/navigation';


interface FormData {
    email: string;
    password: string;
    userName: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface FormErrors {
    [key: string]: string;
}

const useForm = (initialState: FormData, validate: (data: FormData) => FormErrors) => {
    const [values, setValues] = useState<FormData>(initialState);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleChange = (name: keyof FormData, value: string) => {
        setValues(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = () => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    return { values, errors, handleChange, handleSubmit };
};

const validateRegistration = (data: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.email) {
        errors.email = 'Chưa nhập Email';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
        errors.email = 'Chưa đúng định dạng Email';
    }
    if (!data.password) {
        errors.password = 'Chưa nhập mật khẩu';
    } else if (data.password.length < 6) {
        errors.password = 'Mật khẩu phải nhiều hơn 6 ký tự';
    }
    if (!data.userName) {
        errors.userName = 'Chưa nhập tên đăng nhập';
    } else if (data.userName.length < 6) {
        errors.userName = 'Tên đăng nhập phải nhiều hơn 6 ký tự';
    }
    if (!data.firstName) {
        errors.firstName = 'Chưa nhập họ';
    }
    if (!data.lastName) {
        errors.lastName = 'Chưa nhập tên';
    }
    if (!data.phoneNumber) {
        errors.phoneNumber = 'Chưa nhập số điện thoại';
    } else if (!/^\d{10}$/.test(data.phoneNumber)) {
        errors.phoneNumber = 'Nhập sai định dạng số điện thoại';
    }
    return errors;
};

const RegisterScreen: React.FC = () => {
    const dispatch = useAppDispatch();
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const initialState: FormData = {
        email: '',
        password: '123456',
        userName: 'huy123456',
        firstName: 'Hoang',
        lastName: 'Huy Nguyen',
        phoneNumber: '0326465023',
    };

    const { values, errors, handleChange, handleSubmit } = useForm(initialState, validateRegistration);

    const handleRegister = async () => {
        if (handleSubmit()) {
            try {
                setIsLoading(true);
                const res = await dispatch(registerUser(values));
                console.log("res: ", res);

                if (res?.meta?.requestStatus === "fulfilled") {
                    // router.push({
                    //     pathname: '/register/verifyOTP',
                    //     params: { email: values.email },
                    // });
                } else {
                    Alert.alert('Lỗi!', 'Email đã được đăng ký!');
                }
            } catch (error) {
                Alert.alert('Lỗi!', 'Lỗi đăng ký vui lòng thử lại!');

            } finally {
                setIsLoading(false);
            }
        }
    };

    const renderInput = (name: keyof FormData, placeholder: string, secureTextEntry: boolean = false) => (
        <View>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={values[name]}
                onChangeText={(text) => handleChange(name, text)}
                placeholderTextColor="#fff"
                secureTextEntry={secureTextEntry && !showPass}
            />
            {errors[name] && <Text style={styles.errorText}>{errors[name]}</Text>}
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >

            <View style={styles.formContainer}>
                <Text style={styles.headerText}>ĐĂNG KÝ TÀI KHOẢN</Text>

                {renderInput('firstName', 'Họ')}
                {renderInput('lastName', 'Tên')}
                {renderInput('email', 'Email')}
                {renderInput('userName', 'Tên đăng nhập')}
                {renderInput('password', 'Mật khẩu')}
                {renderInput('phoneNumber', 'Số điện thoại')}

                <TouchableOpacity style={styles.signInButton} onPress={handleRegister}>
                    <Text style={styles.signInButtonText}>ĐĂNG KÝ</Text>
                </TouchableOpacity>

                <View style={[commonStyles.row, commonStyles.alignCenter, commonStyles.jusCenter]}>
                    <Text style={styles.signUpText}>Đã có tài khoản?</Text>
                    <TouchableOpacity onPress={() => {navigation.navigate("LoginScreen")}}>
                        <Text style={styles.signUpLink}>Đăng nhập</Text>
                    </TouchableOpacity>
                </View>
                {isLoading && <Loading size="large" color="#ff6347" />}
            </View>

        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    backButton: {
        width: ScaleUtils.floorScale(40),
        height: ScaleUtils.floorVerticalScale(32),
        borderRadius: 50,
        ...commonStyles.alignCenter,
        ...commonStyles.jusCenter,
    },
    formContainer: {
        paddingHorizontal: ScaleUtils.floorScale(20),
        ...commonStyles.mt10,
    },
    headerText: {
        fontSize: ScaleUtils.scaleFontSize(20),
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: ScaleUtils.floorVerticalScale(22),
        textAlign: 'center',
        marginTop: ScaleUtils.floorVerticalScale(20),
    },
    input: {
        backgroundColor: '#2E2E2E',
        color: '#FFFFFF',
        padding: ScaleUtils.scale(14),
        marginBottom: ScaleUtils.floorVerticalScale(10),
        borderRadius: 10,
        fontSize: ScaleUtils.scaleFontSize(14),
    },
    eyeIcon: {
        position: 'absolute',
        right: 5,
        top: ScaleUtils.floorVerticalScale(10),
    },
    signInButton: {
        backgroundColor: '#4A90E2',
        padding: ScaleUtils.scale(14),
        marginTop: ScaleUtils.floorVerticalScale(30),
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
        marginRight: ScaleUtils.floorScale(5),
    },
    signUpLink: {
        color: '#4A90E2',
        fontWeight: 'bold',
        marginTop: ScaleUtils.floorVerticalScale(18),
    },
    errorText: {
        color: 'red',
        fontSize: ScaleUtils.scaleFontSize(12),
        marginBottom: ScaleUtils.floorVerticalScale(5),
    },
});

export default RegisterScreen;
