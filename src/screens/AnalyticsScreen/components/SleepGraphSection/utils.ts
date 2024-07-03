import {
  DateObject,
  ProcessedSleepData,
  SleepInterval,
} from '../../../../utils/types';
import {
  SleepType,
  getAllSleepDataForDay,
  getSleepDataForDay,
} from '../../../../utils/utils';

export const generateLabels = (data: ProcessedSleepData, day: DateObject) => {
  const labels: string[] = [];
  const inBedData = getSleepDataForDay(day, SleepType.INBED, data);

  if (!inBedData || inBedData.length === 0) {
    return labels;
  }

  const startHour = new Date(inBedData[0].start).getHours();
  const endHour = new Date(inBedData[inBedData.length - 1].end).getHours() + 1;

  const convertTo12HourFormat = (hour: number) => {
    const adjustedHour = hour % 12;
    return adjustedHour === 0 ? 12 : adjustedHour;
  };

  if (startHour < endHour) {
    for (let i = startHour; i < endHour; i++) {
      labels.push(convertTo12HourFormat(i).toString());
    }
  } else {
    for (let i = startHour; i < 24; i++) {
      labels.push(convertTo12HourFormat(i).toString());
    }
    for (let i = 0; i < endHour; i++) {
      labels.push(convertTo12HourFormat(i).toString());
    }
  }

  return labels;
};

const SLEEP_TYPE_VALUES: Record<SleepType, number> = {
  [SleepType.INBED]: 3,
  [SleepType.AWAKE]: 3,
  [SleepType.CORE]: 2,
  [SleepType.REM]: 1,
  [SleepType.DEEP]: 0,
};

const getSleepStateValue = (
  timestamp: Date,
  deepSleepData: SleepInterval[],
  remSleepData: SleepInterval[],
  coreSleepData: SleepInterval[],
  inBedData: SleepInterval[],
  awakeData: SleepInterval[],
) => {
  // Check what type of sleep the timestamp falls under
  const isCoreSleep = coreSleepData.some(
    interval =>
      timestamp >= new Date(interval.start) &&
      timestamp < new Date(interval.end),
  );
  if (isCoreSleep) {
    return SLEEP_TYPE_VALUES[SleepType.CORE];
  }
  const isRemSleep = remSleepData.some(
    interval =>
      timestamp >= new Date(interval.start) &&
      timestamp < new Date(interval.end),
  );
  if (isRemSleep) {
    return SLEEP_TYPE_VALUES[SleepType.REM];
  }
  const isAwake = awakeData.some(
    interval =>
      timestamp >= new Date(interval.start) &&
      timestamp < new Date(interval.end),
  );
  if (isAwake) {
    return SLEEP_TYPE_VALUES[SleepType.AWAKE];
  }
  const isDeepSleep = deepSleepData.some(
    interval =>
      timestamp >= new Date(interval.start) &&
      timestamp < new Date(interval.end),
  );
  if (isDeepSleep) {
    return SLEEP_TYPE_VALUES[SleepType.DEEP];
  }
  const isInBed = inBedData.some(
    interval =>
      timestamp >= new Date(interval.start) &&
      timestamp < new Date(interval.end),
  );
  if (isInBed) {
    return SLEEP_TYPE_VALUES[SleepType.INBED];
  }
  return SLEEP_TYPE_VALUES[SleepType.INBED];
};

export const generateSleepStateData = (
  data: ProcessedSleepData,
  day: DateObject,
) => {
  const sleepStateData: number[] = [];
  const {deepSleepData, remSleepData, coreSleepData, inBedData, awakeData} =
    getAllSleepDataForDay(day, data);

  if (!inBedData || inBedData.length === 0) {
    return sleepStateData;
  }

  const startTime = new Date(inBedData[0].start);
  const endTime = new Date(inBedData[inBedData.length - 1].end);
  endTime.setHours(endTime.getHours() + 1);

  for (
    let time = startTime;
    time <= endTime;
    time.setMinutes(time.getMinutes() + 5)
  ) {
    sleepStateData.push(
      getSleepStateValue(
        new Date(time),
        deepSleepData,
        remSleepData,
        coreSleepData,
        inBedData,
        awakeData,
      ),
    );
  }

  return sleepStateData;
};
