import React from 'react';
import {ProgressChart} from 'react-native-chart-kit';
import {StyleSheet, Text, Dimensions, TouchableOpacity} from 'react-native';
import {calculateScoreColor} from '../../utils';
import {ProcessedSleepData} from '../../../../utils/types';
import {
  SleepType,
  calculateScore,
  calculateTotalTime,
  getSleepDataForDay,
} from '../../../../utils/utils';

type DayChartProps = {
  day: string;
  date: Date;
  isSelected?: boolean;
  onPress?: (day: string) => void;
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
  const chartSize = windowWidth * 0.11;

  const containerStyle = isSelected ? {opacity: 1} : {opacity: 0.5};

  const handlePress = () => {
    if (onPress) {
      onPress(day);
    }
  };

  console.log('Day: ', day);

  const deepSleepForSelectedDay = day
    ? getSleepDataForDay(day, SleepType.DEEP, sleepData)
    : [];

  const remSleepForSelectedDay = day
    ? getSleepDataForDay(day, SleepType.REM, sleepData)
    : [];

  const coreSleepForSelectedDay = day
    ? getSleepDataForDay(day, SleepType.CORE, sleepData)
    : [];

  const inBedForSelectedDay = day
    ? getSleepDataForDay(day, SleepType.INBED, sleepData)
    : [];

  const totalDeepTime = calculateTotalTime(deepSleepForSelectedDay);
  const totalRemTime = calculateTotalTime(remSleepForSelectedDay);
  const totalCoreTime = calculateTotalTime(coreSleepForSelectedDay);
  const totalInBedTime = calculateTotalTime(inBedForSelectedDay);

  const newScore = calculateScore(
    totalDeepTime,
    totalRemTime,
    totalCoreTime,
    totalInBedTime,
  );

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
