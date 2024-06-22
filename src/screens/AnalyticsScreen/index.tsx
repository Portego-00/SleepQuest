import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Background from '../../components/Background';
import WeekDays from './components/WeekDays/WeekDays';
import ScoreSection from './components/ScoreSection/ScoreSection';
import {ProcessedSleepData, SleepInterval} from '../../utils/types';

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

enum SleepType {
  INBED = 'INBED',
  CORE = 'CORE',
  REM = 'REM',
  DEEP = 'DEEP',
}

const AnalyticsScreen = ({processedSleepData}: AnalyticsScreenProps) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(
    new Date().toLocaleString('en-us', {weekday: 'short'}),
  );

  const getSleepDataForDay = (day: string, type: SleepType) => {
    const dayIndex = days.findIndex(d => d.day === day);
    if (dayIndex === -1) return [];

    const startOfDay = new Date();
    startOfDay.setDate(
      startOfDay.getDate() - (((startOfDay.getDay() + 6) % 7) - dayIndex),
    );
    startOfDay.setHours(17, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);
    endOfDay.setHours(16, 59, 59, 999);

    return processedSleepData[type]?.filter(data => {
      const start = new Date(data.start);
      const end = new Date(data.end);
      return (
        (start >= startOfDay && start <= endOfDay) ||
        (end >= startOfDay && end <= endOfDay)
      );
    });
  };

  const sleepDataForSelectedDay = selectedDay
    ? getSleepDataForDay(selectedDay, SleepType.DEEP)
    : [];

  console.log(sleepDataForSelectedDay);

  const calculateTotalTime = () => {
    let totalTime = 0;
    sleepDataForSelectedDay.forEach(data => {
      const start = new Date(data.start);
      const end = new Date(data.end);
      const duration = end.getTime() - start.getTime();
      totalTime += duration;
    });
    return totalTime;
  };

  const totalTime = calculateTotalTime();
  console.log(
    'Total Time:',
    `${Math.floor(totalTime / 3600000)} hours ${Math.floor(
      (totalTime % 3600000) / 60000,
    )} minutes ${Math.floor((totalTime % 60000) / 1000)} seconds`,
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
          <ScoreSection selectedDay={selectedDay} />
          <ScoreSection selectedDay={selectedDay} />
          <ScoreSection selectedDay={selectedDay} />
          <ScoreSection selectedDay={selectedDay} />
          <ScoreSection selectedDay={selectedDay} />
          <ScoreSection selectedDay={selectedDay} />
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
