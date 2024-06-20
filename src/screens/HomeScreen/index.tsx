import React from 'react';
import type {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, Text, View, useColorScheme} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {getProcessedSleepData} from '../../utils/utils';
import {SleepInterval} from '../../utils/types';
import {HealthValue} from 'react-native-health';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

type HomeScreenProps = {
  sleepData: HealthValue[];
};

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const AnalyticsScreen = ({sleepData}: HomeScreenProps) => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const formatDate = (date: string): string => {
    const formattedDate = new Date(date).toLocaleTimeString();
    return formattedDate;
  };

  const renderSleepData = () => {
    if (sleepData.length === 0) {
      return <Text>No sleep data available.</Text>;
    }

    const mergedData = getProcessedSleepData(sleepData);

    return (
      <View style={styles.dataContainer}>
        {Object.entries(mergedData).map(([value, intervals]) => (
          <View key={value} style={styles.dataContainer}>
            <Text style={styles.dataText}>{value}</Text>
            {intervals.map((interval: SleepInterval, index: number) => (
              <View key={index} style={styles.dateContainer}>
                <Text style={styles.dateTitle}>
                  {formatDate(interval.start)} - {formatDate(interval.end)}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <Header />
      <View style={{backgroundColor: isDarkMode ? Colors.black : Colors.white}}>
        <Section title="Sleep Data">{renderSleepData()}</Section>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  dataContainer: {
    marginTop: 30,
  },
  dateContainer: {
    marginTop: 10,
  },
  dateTitle: {
    fontSize: 16,
    color: '#D2D5D9',
  },
  dataText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#D2D5D9',
  },
});

export default AnalyticsScreen;
