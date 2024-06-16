import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {ScrollView, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {Colors, Header} from 'react-native/Libraries/NewAppScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

import AppleHealthKit, {HealthValue} from 'react-native-health';

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.SleepAnalysis],
    write: [],
  },
};

type SectionProps = PropsWithChildren<{
  title: string;
}>;

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

function HomeScreen(): React.JSX.Element {
  const [sleepData, setSleepData] = useState<HealthValue[]>([]);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  useEffect(() => {
    // Request permissions on component mount
    AppleHealthKit.initHealthKit(permissions, err => {
      if (err) {
        console.log('error initializing Healthkit: ', err);
        return;
      }

      // Fetch sleep data for the past week
      const options = {
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        endDate: new Date().toISOString(),
      };

      AppleHealthKit.getSleepSamples(options, (err, results) => {
        if (err) {
          console.log('error fetching sleep data: ', err);
          return;
        }
        setSleepData(results);
        console.log('Sleep data: ', results);
      });
    });
  }, []);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={backgroundStyle}>
      <Header />
      <View style={{backgroundColor: isDarkMode ? Colors.black : Colors.white}}>
        <Section title="Sleep Data">
          {sleepData.length === 0 ? (
            <Text>No sleep data available.</Text>
          ) : (
            sleepData.map((data, index) => (
              <View key={index} style={styles.dataContainer}>
                <Text style={{color: 'white'}}>
                  Start: {new Date(data.startDate).toLocaleString()}
                </Text>
                <Text style={{color: 'white'}}>
                  End: {new Date(data.endDate).toLocaleString()}
                </Text>
                <Text style={{color: 'white'}}>Value: {data.value}</Text>
              </View>
            ))
          )}
        </Section>
      </View>
    </ScrollView>
  );
}

function SettingsScreen(): React.JSX.Element {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Settings Screen</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveBackgroundColor: Colors.darker,
            tabBarInactiveBackgroundColor: Colors.darker,
            tabBarStyle: {
              backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
            },
          }}>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Analytics" component={AnalyticsScreen} />
          <Tab.Screen name="Profile" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

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
    marginTop: 16,
  },
});

export default App;
