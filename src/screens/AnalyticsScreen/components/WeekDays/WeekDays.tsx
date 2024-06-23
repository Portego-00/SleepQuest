import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import DayChart from './DayChart';
import {ProcessedSleepData} from '../../../../utils/types';

type WeekDaysProps = {
  days: {day: string; date: Date}[];
  onChangeDay: (day: string) => void;
  sleepData: ProcessedSleepData;
};

const WeekDays = ({days, onChangeDay, sleepData}: WeekDaysProps) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(
    new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleString(
      'en-us',
      {weekday: 'short'},
    ),
  );

  const handleDayPress = (day: string) => {
    setSelectedDay(day);
    onChangeDay(day);
  };

  return (
    <>
      <View style={styles.container}>
        {days.map(({day, date}) => (
          <DayChart
            key={date.toString()}
            day={day}
            date={date}
            isSelected={selectedDay === day}
            onPress={handleDayPress}
            sleepData={sleepData}
          />
        ))}
      </View>
      <View style={styles.separationLine} />
    </>
  );
};

const styles = StyleSheet.create({
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

export default WeekDays;
