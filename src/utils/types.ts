export interface SleepInterval {
  start: string;
  end: string;
}

export interface ProcessedSleepData {
  [stage: string]: SleepInterval[];
}
