import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

type ScoreSlateProps = {
  username: string;
  score: number;
  position: number;
  profilePicture: string;
};

const ScoreSlate = ({
  username,
  score,
  position,
  profilePicture,
}: ScoreSlateProps) => {
  const backgroundColor = username === 'You' ? '#32364B' : '#1E2237';

  return (
    <View style={[styles.container, {backgroundColor}]}>
      <View style={styles.positionContainer}>
        <Text style={styles.positionText}>{position}</Text>
      </View>
      <Image
        source={{uri: profilePicture}}
        style={styles.profileImageContainer}
      />
      <View style={styles.usernameContainer}>
        <Text style={styles.usernameText}>{username}</Text>
      </View>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreText}>{Math.round(score)}</Text>
        <Text style={styles.pointsText}> pts</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    height: 80,
    flexDirection: 'row',
    backgroundColor: '#1E2237',
    borderRadius: 8,
    marginBottom: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  usernameText: {
    color: '#D2D5D9',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900',
  },
  scoreText: {
    color: '#D2D5D9',
    fontSize: 20,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900',
  },
  positionContainer: {
    width: '10%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  positionText: {
    color: '#D2D5D9',
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D2D5D9',
    marginRight: 10,
  },
  usernameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsText: {
    color: '#D2D5D9',
    fontSize: 18,
    fontFamily: 'Nunito-Regular',
    fontWeight: '400',
  },
});

export default ScoreSlate;
