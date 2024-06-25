import {HealthValue} from 'react-native-health';
import {DateObject, ProcessedSleepData, SleepInterval} from './types';

export const mergeIntervals = (intervals: SleepInterval[]): SleepInterval[] => {
  if (intervals.length === 0) {
    return [];
  }

  // Sort intervals by start date
  intervals.sort((a, b) => (a.start < b.start ? -1 : 1));

  const merged: SleepInterval[] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const lastMerged = merged[merged.length - 1];
    const current = intervals[i];

    if (current.start <= lastMerged.end) {
      lastMerged.end =
        lastMerged.end > current.end ? lastMerged.end : current.end;
    } else {
      merged.push(current);
    }
  }

  return merged;
};

export const getProcessedSleepData = (
  sleepData: HealthValue[],
): ProcessedSleepData => {
  const groupedData = sleepData.reduce(
    (acc: ProcessedSleepData, data: HealthValue) => {
      if (!acc[data.value]) {
        acc[data.value] = [];
      }
      acc[data.value].push({start: data.startDate, end: data.endDate});
      return acc;
    },
    {},
  );

  const mergedData: ProcessedSleepData = Object.fromEntries(
    Object.entries(groupedData).map(([key, intervals]) => [
      key,
      mergeIntervals(intervals as SleepInterval[]),
    ]),
  );

  return mergedData;
};

export enum SleepType {
  INBED = 'INBED',
  CORE = 'CORE',
  REM = 'REM',
  DEEP = 'DEEP',
}

export const getSleepDataForDay = (
  dateObject: DateObject,
  type: SleepType,
  processedSleepData: ProcessedSleepData,
): SleepInterval[] => {
  const startOfDay = new Date(dateObject.date);
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

export const calculateTotalTime = (sleepData: SleepInterval[]) => {
  let totalTime = 0;
  if (!sleepData || sleepData.length === 0) return totalTime;
  sleepData.forEach(data => {
    const start = new Date(data.start);
    const end = new Date(data.end);
    const duration = end.getTime() - start.getTime();
    totalTime += duration;
  });
  return totalTime;
};

const SLEEP_EFFICIENCY_SCORE_VALUE = 0.2; // 30%
const SLEEP_TIME_SCORE_VALUE = 0.4; // 40%
const DEEP_SLEEP_SCORE_VALUE = 0.2; // 20%
const REM_SLEEP_SCORE_VALUE = 0.1; // 10%

export const calculateScore = (
  deepSleepTime: number,
  remSleepTime: number,
  coreSleepTime: number,
  inBedTime: number,
): number => {
  if (inBedTime === 0) return 0;

  const totalSleepTime = deepSleepTime + remSleepTime + coreSleepTime;
  const sleepEfficiency = totalSleepTime / inBedTime;

  let score = 0;

  // Sleep efficiency score (50% is 0 points and 100% is 1 point)
  let sleepEfficiencyScore = 0;
  if (sleepEfficiency < 0.5) {
    sleepEfficiencyScore = 0;
  } else if (sleepEfficiency >= 0.5 && sleepEfficiency < 1) {
    sleepEfficiencyScore = (sleepEfficiency - 0.5) / 0.5;
  }
  score += sleepEfficiencyScore * SLEEP_EFFICIENCY_SCORE_VALUE;

  // Sleep time score (4 hours is 0 points and 8 hours, or anything above is 1 point)
  let sleepTimeScore = 0;
  if (totalSleepTime < 4 * 3600000) {
    sleepTimeScore = 0;
  } else if (totalSleepTime >= 4 * 3600000 && totalSleepTime < 8 * 3600000) {
    sleepTimeScore = (totalSleepTime - 4 * 3600000) / (4 * 3600000);
  } else {
    sleepTimeScore = 1;
  }

  score += sleepTimeScore * SLEEP_TIME_SCORE_VALUE;

  // Deep sleep score (30 minutes is 0 points and 90 minutes, or anything above is 1 point)
  let deepSleepScore = 0;
  if (deepSleepTime < 0.25 * 3600000) {
    deepSleepScore = 0;
  } else if (
    deepSleepTime >= 0.25 * 3600000 &&
    deepSleepTime < 1.25 * 3600000
  ) {
    deepSleepScore = (deepSleepTime - 0.5 * 3600000) / 3600000;
  } else {
    deepSleepScore = 1;
  }

  score += deepSleepScore * DEEP_SLEEP_SCORE_VALUE;

  // REM sleep score (45 minutes is 0 points and 105 minutes, or anything above is 1 point)
  let remSleepScore = 0;

  if (remSleepTime < 0.75 * 3600000) {
    remSleepScore = 0;
  } else if (remSleepTime >= 0.75 * 3600000 && remSleepTime < 1.75 * 3600000) {
    remSleepScore = (remSleepTime - 0.75 * 3600000) / 3600000;
  } else {
    remSleepScore = 1;
  }

  score += remSleepScore * REM_SLEEP_SCORE_VALUE;

  return score;
};

export const generateDateRange = (days: number, startDate: Date) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(startDate);
    date.setDate(date.getDate() - i - 1);
    dates.push({
      day: date.toLocaleString('en-us', {weekday: 'short'}),
      date,
    });
  }
  return dates;
};

export const generateCurrentWeekDays = (currentDay: Date): DateObject[] => {
  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const dayOfWeek = currentDay.getDay();
  const startOfWeek = new Date(currentDay);
  const distanceToMonday = (dayOfWeek + 6) % 7;
  startOfWeek.setDate(currentDay.getDate() - distanceToMonday);

  const weekDays: DateObject[] = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push({
      day: addDays(startOfWeek, i).toLocaleString('en-us', {weekday: 'short'}),
      date: addDays(startOfWeek, i),
    });
  }

  return weekDays;
};

export const calculateScoreForTimeRange = (
  dateRange: DateObject[],
  processedSleepData: ProcessedSleepData,
): number[] => {
  return dateRange.map(date => {
    const deepSleepData = getSleepDataForDay(
      date,
      SleepType.DEEP,
      processedSleepData,
    );
    const remSleepData = getSleepDataForDay(
      date,
      SleepType.REM,
      processedSleepData,
    );
    const coreSleepData = getSleepDataForDay(
      date,
      SleepType.CORE,
      processedSleepData,
    );
    const inBedData = getSleepDataForDay(
      date,
      SleepType.INBED,
      processedSleepData,
    );

    const deepSleepTime = calculateTotalTime(deepSleepData);
    const remSleepTime = calculateTotalTime(remSleepData);
    const coreSleepTime = calculateTotalTime(coreSleepData);
    const inBedTime = calculateTotalTime(inBedData);

    return calculateScore(
      deepSleepTime,
      remSleepTime,
      coreSleepTime,
      inBedTime,
    );
  });
};

export const calculateDaysCompleted = (currentDay: Date) => {
  const dayOfWeek = currentDay.getDay();
  const adjustedDayOfWeek = (dayOfWeek + 6) % 7;

  return adjustedDayOfWeek;
};

export const generateRandomNamesAndScores = () => {
  const currentDay = new Date(new Date().getTime());
  const daysCompleted = calculateDaysCompleted(currentDay);
  const randomNames = Array.from({length: 20}, (_, i) => `User ${i + 1}`);
  const randomScores = randomNames.map(
    () => Math.floor(Math.random() * 1000) * daysCompleted,
  );

  return {randomNames, randomScores};
};
