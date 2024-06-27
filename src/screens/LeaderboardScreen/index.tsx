import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Text, Image} from 'react-native';
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
    .map((name, index) => ({
      name,
      score: randomScores[index],
    }))
    .concat({
      name: 'You',
      score: totalWeekScore,
    })
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
        <View style={styles.podiumContainer}>
          <View style={styles.secondPlace}>
            <Image
              source={{uri: sortedScores[1].picture}}
              style={styles.firstImageContainer}
            />
            <Text style={styles.podiumNameStyle}>{sortedScores[1].name}</Text>
            <Text style={styles.podiumScoreStyle}>
              {Math.round(sortedScores[1].score)}
            </Text>
          </View>
          <View style={styles.firstPlace}>
            <Image
              source={{uri: sortedScores[0].picture}}
              style={styles.firstImageContainer}
            />
            <Text style={styles.podiumNameStyle}>{sortedScores[0].name}</Text>
            <Text style={styles.podiumScoreStyle}>
              {Math.round(sortedScores[0].score)}
            </Text>
          </View>
          <View style={styles.thirdPlace}>
            <Image
              source={{uri: sortedScores[2].picture}}
              style={styles.thirdImageContainer}
            />
            <Text style={styles.podiumNameStyle}>{sortedScores[2].name}</Text>
            <Text style={styles.podiumScoreStyle}>
              {Math.round(sortedScores[2].score)}
            </Text>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {sortedScores.slice(3).map((user, index) => (
            <ScoreSlate
              key={index}
              username={user.name}
              score={user.score}
              position={index + 4}
              profilePicture={user.picture}
            />
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
  podiumContainer: {
    alignItems: 'center',
    marginVertical: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  secondPlace: {
    justifyContent: 'center',
    backgroundColor: '#22263C',
    borderRadius: 8,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '30%',
    height: 105,
    marginTop: 45,
  },
  firstPlace: {
    justifyContent: 'center',
    backgroundColor: '#252A40',
    borderRadius: 8,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '30%',
    height: 125,
    marginTop: 25,
  },
  thirdPlace: {
    justifyContent: 'center',
    backgroundColor: '#1E2237',
    borderRadius: 8,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '30%',
    height: 85,
    marginTop: 65,
  },
  bottomSpacer: {
    height: 250,
  },
  podiumNameStyle: {
    color: '#D2D5D9',
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900',
    textAlign: 'center',
  },
  podiumScoreStyle: {
    color: '#D2D5D9',
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900',
    textAlign: 'center',
  },
  firstImageContainer: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D2D5D9',
    alignSelf: 'center',
    top: -40,
  },
  secondImageContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#D2D5D9',
    alignSelf: 'center',
    top: -35,
  },
  thirdImageContainer: {
    position: 'absolute',
    width: 45,
    height: 45,
    borderRadius: 25,
    backgroundColor: '#D2D5D9',
    alignSelf: 'center',
    top: -30,
  },
});

export default LeaderboardScreen;
