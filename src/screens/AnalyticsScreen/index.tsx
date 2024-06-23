import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Background from '../../components/Background';
import WeekDays from './components/WeekDays/WeekDays';
import ScoreSection from './components/ScoreSection/ScoreSection';
import {ProcessedSleepData} from '../../utils/types';
import {SleepType, getSleepDataForDay} from '../../utils/utils';

const generateDateRange = (days: number) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push({day: date.toLocaleString('en-us', {weekday: 'short'}), date});
  }
  return dates;
};

type AnalyticsScreenProps = {
  processedSleepData: ProcessedSleepData;
};

const AnalyticsScreen = ({processedSleepData}: AnalyticsScreenProps) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(
    new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      {weekday: 'short'},
    ),
  );

  const [dateRange, setDateRange] = useState(generateDateRange(7));

  useEffect(() => {
    setDateRange(generateDateRange(7));
  }, []);

  const deepSleepForSelectedDay = selectedDay
    ? getSleepDataForDay(selectedDay, SleepType.DEEP, processedSleepData)
    : [];

  const remSleepForSelectedDay = selectedDay
    ? getSleepDataForDay(selectedDay, SleepType.REM, processedSleepData)
    : [];

  const coreSleepForSelectedDay = selectedDay
    ? getSleepDataForDay(selectedDay, SleepType.CORE, processedSleepData)
    : [];

  const inBedForSelectedDay = selectedDay
    ? getSleepDataForDay(selectedDay, SleepType.INBED, processedSleepData)
    : [];

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
  };

  return (
    <Background>
      <View style={styles.container}>
        <WeekDays
          days={dateRange}
          onChangeDay={handleDayChange}
          sleepData={processedSleepData}
        />
        <ScrollView
          style={styles.pageScrollView}
          showsVerticalScrollIndicator={false}>
          <ScoreSection
            deepSleepData={deepSleepForSelectedDay}
            remSleepData={remSleepForSelectedDay}
            coreSleepData={coreSleepForSelectedDay}
            inBedData={inBedForSelectedDay}
          />
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
