import {HealthValue} from 'react-native-health';
import {ProcessedSleepData, SleepInterval} from './types';

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
