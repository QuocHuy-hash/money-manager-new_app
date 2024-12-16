import ScaleUtils from '@/utils/ScaleUtils';
import React from 'react';
import { Text, View } from 'react-native';
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

const formatVND = (value: number) => {
    return `${value.toLocaleString()} VND`;
};

const GoalProgressChart = ({ data, target }: GoalProgressChartProps) => {
    console.log("data", data);

    if (!data || !data.reportData || data.reportData.length === 0) {
        return <Text>No data available</Text>;
    }

    // Map reportData to the format expected by gifted-charts
    const chartData = data.reportData.map((item) => ({
        value: item.amount_saved,
        label: item.month,
        customData: item.amount_saved,
    }));

    const yAxisMaxValue = Math.max(...data.reportData.map(item => item.amount_saved)) * 1.2;

    // Create formatted y-axis labels with VND
    const yAxisLabels = [
        0,
        yAxisMaxValue * 0.25,
        yAxisMaxValue * 0.5,
        yAxisMaxValue * 0.75,
        yAxisMaxValue,
    ].map(value => value.toLocaleString());

    return (
        <View style={{ padding: ScaleUtils.scale(15) }}>
            <BarChart
                data={chartData}
                barWidth={22}
                barBorderRadius={4}
                frontColor="green"
                yAxisLabelTexts={yAxisLabels}  // Now using formatted VND labels
                xAxisLabelTextStyle={{ fontSize: 10, color: 'grey' }}
                noOfSections={4}
                height={ScaleUtils.scale(100)}
                yAxisTextStyle={{
                    fontSize: 10,
                    color: 'grey',
                    width: ScaleUtils.scale(60),
                    marginRight: ScaleUtils.scale(5),
                }}
                yAxisThickness={1}
                renderTooltip={(index: number) => (
                    <Text style={{ fontSize: ScaleUtils.scaleFontSize(10), color: 'red' }}>
                        {formatVND(chartData[index].customData)}
                    </Text>
                )}
                hideRules
            />
        </View>
    );
};

export default GoalProgressChart;
