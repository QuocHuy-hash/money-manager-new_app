import { StyleSheet, Text, View } from 'react-native';
import React, { useRef } from 'react';
import commonStyles from '@/utils/commonStyles';
import ScaleUtils from '@/utils/ScaleUtils';
import { ScrollView } from 'react-native';
import { TouchableOpacity } from 'react-native';

import TypeIcon from '@/common/renderTypeIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';



const ButtonHome = ({ categories }: { categories : any}) => {
    const [activeCategory, setActiveCategory] = React.useState(0);
    const scrollViewRef = useRef<ScrollView>(null);
    const navigation = useNavigation();
    const handleCategoryPress = (index: any) => {
        setActiveCategory(index);
        if (index === 1) {
            // navigation.navigate('goals');
        }
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: index * (ScaleUtils.floorScale(120) + ScaleUtils.floorScale(10)),
                animated: true,
            });
        }

    };
    return (
        <View style={[commonStyles.row, styles.container]}>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScrollContent}
            >
                {categories.map((category:any, index:number) => (
                    <View key={category.id} style={[{ marginHorizontal: ScaleUtils.floorScale(10)},commonStyles.alignCenter]}>
                        <TouchableOpacity
                            style={[styles.categoryButton, index === activeCategory && styles.categoryButtonActive]}
                            onPress={() => handleCategoryPress(index)}
                        >
                            <MaterialIcons name={category.icon} size={24} color={index === activeCategory ? '#fff' : '#666'} />
                            {/* <Text style={[styles.categoryButtonText, index === activeCategory && styles.categoryButtonTextActive]}>{category.name}</Text> */}
                        </TouchableOpacity>
                        <Text style={styles.categoryButtonText}>{category.name}</Text>
                    </View>))}
            </ScrollView>
        </View>
    );
};

export default ButtonHome;

const styles = StyleSheet.create({
    container: {

    },

    categoryScrollContent: {
        marginTop: ScaleUtils.floorVerticalScale(20),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryButton: {
        flexDirection: 'column',  // Icons above text
        alignItems: 'center',
        justifyContent: 'center',
        width: ScaleUtils.floorScale(50),
        height: ScaleUtils.floorVerticalScale(40),
        borderRadius: ScaleUtils.floorScale(12),

        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#F0F0F0',
        padding: ScaleUtils.floorScale(8),
    },
    categoryButtonActive: {
        backgroundColor: "#4CAF50",  // Active state background
    },
    categoryButtonText: {
        color: '#666',
        marginTop: ScaleUtils.floorScale(2),  // Space between icon and text
        fontSize: ScaleUtils.floorVerticalScale(10),
    },
    categoryButtonTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
