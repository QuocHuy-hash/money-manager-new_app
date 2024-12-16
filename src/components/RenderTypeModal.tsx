import ScaleUtils from "@/utils/ScaleUtils";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FlatList, TouchableWithoutFeedback, View } from "react-native";
import { Modal } from "react-native";

export const renderTypeModal = (
    options: { id: number, name: string }[],
    visible: boolean,
    onSelect: (option: string) => void,
    onClose: () => void
) => (
    <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
    >
        <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.optionModalOverlay}>
                <TouchableWithoutFeedback>
                    <View style={styles.optionModalContainer}>
                        <FlatList
                            data={options}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.optionItem}
                                    onPress={() => {
                                        onSelect(item.name);
                                        onClose();
                                    }}
                                >
                                    <Text>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
);

const styles = StyleSheet.create({
    optionModalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    optionModalContainer: {
        backgroundColor: 'white',
        borderTopLeftRadius: ScaleUtils.scaleFontSize(10),
        borderTopRightRadius: ScaleUtils.scaleFontSize(10),
        padding: ScaleUtils.scaleFontSize(16),
        maxHeight: '50%',
    },
    optionItem: {
        padding: ScaleUtils.scaleFontSize(10),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
});
