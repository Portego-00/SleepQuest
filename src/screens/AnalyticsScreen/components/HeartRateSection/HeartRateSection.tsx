import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
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
import Icon from 'react-native-vector-icons/Ionicons';

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

  if (heartRateData.length === 0) {
    return null;
  }

  const screenWidth = Dimensions.get('window').width;

  const hours = generateLabels(processedSleepData, day);
  if (hours.length === 0) {
    return null;
  }

  const maxHeartRate = heartRateData.reduce(
    (max, [, value]) => Math.max(max, value),
    0,
  );
  const minHeartRate = heartRateData.reduce(
    (min, [, value]) => Math.min(min, value),
    maxHeartRate,
  );
  const averageHeartRate = Math.round(
    heartRateData.reduce((sum, [, value]) => sum + value, 0) /
      heartRateData.length,
  );

  console.log('Max Heart Rate:', maxHeartRate);
  console.log('Min Heart Rate:', minHeartRate);
  console.log('Average Heart Rate:', averageHeartRate);

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
            ?.map(([, value]) => value)
            ?.reduce((a, b) => Math.max(a, b)) + 5,
        ],
        withDots: false,
      },
      {
        data: [
          heartRateData
            ?.map(([, value]) => value)
            ?.reduce((a, b) => Math.min(a, b)) - 5,
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
                r: '0',
              },
            }}
            bezier
          />
        </View>
        <View style={styles.dataContainer}>
          <View style={styles.dataTitleContainer}>
            <Icon name="heart" size={20} color="#eb4b63" />
            <Text style={styles.dataTitle}>Heart Rate Data</Text>
          </View>
          <Text style={styles.dataText}>
            Range: {minHeartRate} - {maxHeartRate} bpm
          </Text>
          <Text style={styles.dataText}>Average: {averageHeartRate} bpm</Text>
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
  dataTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 18,
    color: '#eb4b63',
  },
  dataTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dataContainer: {
    marginTop: 20,
    marginLeft: 20,
  },
  dataText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 16,
    color: '#D2D5D9',
  },
});

export default React.memo(HeartRateSection);
