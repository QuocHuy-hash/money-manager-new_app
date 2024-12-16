import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import ScaleUtils from '@/utils/ScaleUtils';
import commonStyles from '@/utils/commonStyles';
import imageUtils from '@/utils/imageUtils';
import { useNavigation } from '@react-navigation/native';

interface headerProps {
    title: string
}
const HeaderCommon = ({ title }: headerProps) => {
    const navigation = useNavigation();
    return (
        <View style={[{
            height: ScaleUtils.floorVerticalScale(35),
            backgroundColor: "green",
            paddingHorizontal: ScaleUtils.floorScale(6),
            position: 'relative',
            top: 0,
            right: 0,
            left: 0,
        },
        commonStyles.alignCenter,
        commonStyles.row,
        ]}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                    source={imageUtils('prev_header')}
                    style={[{
                        width: ScaleUtils.floorScale(20),
                        height: ScaleUtils.floorVerticalScale(20),
                        marginLeft: ScaleUtils.floorScale(5),
                    }]}
                />
            </TouchableOpacity>
            <Text style={[{
                color: 'white',
                fontSize: ScaleUtils.scaleFontSize(16),
                marginLeft: ScaleUtils.floorScale(10),
            },commonStyles.textBold]}>{title}</Text>
        </View>
    );
};

export default HeaderCommon;

const styles = StyleSheet.create({});
