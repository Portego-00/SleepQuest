import React, {useEffect, useState} from 'react';
import {Text, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppleHealthKit, {HealthValue} from 'react-native-health';
import {ProcessedHeartRateData, ProcessedSleepData} from './src/utils/types';
import {
  getProcessedHeartRateData,
  getProcessedSleepData,
} from './src/utils/utils';
import HomeScreen from './src/screens/HomeScreen';
import Background from './src/components/Background';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.SleepAnalysis,
      AppleHealthKit.Constants.Permissions.HeartRate,
    ],
    write: [],
  },
};

function SettingsScreen(): React.JSX.Element {
  return (
    <Background>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text
          style={{fontFamily: 'Nuunito-Bold', fontSize: 24, color: '#B0B3B8'}}>
          Profile Screen
        </Text>
      </View>
    </Background>
  );
}
const HomeTabScreen = ({sleepData}: {sleepData: HealthValue[]}) => (
  <HomeScreen sleepData={sleepData} />
);
const AnalyticsTabScreen = ({
  processedSleepData,
  processedHeartRateData,
}: {
  processedSleepData: ProcessedSleepData;
  processedHeartRateData: ProcessedHeartRateData;
}) => (
  <AnalyticsScreen
    processedSleepData={processedSleepData}
    processedHeartRateData={processedHeartRateData}
  />
);

const LeaderboardTabScreen = ({
  processedSleepData,
}: {
  processedSleepData: ProcessedSleepData;
}) => <LeaderboardScreen processedSleepData={processedSleepData} />;

const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const [sleepData, setSleepData] = useState<HealthValue[]>([]);
  const [heartRateData, setHeartRateData] = useState<HealthValue[]>([]);
  const [processedSleepData, setProcessedSleepData] =
    useState<ProcessedSleepData>({});
  const [processedHeartRateData, setProcessedHeartRateData] =
    useState<ProcessedHeartRateData>({});
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#020812' : Colors.lighter,
    flex: 1,
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
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        endDate: new Date().toISOString(),
      };

      AppleHealthKit.getSleepSamples(options, (getSamplesError, results) => {
        if (err) {
          console.log('error fetching sleep data: ', getSamplesError);
          return;
        }
        setSleepData(results);
        setProcessedSleepData(getProcessedSleepData(results));
      });

      AppleHealthKit.getHeartRateSamples(
        options,
        (getSamplesError, results) => {
          if (err) {
            console.log('error fetching heart rate data: ', getSamplesError);
            return;
          }
          setHeartRateData(results);
          setProcessedHeartRateData(getProcessedHeartRateData(results));
        },
      );
    });
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            headerShown: false,
            tabBarActiveBackgroundColor: '#020812',
            tabBarInactiveBackgroundColor: '#020812',
            tabBarStyle: {
              backgroundColor: isDarkMode ? '#020812' : Colors.lighter,
              height: 90,
            },
            tabBarActiveTintColor: 'white',
            tabBarLabelStyle: {
              fontSize: 13,
              fontWeight: '600',
              fontFamily: 'Nunito-Bold',
            },
            tabBarIcon: ({focused, color, size}) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Analytics') {
                iconName = focused ? 'analytics' : 'analytics-outline';
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
              } else if (route.name === 'Leaderboard') {
                iconName = focused ? 'trophy' : 'trophy-outline';
              }
              return (
                <Ionicons name={iconName || ''} size={size} color={color} />
              );
            },
          })}>
          <Tab.Screen name="Home">
            {props => <HomeTabScreen {...props} sleepData={sleepData} />}
          </Tab.Screen>
          <Tab.Screen name="Analytics">
            {props => (
              <AnalyticsTabScreen
                {...props}
                processedSleepData={processedSleepData}
                processedHeartRateData={processedHeartRateData}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Leaderboard">
            {props => (
              <LeaderboardTabScreen
                {...props}
                processedSleepData={processedSleepData}
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Profile" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App;
