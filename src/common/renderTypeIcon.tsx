import React from 'react';
import { View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const typeIconMap: { [key: string]: string } = {
    'Ăn uống': 'restaurant',
    'Di chuyển': 'directions-car',
    'Giải trí': 'sports-esports',
    'Mua sắm': 'shopping-cart',
    'Hóa đơn & Tiện ích': 'receipt',
    'Sức khỏe': 'fitness-center',
    'Giáo dục': 'school',
    'Lương': 'attach-money',
    'Đầu tư': 'trending-up',
    'Quà tặng': 'card-giftcard'
};

interface TypeIconProps {
    type: string;
    size?: number;
    color?: string;
    style?: React.ComponentProps<typeof View>['style'];
}

const TypeIcon: React.FC<TypeIconProps> = ({ type, size = 24, color = 'black' }) => {
    const iconName = typeIconMap[type] || 'help-circle-outline';

    return (
        <MaterialIcons name={iconName} size={size} color={color} />
    );
};

export default TypeIcon;