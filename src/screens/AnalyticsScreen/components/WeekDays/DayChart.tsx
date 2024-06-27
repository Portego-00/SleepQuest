import React from 'react';
import {ProgressChart} from 'react-native-chart-kit';
import {StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';
import {calculateScoreColor} from '../../utils';
import {DateObject, ProcessedSleepData} from '../../../../utils/types';
import {calculateScore} from '../../../../utils/utils';

type DayChartProps = {
  day: string;
  date: Date;
  isSelected?: boolean;
  onPress?: (day: DateObject) => void;
  sleepData: ProcessedSleepData;
};

const DayChart = ({
  day,
  date,
  isSelected,
  onPress,
  sleepData,
}: DayChartProps) => {
  const windowWidth = Dimensions.get('window').width;
  const chartSize = (windowWidth - 40) / 7;

  const containerStyle = isSelected ? {opacity: 1} : {opacity: 0.5};

  const handlePress = () => {
    if (onPress) {
      onPress({day, date});
    }
  };

  const newScore = calculateScore(sleepData, {day, date});

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={handlePress}>
      <Text style={styles.day}>{day}</Text>
      <Text style={styles.date}>{date.getDate()}</Text>
      <ProgressChart
        data={{
          data: [newScore],
        }}
        width={chartSize}
        height={chartSize}
        strokeWidth={5}
        radius={chartSize / 3}
        hideLegend
        style={styles.scoreChart}
        chartConfig={{
          decimalPlaces: 2,
          color: (opacity = 1) => calculateScoreColor(newScore, opacity),
          backgroundGradientToOpacity: 0,
          backgroundGradientFromOpacity: 0,
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scoreChart: {
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
  day: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Nunito-Regular',
    color: '#D2D5D9',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#D2D5D9',
  },
});

export default DayChart;
