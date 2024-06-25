import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Background from '../../components/Background';
import {ProcessedSleepData} from '../../utils/types';
import TopButton from './components/TopButton';
import {
  calculateScoreForTimeRange,
  generateCurrentWeekDays,
  generateRandomNamesAndScores,
} from '../../utils/utils';
import ScoreSlate from './components/ScoreSlate';

type LeaderboardScreenProps = {
  processedSleepData: ProcessedSleepData;
};

const LeaderboardScreen = ({processedSleepData}: LeaderboardScreenProps) => {
  const [selectedTab, setSelectedTab] = useState('league');

  const dateRange = generateCurrentWeekDays(new Date());

  const weekScores = calculateScoreForTimeRange(dateRange, processedSleepData);
  const totalWeekScore = weekScores.reduce(
    (acc, score) => acc + score * 1000,
    0,
  );

  const {randomNames, randomScores} = generateRandomNamesAndScores();

  const sortedScores = randomNames
    .map((name, index) => ({name, score: randomScores[index]}))
    .concat({name: 'You', score: totalWeekScore})
    .sort((a, b) => b.score - a.score);

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.topButtonsContainer}>
          <View style={styles.buttonContainer}>
            <TopButton
              text="League"
              isSelected={selectedTab === 'league'}
              onPress={() => setSelectedTab('league')}
            />
            <TopButton
              text="Friends"
              isSelected={selectedTab === 'friends'}
              onPress={() => setSelectedTab('friends')}
            />
          </View>
        </View>
        <ScrollView>
          {sortedScores.map((user, index) => (
            <ScoreSlate key={index} username={user.name} score={user.score} />
          ))}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  topButtonsContainer: {
    backgroundColor: '#1E2237',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  bottomSpacer: {
    height: 100,
  },
});

export default LeaderboardScreen;
