import React, {useEffect, useRef, useState, useCallback} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import DayChart from './DayChart';
import {DateObject} from '../../../../utils/types';

type WeekDaysProps = {
  days: DateObject[];
  onChangeDay: (day: DateObject) => void;
  scores: {dateObj: DateObject; score: number}[];
};

const WeekDays = ({days, onChangeDay, scores}: WeekDaysProps) => {
  const [selectedDay, setSelectedDay] = useState<DateObject>({
    day: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      {weekday: 'short'},
    ),
    date: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
  });
  const scrollViewRef = useRef<ScrollView>(null);

  const handleDayPress = useCallback(
    (day: DateObject) => {
      setSelectedDay(day);
      onChangeDay(day);
    },
    [onChangeDay],
  );

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: false});
    }
  }, []);

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}>
        <View style={styles.container}>
          {days.map(dayObj => {
            const scoreObj = scores.find(
              score =>
                score.dateObj.date.toDateString() ===
                dayObj.date.toDateString(),
            );
            const score = scoreObj ? scoreObj.score : 0;

            return (
              <DayChart
                key={dayObj.date.toString()}
                day={dayObj.day}
                date={dayObj.date}
                isSelected={
                  selectedDay.date.toDateString() === dayObj.date.toDateString()
                }
                onPress={handleDayPress}
                score={score}
              />
            );
          })}
        </View>
      </ScrollView>
      <View style={styles.separationLine} />
    </>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  separationLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#D2D5D9',
    opacity: 0.5,
  },
});

export default React.memo(WeekDays);
