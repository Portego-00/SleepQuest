import React, {useEffect, useState} from 'react';
import Header from '../../components/Header';
import Card from '../../components/Card';
import {View, StyleSheet, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ProgressChart} from 'react-native-chart-kit';

const AnalyticsScreen = () => {
  const [score, setScore] = useState(0);
  const targetScore = 0.827;

  useEffect(() => {
    const duration = 1000;
    const startTime = Date.now();
    const updateScore = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      if (elapsedTime >= duration) {
        setScore(targetScore);
      } else {
        const progress = elapsedTime / duration;
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        const newScore = easedProgress * targetScore;
        setScore(newScore);
        requestAnimationFrame(updateScore);
      }
    };
    requestAnimationFrame(updateScore);
  }, []);

  const calculateScoreColor = (score: number, opacity?: number): string => {
    const red = Math.round((1 - score) * 255);
    const green = Math.round(score * 255);
    const blue = 0;
    if (opacity) {
      return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
    }
    return `rgb(${red}, ${green}, ${blue})`;
  };

  const scoreColor = calculateScoreColor(score);

  return (
    <LinearGradient
      colors={['#0A1733', '#020812']}
      style={styles.backgroundStyle}>
      <View style={styles.container}>
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
                  style: {
                    borderRadius: 50,
                  },
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
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
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
