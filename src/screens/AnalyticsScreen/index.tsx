import React, {useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Background from '../../components/Background';
import WeekDays from './components/WeekDays/WeekDays';
import ScoreSection from './components/ScoreSection/ScoreSection';
import {
  DateObject,
  ProcessedHeartRateData,
  ProcessedSleepData,
} from '../../utils/types';
import {calculateScore, generateDateRange} from '../../utils/utils';
import SleepGraphSection from './components/SleepGraphSection/SleepGraphSection';
import SleepStagesSection from './components/SleepStagesSection/SleepStagesSection';
import HeartRateSection from './components/HeartRateSection/HeartRateSection';

type AnalyticsScreenProps = {
  processedSleepData: ProcessedSleepData;
  processedHeartRateData: ProcessedHeartRateData;
};

const AnalyticsScreen = ({
  processedSleepData,
  processedHeartRateData,
}: AnalyticsScreenProps) => {
  const [selectedDay, setSelectedDay] = useState<DateObject>({
    day: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      {weekday: 'short'},
    ),
    date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  });

  const dateRange = useMemo(() => generateDateRange(7, new Date()), []);

  const scores = useMemo(() => {
    return dateRange.map(dateObj => {
      const score = calculateScore(processedSleepData, dateObj);
      return {dateObj, score};
    });
  }, [processedSleepData, dateRange]);

  const handleDayChange = (day: DateObject) => {
    setSelectedDay(day);
  };

  return (
    <Background>
      <View style={styles.container}>
        <WeekDays
          days={dateRange}
          onChangeDay={handleDayChange}
          scores={scores}
        />
        <ScrollView
          style={styles.pageScrollView}
          showsVerticalScrollIndicator={false}>
          <ScoreSection
            day={selectedDay}
            processedSleepData={processedSleepData}
          />
          <SleepStagesSection
            day={selectedDay}
            processedSleepData={processedSleepData}
          />
          <SleepGraphSection
            day={selectedDay}
            processedSleepData={processedSleepData}
          />
          <HeartRateSection
            day={selectedDay}
            processedSleepData={processedSleepData}
            processedHeartRateData={processedHeartRateData}
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
    height: 120,
  },
});

export default AnalyticsScreen;
