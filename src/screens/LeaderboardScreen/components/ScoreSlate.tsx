import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type ScoreSlateProps = {
  username: string;
  score: number;
};

const ScoreSlate = ({username, score}: ScoreSlateProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.usernameText}>{username}</Text>
      <Text style={styles.scoreText}>{Math.round(score)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    fontSize: 30,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900',
  },
});

export default ScoreSlate;
