import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import axios from 'axios';
import { Avatar } from 'react-native-elements';
import Svg, { Polyline } from 'react-native-svg';
import { formatCurrency } from '../../utils/format';
import ScaleUtils from '../../utils/ScaleUtils';


const screenWidth = Dimensions.get('window').width;
const chartWidth = screenWidth * 0.2;
const chartHeight = 40;

interface CryptoData {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: string;
    price_change_percentage_24h: number;
    sparkline_in_7d: {
        price: number[];
    };
}

const CryptoPortfolio: React.FC = () => {
    const [cryptos, setCryptos] = useState<CryptoData[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: {
                    vs_currency: 'vnd',
                    ids: 'bitcoin,ethereum,binancecoin,solana,toncoin',
                    order: 'market_cap_desc',
                    per_page: 5,
                    page: 1,
                    sparkline: true,
                },
            });
            setCryptos(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const normalizeData = (data: number[]): string => {
        const minValue = Math.min(...data);
        const maxValue = Math.max(...data);
        return data.map((value, index) => {
            const x = (index / (data.length - 1)) * chartWidth;
            const y = chartHeight - ((value - minValue) / (maxValue - minValue)) * chartHeight;
            return `${x},${y}`;
        }).join(' ');
    };

    const renderItem = ({ item }: { item: CryptoData }) => (
        <View style={styles.itemContainer}>
            <View style={styles.leftContent}>
                <Avatar source={{ uri: item.image }} size="small" />
                <View style={styles.textContainer}>
                    <Text style={styles.symbolText}>{item.symbol.toUpperCase()}</Text>
                    <Text style={styles.nameText}>{item.name}</Text>
                </View>
            </View>
            <View style={styles.chartContainer}>
                <Svg width={chartWidth} height={chartHeight}>
                    <Polyline
                        points={normalizeData(item.sparkline_in_7d.price)}
                        fill="none"
                        stroke={item.price_change_percentage_24h >= 0 ? 'green' : 'red'}
                        strokeWidth="1"
                    />
                </Svg>
            </View>
            <View style={styles.rightContent}>
                <Text style={styles.symbolText}>{formatCurrency(item.current_price)}</Text>
                <Text style={item.price_change_percentage_24h >= 0 ? styles.positiveChange : styles.negativeChange}>
                    {item.price_change_percentage_24h ? `${item.price_change_percentage_24h.toFixed(2)}%` : 'N/A'}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={cryptos}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        borderRadius: ScaleUtils.scale(10),
    },
    listContainer: {
        paddingHorizontal: ScaleUtils.floorScale(4),
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: ScaleUtils.verticalScale(4),
        marginVertical: ScaleUtils.verticalScale(4),
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    rightContent: {
        alignItems: 'flex-end',
    },
    textContainer: {
        marginLeft: ScaleUtils.verticalScale(10),
        justifyContent: 'flex-end',
    },
    symbolText: {
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: 'bold',
    },
    nameText: {
        fontSize: ScaleUtils.scaleFontSize(12),
        color: '#888',
    },
    chartContainer: {
        width: chartWidth,
        height: chartHeight,
        justifyContent: 'flex-start',
    },
    positiveChange: {
        color: 'green',
        marginLeft: 10,
    },
    negativeChange: {
        color: 'red',
        marginLeft: 10,
    },
});

export default CryptoPortfolio;
