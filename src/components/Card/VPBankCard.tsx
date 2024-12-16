import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import ScaleUtils from '@/utils/ScaleUtils';
import { Color } from '@/utils/setting';
import imageUtils from '@/utils/imageUtils';
import commonStyles from '@/utils/commonStyles';
import { useAppDispatch } from '@/hooks/reduxHook';
import { getInBankAccountInfo } from '@/redux/accountSlice';

const VPBankCard = () => {
    const dispatch = useAppDispatch();
    const [bankInfo, setBankInfo] = useState<any[]>();
    const [bankAccountName, setBankAccountName] = useState<string>();
    const [bankSubAccId, setBankSubAccId] = useState<string>();
    const [balance, setBalance] = useState<string>();
    const [beginDate, setBeginDate] = useState<string>();
    const [connectStatus, setConnectStatus] = useState<number>();
    const [codeName, setCodeName] = useState<string>();

    useEffect(() => {
        const getInfo = async () => {
            const res = await dispatch(getInBankAccountInfo());

            if (res.payload && res.payload.data) {
                const bankAccs = res.payload.data.bankAccs;
                if (bankAccs && bankAccs.length > 0) {
                    const account = bankAccs[0];
                    const bank = account.bank;
                    setBankInfo(bank);
                    setBankAccountName(account.bankAccountName);
                    setBankSubAccId(account.bankSubAccId);
                    setBalance(account.balance.toLocaleString());
                    setBeginDate(account.beginDate);
                    setConnectStatus(account.connectStatus);
                    setCodeName(bank.codeName);
                }
            }
        };
        getInfo();
    }, [dispatch]);

    return (
        <LinearGradient colors={['#2ecc71', '#27ae60']} style={styles.card}>
            {/* Status */}
            <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{connectStatus === 1 ? 'Đang kết nối' : 'Không kết nối'}</Text>
            </View>

            {/* Card Info */}
            <View style={styles.infoContainer}>
                <View >
                    <Text style={styles.accountNumber}>{bankSubAccId ? bankSubAccId : ""}</Text>
                    <Text style={styles.accountHolder}>{bankAccountName ? bankAccountName : ""}</Text>
                </View>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balance}>{`${balance ? balance : ""} đ`}</Text>
                </View>
            </View>

            {/* Transaction Info */}
            <View style={styles.transactionContainer}>
                <View style={styles.transactionDetails}>
                    <MaterialIcons name="document-outline" size={24} color="#fff" />
                    <Text style={styles.transactionText}>198 Giao dịch</Text>
                </View>
                <View style={styles.lastTransaction}>
                    <MaterialIcons name="time-outline" size={24} color="#fff" />
                    <Text style={styles.transactionText}>{beginDate ? beginDate : 'Một ngày trước'}</Text>
                </View>
            </View>

            {/* VPBank Logo */}
            {codeName === 'vpbank' ? (
                < View style={[styles.logoContainer, commonStyles.row, commonStyles.alignCenter]}>
                    <Text style={styles.bankName}>{codeName ? codeName : ""}</Text>
                    <Image
                        source={imageUtils('vpbank_logo_tron')}
                        style={[{
                            width: ScaleUtils.floorScale(25),
                            height: ScaleUtils.floorVerticalScale(25),
                            marginLeft: ScaleUtils.floorScale(5),
                        }]}
                    />
                </View>
            ) : ""}

        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    card: {
        borderRadius: ScaleUtils.scale(15),
        padding: ScaleUtils.scale(20),
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: ScaleUtils.floorVerticalScale(145),
        position: 'relative',
    },
    statusContainer: {
        backgroundColor: '#27ae60',
        paddingHorizontal: ScaleUtils.floorScale(10),
        paddingVertical: ScaleUtils.floorVerticalScale(5),
        borderRadius: ScaleUtils.scale(10),
        alignSelf: 'flex-start',
    },
    statusText: {
        color: '#fff',
        fontSize: ScaleUtils.scaleFontSize(12),
        fontWeight: 'bold',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: ScaleUtils.floorVerticalScale(8),
    },
    accountNumber: {
        color: 'white',
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: 'bold',
    },
    accountHolder: {
        color: 'white',
        fontSize: ScaleUtils.scaleFontSize(14),
        marginTop: ScaleUtils.floorVerticalScale(5),
    },
    balanceContainer: {
        alignItems: 'flex-end',
    },
    balance: {
        color: 'white',
        fontSize: ScaleUtils.scaleFontSize(16),
        fontWeight: 'bold',
    },
    transactionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    transactionDetails: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lastTransaction: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    transactionText: {
        color: '#fff',
        marginLeft: 5,
        fontSize: ScaleUtils.scaleFontSize(12),
    },
    logoContainer: {
        position: 'absolute',
        top: ScaleUtils.scale(20),
        right: ScaleUtils.scale(30),
        width: ScaleUtils.floorScale(80),
    },
    bankName: {
        color: '#fff',
        fontSize: ScaleUtils.scaleFontSize(16),
        fontWeight: 'bold',
    },
});

export default VPBankCard;
