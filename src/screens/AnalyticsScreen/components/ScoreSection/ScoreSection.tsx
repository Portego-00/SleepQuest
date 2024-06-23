import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import Card from '../../../../components/Card';
import {ProgressChart} from 'react-native-chart-kit';
import {calculateScoreColor} from '../../utils';
import Header from '../../../../components/Header';
import {SleepInterval} from '../../../../utils/types';
import {calculateScore, calculateTotalTime} from '../../../../utils/utils';

const days = [
  {day: 'Mon', score: 0.82},
  {day: 'Tue', score: 0.634},
  {day: 'Wed', score: 0.744},
  {day: 'Thu', score: 0.912},
  {day: 'Fri', score: 0.589},
  {day: 'Sat', score: 0.425},
  {day: 'Sun', score: 0.656},
];

type CardSectionProps = {
  deepSleepData: SleepInterval[];
  remSleepData: SleepInterval[];
  coreSleepData: SleepInterval[];
  inBedData: SleepInterval[];
};

const CardSection = (props: CardSectionProps) => {
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
  });
  const initialScore = days.find(day => day.day === currentDay)?.score || 0;

  const [dayScore, setDayScore] = useState(initialScore);
  const [currentAnimatedValue, setCurrentAnimatedValue] =
    useState(initialScore);
  const animatedScore = useRef(new Animated.Value(initialScore)).current;

  useEffect(() => {
    const id = animatedScore.addListener(({value}) => {
      setCurrentAnimatedValue(value);
    });

    return () => {
      animatedScore.removeListener(id);
    };
  }, [animatedScore]);

  const totalDeepTime = calculateTotalTime(props.deepSleepData);
  const totalRemTime = calculateTotalTime(props.remSleepData);
  const totalCoreTime = calculateTotalTime(props.coreSleepData);
  const totalInBedTime = calculateTotalTime(props.inBedData);
  const totalSleepTime = totalDeepTime + totalRemTime + totalCoreTime;

  useEffect(() => {
    const newScore = calculateScore(
      totalDeepTime,
      totalRemTime,
      totalCoreTime,
      totalInBedTime,
    );
    setDayScore(newScore);
  }, [totalDeepTime, totalRemTime, totalCoreTime, totalInBedTime]);

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
                backgroundColor: 'transparent',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
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
            <Text style={styles.scoreInfoTitle}>Total Sleep Time</Text>
            <Text style={styles.timeText}>
              {`${Math.floor(totalSleepTime / 3600000)} hours ${Math.floor(
                (totalSleepTime % 3600000) / 60000,
              )} minutes`}
            </Text>
            <Text style={styles.scoreInfoTitle}>Total Time in Bed</Text>
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

export default CardSection;
