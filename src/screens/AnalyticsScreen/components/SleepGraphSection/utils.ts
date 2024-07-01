import {DateObject, ProcessedSleepData} from '../../../../utils/types';
import {SleepType, getSleepDataForDay} from '../../../../utils/utils';

export const generateLabels = (data: ProcessedSleepData, day: DateObject) => {
  const labels: string[] = [];
  const inBedData = getSleepDataForDay(day, SleepType.INBED, data);

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
