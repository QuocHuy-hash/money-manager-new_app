import ScaleUtils from '@/utils/ScaleUtils';
import React from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';

interface ReportData {
    amount_saved: number;
    month: string;
    percentage_of_goal: number;
}

interface GoalProgressData {
    currentAmount: string;
    goalName: string;
    reportData: ReportData[];
    targetAmount: string;
    totalSaved: number;
}

interface GoalProgressChartProps {
    data: GoalProgressData;
    target: number;
}

const screenWidth = Dimensions.get('window').width;

const formatVND = (value: number) => {
    return `${value.toLocaleString('vi-VN')} ₫`;
};

const abbreviateNumber = (value: number) => {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
};

const GoalProgressChart = ({ data, target }: GoalProgressChartProps) => {
    if (!data || !data.reportData || data.reportData.length === 0) {
        return (
            <View style={styles.noDataContainer}>
                <Text style={styles.noDataText}>Chưa có dữ liệu tiết kiệm</Text>
            </View>
        );
    }

    // Calculate percentage of goal completed
    const percentComplete = Math.min(Math.round((data.totalSaved / target) * 100), 100);

    // Map reportData to the format expected by gifted-charts
    const chartData = data.reportData.map((item, index) => ({
        value: item.amount_saved,
        label: item.month,
        frontColor: item.percentage_of_goal >= 100 ? '#4CAF50' : '#66BB6A',
        topLabelComponent: () => (
            <Text style={styles.topLabel}>
                {abbreviateNumber(item.amount_saved)}
            </Text>
        ),
        customData: item.amount_saved,
        spacing: 10,
    }));

    const yAxisMaxValue = Math.max(...data.reportData.map(item => item.amount_saved)) * 1.2;

    // Create abbreviated y-axis labels
    const yAxisLabels = [
        0,
        yAxisMaxValue * 0.25,
        yAxisMaxValue * 0.5,
        yAxisMaxValue * 0.75,
        yAxisMaxValue,
    ].map(value => abbreviateNumber(value));

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>
                        {formatVND(data.totalSaved)} / {formatVND(target)}
                    </Text>
                    <Text style={styles.percentText}>{percentComplete}%</Text>
                </View>

                <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBackground}>
                        <View
                            style={[
                                styles.progressBar,
                                { width: `${percentComplete}%` }
                            ]}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.chartContainer}>
                <Text style={styles.chartSubtitle}>Số tiền tiết kiệm hàng tháng</Text>
                <BarChart
                    data={chartData}
                    barWidth={25}
                    barBorderRadius={4}
                    spacing={5}
                    hideRules
                    xAxisThickness={1}
                    yAxisThickness={1}
                    xAxisColor="#EEEEEE"
                    yAxisColor="#EEEEEE"
                    yAxisLabelTexts={yAxisLabels}
                    xAxisLabelTextStyle={styles.xAxisLabel}
                    noOfSections={4}
                    height={220}
                    width={screenWidth - 60}
                    yAxisTextStyle={styles.yAxisLabel}
                    // renderTooltip={(index: number) => (
                    //     <View style={styles.tooltipContainer}>
                    //         <Text style={styles.tooltipText}>
                    //             {formatVND(chartData[index].customData)}
                    //         </Text>
                    //     </View>
                    // )}
                    barMarginBottom={10}
                    showGradient
                    gradientColor={'#81C784'}
                />
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Tổng tiết kiệm</Text>
                    <Text style={styles.summaryValue}>{formatVND(data.totalSaved)}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Mục tiêu</Text>
                    <Text style={styles.summaryValue}>{formatVND(target)}</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Còn thiếu</Text>
                    <Text style={[styles.summaryValue, { color: '#F44336' }]}>
                        {formatVND(Math.max(target - data.totalSaved, 0))}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: ScaleUtils.scale(12),
        padding: ScaleUtils.scale(15),
        margin: ScaleUtils.scale(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerContainer: {
        marginBottom: ScaleUtils.scale(8),
    },
    progressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ScaleUtils.scale(5),
    },
    progressText: {
        fontSize: ScaleUtils.scaleFontSize(14),
        color: '#555555',
    },
    percentText: {
        fontSize: ScaleUtils.scaleFontSize(14),
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    progressBarContainer: {
        marginBottom: ScaleUtils.scale(10),
    },
    progressBarBackground: {
        height: ScaleUtils.scale(8),
        backgroundColor: '#E0E0E0',
        borderRadius: ScaleUtils.scale(4),
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: ScaleUtils.scale(4),
    },
    chartContainer: {
        marginBottom: ScaleUtils.floorVerticalScale(10),
    },
    chartSubtitle: {
        fontSize: ScaleUtils.scaleFontSize(12),
        color: '#555555',
        marginBottom: ScaleUtils.scale(10),
    },
    xAxisLabel: {
        fontSize: ScaleUtils.scaleFontSize(10),
        color: '#757575',
        marginTop: ScaleUtils.scale(5),
    },
    yAxisLabel: {
        fontSize: ScaleUtils.scaleFontSize(10),
        color: '#757575',
        width: ScaleUtils.scale(40),
        marginRight: ScaleUtils.scale(5),
    },
    tooltipContainer: {
        backgroundColor: '#333333',
        padding: ScaleUtils.scale(8),
        borderRadius: ScaleUtils.scale(6),
    },
    tooltipText: {
        color: 'white',
        fontSize: ScaleUtils.scaleFontSize(10),
    },
    topLabel: {
        color: 'red',
        fontSize: ScaleUtils.scaleFontSize(8),
        marginTop: ScaleUtils.floorVerticalScale(10),
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        paddingTop: ScaleUtils.scale(15),
    },
    summaryItem: {
        flex: 1,
        alignItems: 'center',
    },
    summaryLabel: {
        fontSize: ScaleUtils.scaleFontSize(12),
        fontWeight: "bold",
        color: '#757575',
        marginBottom: ScaleUtils.scale(5),
    },
    summaryValue: {
        fontSize: ScaleUtils.scaleFontSize(12),
        fontWeight: 'bold',
        color: '#333333',
    },
    noDataContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        margin: ScaleUtils.scale(10),
    },
    noDataText: {
        fontSize: ScaleUtils.scaleFontSize(14),
        color: '#757575',
    },
});

export default GoalProgressChart;