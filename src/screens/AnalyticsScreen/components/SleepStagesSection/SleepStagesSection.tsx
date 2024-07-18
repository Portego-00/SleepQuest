import React, {useEffect, useRef} from 'react';
import {StyleSheet, View, Text, Animated} from 'react-native';
import Card from '../../../../components/Card';
import Header from '../../../../components/Header';
import {DateObject, ProcessedSleepData} from '../../../../utils/types';
import {
  calculateTotalTime,
  formatTime,
  getAllSleepDataForDay,
} from '../../../../utils/utils';

type SleepStagesSectionProps = {
  day: DateObject;
  processedSleepData: ProcessedSleepData;
};

const SleepStagesSection = ({
  day,
  processedSleepData,
}: SleepStagesSectionProps) => {
  const {deepSleepData, remSleepData, coreSleepData, awakeData} =
    getAllSleepDataForDay(day, processedSleepData);

  const deepSleepTime = calculateTotalTime(deepSleepData);
  const remSleepTime = calculateTotalTime(remSleepData);
  const coreSleepTime = calculateTotalTime(coreSleepData);
  const awakeTime = calculateTotalTime(awakeData);

  const totalTime = deepSleepTime + remSleepTime + coreSleepTime + awakeTime;

  let deepSleepPercentage = 0;
  let remSleepPercentage = 0;
  let coreSleepPercentage = 0;
  let awakePercentage = 0;
  let undefinedPercentage = 0;

  if (totalTime !== 0) {
    deepSleepPercentage = (deepSleepTime / totalTime) * 100;
    remSleepPercentage = (remSleepTime / totalTime) * 100;
    coreSleepPercentage = (coreSleepTime / totalTime) * 100;
    awakePercentage = (awakeTime / totalTime) * 100;
  } else {
    undefinedPercentage = 100;
  }

  const animatedWidths = {
    deepSleep: useRef(new Animated.Value(0)).current,
    remSleep: useRef(new Animated.Value(0)).current,
    coreSleep: useRef(new Animated.Value(0)).current,
    awake: useRef(new Animated.Value(0)).current,
    undefined: useRef(new Animated.Value(0)).current,
  };

  useEffect(() => {
    Animated.timing(animatedWidths.deepSleep, {
      toValue: deepSleepPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedWidths.remSleep, {
      toValue: remSleepPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedWidths.coreSleep, {
      toValue: coreSleepPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedWidths.awake, {
      toValue: awakePercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedWidths.undefined, {
      toValue: undefinedPercentage,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [
    deepSleepPercentage,
    remSleepPercentage,
    coreSleepPercentage,
    awakePercentage,
    undefinedPercentage,
    animatedWidths.awake,
    animatedWidths.coreSleep,
    animatedWidths.deepSleep,
    animatedWidths.remSleep,
    animatedWidths.undefined,
  ]);

  const sleepStages = [
    {
      label: 'Deep Sleep',
      time: deepSleepTime,
      animatedPercentage: animatedWidths.deepSleep,
      percentage: deepSleepPercentage,
      color: styles.deepSleep,
    },
    {
      label: 'Awake',
      time: awakeTime,
      animatedPercentage: animatedWidths.awake,
      percentage: awakePercentage,
      color: styles.awake,
    },
    {
      label: 'REM Sleep',
      time: remSleepTime,
      animatedPercentage: animatedWidths.remSleep,
      percentage: remSleepPercentage,
      color: styles.remSleep,
    },
    {
      label: 'Core Sleep',
      time: coreSleepTime,
      animatedPercentage: animatedWidths.coreSleep,
      percentage: coreSleepPercentage,
      color: styles.coreSleep,
    },
    {
      label: 'Undefined',
      time: 0,
      animatedPercentage: animatedWidths.undefined,
      percentage: 0,
      color: styles.undefinedColor,
    },
  ];

  return (
    <>
      <Header title="Sleep Stages" />
      <Card>
        <View style={styles.wrapper}>
          <View style={styles.barContainer}>
            {sleepStages.map((stage, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.barSegment,
                  stage.color,
                  {
                    width: stage.animatedPercentage.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.detailsContainer}>
          {totalTime === 0 && (
            <Text style={styles.noDataTextStyle}>No sleep data available</Text>
          )}
          {totalTime !== 0 &&
            sleepStages.slice(0, 4).map((stage, index) => (
              <View key={index} style={styles.detailItem}>
                <View style={[styles.circle, stage.color]} />
                <View style={styles.detailContent}>
                  <Text style={styles.labelText}>{stage.label}</Text>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.timeText}>
                      {formatTime(stage.time)}
                    </Text>
                    <Text
                      style={
                        styles.percentageText
                      }>{`  ${stage.percentage.toFixed(1)}%`}</Text>
                  </View>
                </View>
              </View>
            ))}
        </View>
      </Card>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: '90%',
    height: 40,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  barContainer: {
    flexDirection: 'row',
    height: 40,
  },
  barSegment: {
    height: '100%',
  },
  deepSleep: {
    backgroundColor: '#003f5c',
  },
  remSleep: {
    backgroundColor: '#58508d',
  },
  coreSleep: {
    backgroundColor: '#4682B4',
  },
  awake: {
    backgroundColor: '#ff6361',
  },
  undefinedColor: {
    backgroundColor: 'rgba(67,67,67,1)',
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '45%',
    marginVertical: 5,
  },
  detailContent: {
    flex: 1,
    flexDirection: 'column',
  },
  labelText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#D2D5D9',
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#D2D5D9',
  },
  percentageText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#808080',
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  noDataTextStyle: {
    fontFamily: 'Nunito-Regular',
    color: '#D2D5D9',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default React.memo(SleepStagesSection);
