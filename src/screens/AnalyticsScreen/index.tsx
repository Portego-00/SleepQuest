import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Background from '../../components/Background';
import WeekDays from './components/WeekDays/WeekDays';
import ScoreSection from './components/ScoreSection/ScoreSection';
import { ProcessedSleepData } from '../../utils/types';

const days = [
  {day: 'Mon', score: 0.82},
  {day: 'Tue', score: 0.634},
  {day: 'Wed', score: 0.744},
  {day: 'Thu', score: 0.912},
  {day: 'Fri', score: 0.589},
  {day: 'Sat', score: 0.425},
  {day: 'Sun', score: 0.656},
];

type AnalyticsScreenProps = {
  processedSleepData: ProcessedSleepData;
};

const AnalyticsScreen = ({processedSleepData}: AnalyticsScreenProps) => {
  const [selecteqDay, setSelectedDay] = useState<string | null>(
    new Date().toLocaleString('en-us', {weekday: 'short'}),
  );

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <Background>
      <View style={styles.container}>
        <WeekDays days={days} onChangeDay={handleDayChange} />
        <ScrollView
          style={styles.pageScrollView}
          showsVerticalScrollIndicator={false}>
          <ScoreSection selectedDay={selecteqDay} />
          <ScoreSection selectedDay={selecteqDay} />
          <ScoreSection selectedDay={selecteqDay} />
          <ScoreSection selectedDay={selecteqDay} />
          <ScoreSection selectedDay={selecteqDay} />
          <ScoreSection selectedDay={selecteqDay} />
          <View style={styles.bottomSpacer} />
        </ScrollView>
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
  pageScrollView: {
    height: '100%',
    paddingTop: 20,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default AnalyticsScreen;
