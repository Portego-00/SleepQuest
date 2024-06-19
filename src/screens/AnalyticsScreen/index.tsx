import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import Card from '../../components/Card';
import {View, StyleSheet, Text} from 'react-native';
import {ProgressChart} from 'react-native-chart-kit';
import {calculateScoreColor} from './utils';
import Background from '../../components/Background';
import WeekDays from './components/WeekDays/WeekDays';

const days = [
  {day: 'Mon', score: 0.82},
  {day: 'Tue', score: 0.634},
  {day: 'Wed', score: 0.744},
  {day: 'Thu', score: 0.912},
  {day: 'Fri', score: 0.589},
  {day: 'Sat', score: 0.425},
  {day: 'Sun', score: 0.656},
];

const AnalyticsScreen = () => {
  const currentDate = new Date();
  const currentDay = currentDate.toLocaleDateString('en-US', {
    weekday: 'short',
  });
  const initialScore = days.find(day => day.day === currentDay)?.score || 0;

  const [score, setScore] = useState(initialScore);
  const [dayScore, setDayScore] = useState(initialScore);
  const [prevDayScore, setPrevDayScore] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();

    const updateScore = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        setScore(dayScore);
      } else {
        const progress = elapsedTime / duration;
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        const newScore =
          prevDayScore + easedProgress * (dayScore - prevDayScore);
        setScore(newScore);
        requestAnimationFrame(updateScore);
      }
    };

    requestAnimationFrame(updateScore);
  }, [dayScore, prevDayScore]);

  const scoreColor = calculateScoreColor(score);

  const handleDayChange = (day: string) => {
    const selectedDay = days.find(d => d.day === day);
    if (selectedDay) {
      setPrevDayScore(score);
      setDayScore(selectedDay.score);
    }
  };

  return (
    <Background>
      <View style={styles.container}>
        <WeekDays days={days} onChangeDay={handleDayChange} />
        <Header title="Score" />
        <Card>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreChartContainer}>
              <ProgressChart
                data={{
                  data: [score],
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
                  color: (opacity = 1) => calculateScoreColor(score, opacity),
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
                {Math.round(score * 1000)}
              </Text>
            </View>
          </View>
        </Card>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
  },
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
});

export default AnalyticsScreen;
