import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../Screens/LoginScreen';
import { SafeAreaView, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from '@/Screens/HomeScreen';
import RegisterScreen from '@/Screens/RegisterScreen';
import BottomTabNavigator from './BottomTabNavigator';
import GoalDetailsView from '@/Screens/GoalDetailsScreen';
import InfoView from '@/Screens/InfoScreen';

const Stack = createNativeStackNavigator();
const AppNavigator = () => {
    return (
            <NavigationContainer>
                <SafeAreaView style={{ flex: 1 }}>
                <Stack.Navigator initialRouteName="LoginScreen">
                    <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}/>
                    <Stack.Screen name="HomeScreen" component={BottomTabNavigator} options={{ headerShown: false }} />
                    <Stack.Screen name="RegisterScr" component={RegisterScreen} options={{ headerShown: false }} />
                    <Stack.Screen name="GoalDetailsView" component={GoalDetailsView} options={{ headerShown: false }} />
                    <Stack.Screen name="InfoView" component={InfoView} options={{ headerShown: false }} />
                </Stack.Navigator>
            </SafeAreaView>
            </NavigationContainer>
    ); 
}; 


export default AppNavigator;
