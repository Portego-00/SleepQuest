import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import Card from '../../../../components/Card';
import {ProgressChart} from 'react-native-chart-kit';
import {calculateScoreColor} from '../../utils';
import Header from '../../../../components/Header';
import {DateObject, ProcessedSleepData} from '../../../../utils/types';
import {
  SleepType,
  calculateScore,
  calculateTotalTime,
  getSleepDataForDay,
} from '../../../../utils/utils';

type ScoreSectionProps = {
  day: DateObject;
  processedSleepData: ProcessedSleepData;
};

const ScoreSection = ({day, processedSleepData}: ScoreSectionProps) => {
  const initialScore = 0;

  const [dayScore, setDayScore] = useState(initialScore);
  const [currentAnimatedValue, setCurrentAnimatedValue] =
    useState(initialScore);
  const animatedScore = useRef(new Animated.Value(initialScore)).current;

  const handleScoreChange = useCallback(() => {
    const id = animatedScore.addListener(({value}) => {
      setCurrentAnimatedValue(value);
    });

    return () => {
      animatedScore.removeListener(id);
    };
  }, [animatedScore]);

  useEffect(() => {
    handleScoreChange();
  }, [handleScoreChange]);

  const deepSleepForSelectedDay = useMemo(
    () =>
      day ? getSleepDataForDay(day, SleepType.DEEP, processedSleepData) : [],
    [day, processedSleepData],
  );

  const remSleepForSelectedDay = useMemo(
    () =>
      day ? getSleepDataForDay(day, SleepType.REM, processedSleepData) : [],
    [day, processedSleepData],
  );

  const coreSleepForSelectedDay = useMemo(
    () =>
      day ? getSleepDataForDay(day, SleepType.CORE, processedSleepData) : [],
    [day, processedSleepData],
  );

  const inBedForSelectedDay = useMemo(
    () =>
      day ? getSleepDataForDay(day, SleepType.INBED, processedSleepData) : [],
    [day, processedSleepData],
  );

  const totalDeepTime = useMemo(
    () => calculateTotalTime(deepSleepForSelectedDay),
    [deepSleepForSelectedDay],
  );
  const totalRemTime = useMemo(
    () => calculateTotalTime(remSleepForSelectedDay),
    [remSleepForSelectedDay],
  );
  const totalCoreTime = useMemo(
    () => calculateTotalTime(coreSleepForSelectedDay),
    [coreSleepForSelectedDay],
  );
  const totalInBedTime = useMemo(
    () => calculateTotalTime(inBedForSelectedDay),
    [inBedForSelectedDay],
  );
  const totalSleepTime = totalDeepTime + totalRemTime + totalCoreTime;

  useEffect(() => {
    const newScore = calculateScore(processedSleepData, day);
    setDayScore(newScore);
  }, [processedSleepData, day]);

  useEffect(() => {
    Animated.timing(animatedScore, {
      toValue: dayScore,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [dayScore, animatedScore]);

  const scoreColor = calculateScoreColor(dayScore);

  return (
    <>
      <Header title="Score" />
      <Card>
        <View style={styles.scoreContainer}>
          <View style={styles.scoreChartContainer}>
            <AnimatedProgressChart
              data={{
                data: [animatedScore],
              }}
              width={140}
              height={140}
              strokeWidth={15}
              radius={50}
              chartConfig={{
                backgroundGradientToOpacity: 0,
                backgroundGradientFromOpacity: 0,
                decimalPlaces: 2,
                color: (opacity = 1) => calculateScoreColor(dayScore, opacity),
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              hideLegend={true}
              style={styles.scoreChart}
            />
          </View>
          <View style={styles.scoreSpacer} />
          <View style={styles.scoreInfoContainer}>
            <Text style={styles.scoreInfoTitle}>Score</Text>
            <Text style={[styles.scoreInfoText, {color: scoreColor}]}>
              {Math.round(currentAnimatedValue * 1000)}
            </Text>
            <Text style={styles.scoreInfoTitle}>Sleep Time</Text>
            <Text style={styles.timeText}>
              {`${Math.floor(totalSleepTime / 3600000)} hours ${Math.floor(
                (totalSleepTime % 3600000) / 60000,
              )} minutes`}
            </Text>
            <Text style={styles.scoreInfoTitle}>Time in Bed</Text>
            <Text style={styles.timeText}>
              {`${Math.floor(totalInBedTime / 3600000)} hours ${Math.floor(
                (totalInBedTime % 3600000) / 60000,
              )} minutes`}
            </Text>
          </View>
        </View>
      </Card>
    </>
  );
};

const AnimatedProgressChart = Animated.createAnimatedComponent(ProgressChart);

const styles = StyleSheet.create({
  scoreChart: {
    borderRadius: 100,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  scoreChartContainer: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreInfoContainer: {
    width: '45%',
    justifyContent: 'center',
  },
  scoreSpacer: {
    width: '10%',
  },
  scoreInfoTitle: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900',
    color: '#D2D5D9',
  },
  scoreInfoText: {
    fontSize: 30,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900',
    color: '#D2D5D9',
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#D2D5D9',
  },
});

export default React.memo(ScoreSection);
