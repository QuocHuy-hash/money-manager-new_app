import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/Screens/HomeScreen';
import ScaleUtils from '@/utils/ScaleUtils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AccountView from '@/Screens/AccountScreen';
import TransactionList from '@/Screens/HisTransactionScreen';
import GoalsScreen from '@/Screens/GoalsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: ScaleUtils.floorVerticalScale(35),
          paddingBottom: ScaleUtils.floorVerticalScale(5),
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
          tabBarLabel: 'Trang chủ'
        }}
      />
      <Tab.Screen
        name="TransactionList"
        component={TransactionList}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="history" size={size} color={color} />
          ),
          tabBarLabel: 'Giao dịch'
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="flag" size={size} color={color} />
          ),
          tabBarLabel: 'Mục tiêu'
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountView} 
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-balance-wallet" size={size} color={color} />
          ),
          tabBarLabel: 'Tài khoản'
        }}
      />
       
    </Tab.Navigator>
  );
}; 

export default BottomTabNavigator;