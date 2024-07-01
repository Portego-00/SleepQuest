import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Card from '../../../../components/Card';
import Header from '../../../../components/Header';
import {DateObject, ProcessedSleepData} from '../../../../utils/types';
import {LineChart} from 'react-native-chart-kit';
import {generateLabels} from './utils';

type SleepGraphSectionProps = {
  day: DateObject;
  processedSleepData: ProcessedSleepData;
};

const SleepGraphSection = ({
  day,
  processedSleepData,
}: SleepGraphSectionProps) => {
  const labels = generateLabels(processedSleepData, day);
  console.log(labels);
  const data = {
    labels: labels,
    datasets: [
      {
        data: [
          3, 2, 0, 0, 1, 1, 1, 0, 3, 2, 2, 3, 3, 2, 0, 0, 1, 1, 1, 0, 3, 2, 2,
          3, 3, 2, 0, 0, 1, 1, 1, 0, 3, 2, 2, 3, 3, 2, 0, 0, 1, 1, 1, 0, 3, 2,
          2, 3,
        ],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: [0],
        withDots: false,
      },
      {
        data: [4],
        withDots: false,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientToOpacity: 0,
    backgroundGradientFromOpacity: 0,
    decimalPlaces: 2, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '0',
    },
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <>
      <Header title="Sleep" />
      <Card>
        <LineChart
          data={data}
          width={screenWidth * 0.8}
          height={220}
          chartConfig={chartConfig}
          bezier
          withInnerLines={false}
          withVerticalLines={false}
          withHorizontalLines={false}
          formatYLabel={value => {
            if (value === '0.00') {
              return 'Deep';
            } else if (value === '1.00') {
              return 'REM';
            } else if (value === '2.00') {
              return 'Light';
            } else if (value === '3.00') {
              return 'Awake';
            }
            return '';
          }}
          style={styles.chartStyle}
        />
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  chartStyle: {
    marginTop: -30,
  },
});

export default React.memo(SleepGraphSection);
