import React from "react";
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from "react-redux";
import { StatusBar, StyleSheet } from "react-native";
import { RootSiblingParent } from 'react-native-root-siblings';
import { makeStore } from "./hooks/store";
import AppNavigator from "./navigation/AppNavigator";
export const Root = () => {
    console.log("Root component rendering");
    const store = makeStore();
    return (
        <Provider store={store}>
            <RootSiblingParent>
                <SafeAreaProvider>
                    <StatusBar backgroundColor={"#000"} barStyle="dark-content" />
                    <AppNavigator />
                </SafeAreaProvider>
            </RootSiblingParent>
        </Provider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Root;