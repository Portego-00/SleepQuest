import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Card from '../../../../components/Card';
import Header from '../../../../components/Header';
import {
  DateObject,
  ProcessedHeartRateData,
  ProcessedSleepData,
} from '../../../../utils/types';
import {
  getHeartRateDataForRange,
  getSleepRangeForDay,
} from '../../../../utils/utils';
import {LineChart} from 'react-native-chart-kit';
import {generateLabels} from '../SleepGraphSection/utils';

type HeartRateSectionProps = {
  day: DateObject;
  processedSleepData: ProcessedSleepData;
  processedHeartRateData: ProcessedHeartRateData;
};

const HeartRateSection = ({
  day,
  processedSleepData,
  processedHeartRateData,
}: HeartRateSectionProps) => {
  const {startTime, endTime} = getSleepRangeForDay(day, processedSleepData);

  const heartRateData = getHeartRateDataForRange(
    startTime,
    endTime,
    processedHeartRateData,
  );

  const screenWidth = Dimensions.get('window').width;

  const hours = generateLabels(processedSleepData, day);
  if (hours.length === 0) {
    return null;
  }
  const data = {
    labels: hours.map(hour => hour.toString()),
    datasets: [
      {
        data: heartRateData.map(([, value]) => value),
        strokeWidth: 2,
      },
      {
        data: [
          heartRateData
            .map(([, value]) => value)
            .reduce((a, b) => Math.max(a, b)) + 5,
        ],
        withDots: false,
      },
      {
        data: [
          heartRateData
            .map(([, value]) => value)
            .reduce((a, b) => Math.min(a, b)) - 5,
        ],
        withDots: false,
      },
    ],
  };

  return (
    <>
      <Header title="Heart Rate" />
      <Card>
        <View style={styles.chartContainer}>
          <LineChart
            data={data}
            width={screenWidth * 0.8}
            height={220}
            withInnerLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
            chartConfig={{
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForDots: {
                r: '2',
                strokeWidth: '4',
                stroke: '#cc0000',
              },
            }}
            bezier
          />
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginLeft: -30,
    marginTop: 10,
    alignItems: 'center',
  },
});

export default React.memo(HeartRateSection);
