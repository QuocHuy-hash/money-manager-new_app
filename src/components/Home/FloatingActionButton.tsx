import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScaleUtils from '@/utils/ScaleUtils';

interface FloatingActionButtonProps {
  onPress: () => void;
  iconName?: string;
}

const FloatingActionButton = ({ onPress, iconName = 'add' }: FloatingActionButtonProps) => {
  return (
    <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
      <MaterialIcons name={iconName} size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: ScaleUtils.floorScale(14),
    bottom: ScaleUtils.floorVerticalScale(14),
    width: ScaleUtils.scale(40),
    height: ScaleUtils.scale(40),
    borderRadius: ScaleUtils.scale(28),
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default FloatingActionButton; 