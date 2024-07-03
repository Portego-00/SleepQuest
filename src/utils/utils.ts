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
  AWAKE = 'AWAKE',
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

export const getAllSleepDataForDay = (
  dateObject: DateObject,
  processedSleepData: ProcessedSleepData,
) => {
  const deepSleepData = getSleepDataForDay(
    dateObject,
    SleepType.DEEP,
    processedSleepData,
  );
  const remSleepData = getSleepDataForDay(
    dateObject,
    SleepType.REM,
    processedSleepData,
  );
  const coreSleepData = getSleepDataForDay(
    dateObject,
    SleepType.CORE,
    processedSleepData,
  );
  const inBedData = getSleepDataForDay(
    dateObject,
    SleepType.INBED,
    processedSleepData,
  );
  const awakeData = getSleepDataForDay(
    dateObject,
    SleepType.AWAKE,
    processedSleepData,
  );

  return {deepSleepData, remSleepData, coreSleepData, inBedData, awakeData};
};

const SLEEP_EFFICIENCY_SCORE_VALUE = 0.2; // 30%
const SLEEP_TIME_SCORE_VALUE = 0.4; // 40%
const DEEP_SLEEP_SCORE_VALUE = 0.2; // 20%
const REM_SLEEP_SCORE_VALUE = 0.1; // 10%
const CONSISTENCY_SCORE_VALUE = 0.1; // 10%

export const calculateScore = (
  processedSleepData: ProcessedSleepData,
  date: DateObject,
): number => {
  let score = 0;
  console.log('Calculating score for date:', date.date.toDateString());
  const sleepEfficiency = calculateSleepEfficiency(processedSleepData, date);
  // Sleep efficiency score (50% is 0 points and 100% is 1 point)
  let sleepEfficiencyScore = 0;
  if (sleepEfficiency < 0.5) {
    sleepEfficiencyScore = 0;
  } else if (sleepEfficiency >= 0.5 && sleepEfficiency < 1) {
    sleepEfficiencyScore = (sleepEfficiency - 0.5) / 0.5;
  }
  score += sleepEfficiencyScore * SLEEP_EFFICIENCY_SCORE_VALUE;

  const totalSleepTime = calculateTotalSleepTime(processedSleepData, date);

  if (totalSleepTime === 0) return 0;

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

  const deepSleepTime = calculateDeepSleepTime(processedSleepData, date);
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

  const remSleepTime = calculateRemSleepTime(processedSleepData, date);
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

  // Consistency score
  const consistencyScore = calculateBedtimeConsistency(
    processedSleepData,
    date,
  );
  score += consistencyScore * CONSISTENCY_SCORE_VALUE;

  return Math.min(score, 1000);
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
    return calculateScore(processedSleepData, date);
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

export const calculateSleepEfficiency = (
  processedSleepData: ProcessedSleepData,
  currentDate: DateObject,
): number => {
  const {deepSleepData, remSleepData, coreSleepData, inBedData, awakeData} =
    getAllSleepDataForDay(currentDate, processedSleepData);

  const deepSleepTime = calculateTotalTime(deepSleepData);
  const remSleepTime = calculateTotalTime(remSleepData);
  const coreSleepTime = calculateTotalTime(coreSleepData);
  const inBedTime = calculateTotalTime(inBedData);
  const awakeTime = calculateTotalTime(awakeData);

  if (inBedTime === 0) return 0;

  const totalSleepTime = deepSleepTime + remSleepTime + coreSleepTime;
  const sleepEfficiency = totalSleepTime / (inBedTime + awakeTime);

  return sleepEfficiency;
};

const calculateTotalSleepTime = (
  processedSleepData: ProcessedSleepData,
  currentDate: DateObject,
): number => {
  const {deepSleepData, remSleepData, coreSleepData} = getAllSleepDataForDay(
    currentDate,
    processedSleepData,
  );

  const deepSleepTime = calculateTotalTime(deepSleepData);
  const remSleepTime = calculateTotalTime(remSleepData);
  const coreSleepTime = calculateTotalTime(coreSleepData);

  return deepSleepTime + remSleepTime + coreSleepTime;
};

const calculateDeepSleepTime = (
  processedSleepData: ProcessedSleepData,
  currentDate: DateObject,
): number => {
  const {deepSleepData} = getAllSleepDataForDay(
    currentDate,
    processedSleepData,
  );

  return calculateTotalTime(deepSleepData);
};

const calculateRemSleepTime = (
  processedSleepData: ProcessedSleepData,
  currentDate: DateObject,
): number => {
  const {remSleepData} = getAllSleepDataForDay(currentDate, processedSleepData);

  return calculateTotalTime(remSleepData);
};

export const calculateBedtimeConsistency = (
  processedSleepData: ProcessedSleepData,
  currentDate: DateObject,
): number => {
  const pastSixDays: DateObject[] = [];
  for (let i = 1; i <= 6; i++) {
    const date = new Date(currentDate.date);
    date.setDate(date.getDate() - i);
    pastSixDays.push({
      day: date.toLocaleString('en-us', {weekday: 'short'}),
      date,
    });
  }

  const bedtimes: number[] = pastSixDays.map(date => {
    const sleepData = getSleepDataForDay(
      date,
      SleepType.CORE,
      processedSleepData,
    );
    if (sleepData.length > 0) {
      const firstInterval = sleepData[0];
      return new Date(firstInterval.start).getTime();
    }
    return 0;
  });

  if (bedtimes.length !== 6) {
    return 0;
  }

  const currentBedtime: number[] = getSleepDataForDay(
    currentDate,
    SleepType.CORE,
    processedSleepData,
  ).map(interval => new Date(interval.start).getTime());

  if (!currentBedtime.length) return 0;

  const normalizedBedTimes = bedtimes.map(bedtime => bedtime % 86400000);

  const avgBedtime =
    normalizedBedTimes.reduce((sum, bedtime) => sum + bedtime, 0) /
    normalizedBedTimes.length;

  const currentBedtimeTime = currentBedtime[0];
  const normalizedCurrentBedtime = currentBedtimeTime % 86400000;

  const difference = Math.abs(normalizedCurrentBedtime - avgBedtime);

  // Considering 1 hour (3600000 ms) difference as 0 consistency and same time as 1
  const consistency = 1 - Math.min(difference / 3600000, 1);

  return consistency;
};
