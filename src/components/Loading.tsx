import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

type LoadingProps = {
    size?: 'small' | 'large';
    color?: string;
};

const Loading: React.FC<LoadingProps> = ({ size = 'large', color = '#0000ff' }) => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={color} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
    },
});

export default Loading;
