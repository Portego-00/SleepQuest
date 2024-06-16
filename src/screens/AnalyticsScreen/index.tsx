import React from 'react';
import Header from '../../components/Header';
import Card from '../../components/Card';
import {View, StyleSheet} from 'react-native';

const AnalyticsScreen = () => {
  return (
    <View style={styles.backgroundStyle}>
      <Header title="Hello" />
      <Card title="Hello"></Card>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    padding: 20,
    backgroundColor: '#1F3B4D',
    flex: 1,
    paddingTop: 80,
  },
});

export default AnalyticsScreen;
