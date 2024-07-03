import React from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
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

  const deepSleepPercentage = (deepSleepTime / totalTime) * 100;
  const remSleepPercentage = (remSleepTime / totalTime) * 100;
  const coreSleepPercentage = (coreSleepTime / totalTime) * 100;
  const awakePercentage = (awakeTime / totalTime) * 100;

  const sleepStages = [
    {
      label: 'Deep Sleep',
      time: deepSleepTime,
      percentage: deepSleepPercentage,
      color: styles.deepSleep,
    },
    {
      label: 'Awake',
      time: awakeTime,
      percentage: awakePercentage,
      color: styles.awake,
    },
    {
      label: 'REM Sleep',
      time: remSleepTime,
      percentage: remSleepPercentage,
      color: styles.remSleep,
    },
    {
      label: 'Core Sleep',
      time: coreSleepTime,
      percentage: coreSleepPercentage,
      color: styles.coreSleep,
    },
  ];

  return (
    <>
      <Header title="Sleep Stages" />
      <Card>
        <View style={styles.wrapper}>
          <View style={styles.barContainer}>
            {sleepStages.map((stage, index) => (
              <View
                key={index}
                style={[
                  styles.barSegment,
                  stage.color,
                  {width: `${stage.percentage}%`},
                ]}
              />
            ))}
          </View>
        </View>
        <View style={styles.detailsContainer}>
          {sleepStages.map((stage, index) => (
            <View key={index} style={styles.detailItem}>
              <View style={[styles.circle, stage.color]} />
              <View style={styles.detailContent}>
                <Text style={styles.labelText}>{stage.label}</Text>
                <View style={{flexDirection: 'row'}}>
                  <Text style={styles.timeText}>{formatTime(stage.time)}</Text>
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
});

export default React.memo(SleepStagesSection);
