import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ScaleUtils from '@/utils/ScaleUtils';
import { formatCurrency } from '@/utils/format';

interface Category {
  id: number;
  title: string;
  name: string;
  amount: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedType: string;
  onSelectType: (name: string) => void;
}

const CategoryTabs = ({ categories, selectedType, onSelectType }: CategoryTabsProps) => {
  return (
    <View style={styles.categoryTabs}>
      {categories && categories.map((category, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.categoryTab,
            selectedType === category.name && styles.selectedCategoryTab
          ]}
          onPress={() => onSelectType(category.name)}
        >
          <MaterialIcons
            name={category.name === 'salary' ? 'attach-money' : 'shopping-cart'}
            size={18}
            color={selectedType === category.name ? '#fff' : '#555'}
          />
          <Text style={[
            styles.categoryTabText,
            selectedType === category.name && styles.selectedCategoryTabText
          ]}>
            {category.title}
          </Text>
          <Text style={[
            styles.categoryTabAmount,
            selectedType === category.name && styles.selectedCategoryTabText
          ]}>
            {formatCurrency(category.amount)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  categoryTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: ScaleUtils.floorScale(16),
    marginBottom: ScaleUtils.floorVerticalScale(16),
  },
  categoryTab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: ScaleUtils.floorVerticalScale(12),
    marginHorizontal: ScaleUtils.floorScale(6),
    backgroundColor: '#fff',
    borderRadius: ScaleUtils.scale(12),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategoryTab: {
    backgroundColor: '#4285F4',
  },
  categoryTabText: {
    fontSize: ScaleUtils.scaleFontSize(12),
    fontWeight: 'bold',
    color: '#555',
    marginTop: ScaleUtils.floorVerticalScale(4),
  },
  categoryTabAmount: {
    fontSize: ScaleUtils.scaleFontSize(12),
    color: '#333',
    marginTop: ScaleUtils.floorVerticalScale(4),
  },
  selectedCategoryTabText: {
    color: '#fff',
  },
});

export default CategoryTabs; 