import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScaleUtils from '@/utils/ScaleUtils';

interface HeaderProps {
  currentMonth: Date;
  onSettingsPress?: () => void;
}

const Header = ({ currentMonth, onSettingsPress }: HeaderProps) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerMonth}>
        {currentMonth.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
      </Text>
      <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
        <MaterialIcons name="settings" size={24} color="#333" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ScaleUtils.floorScale(16),
    paddingVertical: ScaleUtils.floorVerticalScale(8),
    backgroundColor: '#f5f5f5',
  },
  headerMonth: {
    fontSize: ScaleUtils.scaleFontSize(16),
    fontWeight: 'bold',
    color: '#333',
  },
  settingsButton: {
    // padding: ScaleUtils.scale(8),
  },
});

export default Header; 