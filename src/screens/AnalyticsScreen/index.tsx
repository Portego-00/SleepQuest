import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Background from '../../components/Background';
import WeekDays from './components/WeekDays/WeekDays';
import ScoreSection from './components/ScoreSection/ScoreSection';
import {DateObject, ProcessedSleepData} from '../../utils/types';
import {generateDateRange} from '../../utils/utils';

type AnalyticsScreenProps = {
  processedSleepData: ProcessedSleepData;
};

const AnalyticsScreen = ({processedSleepData}: AnalyticsScreenProps) => {
  const [selectedDay, setSelectedDay] = useState<DateObject>({
    day: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      {weekday: 'short'},
    ),
    date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  });

  const dateRange = generateDateRange(30, new Date());

  const handleDayChange = (day: DateObject) => {
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
            day={selectedDay}
            processedSleepData={processedSleepData}
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
