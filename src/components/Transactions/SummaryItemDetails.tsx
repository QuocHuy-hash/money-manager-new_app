import { StyleSheet, Text, View, FlatList, Modal, Touchable, TouchableOpacity } from 'react-native';
import React from 'react';
import ScaleUtils from '@/utils/ScaleUtils';

interface SummaryItemDetailsProps {
    visible: boolean;
    setVisibleDetailSummary: (visible: boolean) => void;
    transactionByCategoryState: Array<{
        id: number;
        title: string;
        amount: string;
        transaction_type: string;
        description: string;
        transaction_date: string;
    }>;
}

    const SummaryItemDetails: React.FC<SummaryItemDetailsProps> = ({ visible, transactionByCategoryState, setVisibleDetailSummary }) => {
        const renderItem = (item: any) => (
            <View style={styles.itemContainer}>
                <Text style={styles.title}>{item.item.title}</Text>
                <View style={{width:"30%", height:1,backgroundColor:"#eee"}} />
                <Text style={styles.detailText}>Số tiền: {parseFloat(item.item.amount).toLocaleString()} đ</Text>
                <Text style={styles.detailText}>Loại giao dịch: {item.item.transaction_type}</Text>
                <Text style={styles.detailText}>Mô tả: {item.item.description}</Text>
                <Text style={styles.detailText}>Ngày giao dịch: {new Date(item.item.transaction_date).toLocaleDateString()}</Text>
            </View>
        );
    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={() => { }}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.headerText}>Chi tiết giao dịch</Text>
                    <FlatList
                        data={transactionByCategoryState}
                        renderItem={renderItem}
                        keyExtractor={(item) => item.id.toString()}
                    />
                    <TouchableOpacity style={styles.btnCloser} onPress={() => setVisibleDetailSummary(false)}>
                        <Text style={{ color: "red", fontSize: ScaleUtils.scaleFontSize(16), fontWeight: 'bold' }}>X</Text>
                    </TouchableOpacity>
                </View>
            </View>

        </Modal>
    );
};

export default SummaryItemDetails;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        height: 'auto',
maxHeight: ScaleUtils.floorVerticalScale(280),
        backgroundColor: 'white',
        borderRadius: ScaleUtils.scale(10),
        padding: ScaleUtils.scale(20),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    headerText: {
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'green',
    },
    itemContainer: {
        marginVertical: ScaleUtils.scale(5),
        padding: ScaleUtils.scale(10),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: ScaleUtils.scaleFontSize(12),
        fontWeight: 'bold',
        color: 'blue',
    },
    detailText: {
        fontSize: ScaleUtils.scaleFontSize(12),
        marginTop: ScaleUtils.scale(5),
    },
    btnCloser: {
        position: 'absolute', top: 5, right: 10, width: ScaleUtils.floorScale(21),
        height: ScaleUtils.floorVerticalScale(18),
        justifyContent: 'center', borderRadius: 10, alignItems: 'center', backgroundColor: '#fff',
        borderColor: 'red', borderWidth: 1,
    },
});
