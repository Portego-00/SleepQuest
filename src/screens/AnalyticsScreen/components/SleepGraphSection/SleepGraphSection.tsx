import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import Card from '../../../../components/Card';
import Header from '../../../../components/Header';
import {DateObject, ProcessedSleepData} from '../../../../utils/types';
import {LineChart} from 'react-native-chart-kit';

type SleepGraphSectionProps = {
  day: DateObject;
  processedSleepData: ProcessedSleepData;
};

const SleepGraphSection = ({
  day,
  processedSleepData,
}: SleepGraphSectionProps) => {
  const data = {
    labels: ['11', '12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    datasets: [
      {
        data: [3, 2.5, 1.5, 1.5, 2, 2, 2, 1.5, 3, 2, 2.5, 3],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
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
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
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
          // Format y-axis labels. If value is 1, then show Deep, if value is 2, then show Light, if value is 3, then show REM
          formatYLabel={value => {
            console.log(value);
            if (value === '1.50') {
              return 'Deep';
            } else if (value === '2.00') {
              return 'REM';
            } else if (value === '2.50') {
              return 'Light';
            } else if (value === '3.00') {
              return 'Awake';
            }
            return '';
          }}
        />
      </Card>
    </>
  );
};

const styles = StyleSheet.create({});

export default React.memo(SleepGraphSection);
