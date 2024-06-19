import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import DayChart from './DayChart';

type WeekDaysProps = {
  days: {day: string; score: number}[];
  onChangeDay: (day: string) => void;
};

const WeekDays = ({days, onChangeDay}: WeekDaysProps) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(
    new Date().toLocaleString('en-us', {weekday: 'short'}),
  );

  const handleDayPress = (day: string) => {
    setSelectedDay(day);
    onChangeDay(day);
  };

  return (
    <View style={styles.container}>
      {days.map(({day, score}) => (
        <DayChart
          key={day}
          day={day}
          score={score}
          isSelected={selectedDay === day}
          onPress={handleDayPress}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default WeekDays;
