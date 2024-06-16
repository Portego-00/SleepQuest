import React from 'react';
import Header from '../../components/Header';
import Card from '../../components/Card';
import {View, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AnalyticsScreen = () => {
  return (
    <LinearGradient
      colors={['#0A1733', '#020812']}
      style={styles.backgroundStyle}>
      <View style={styles.container}>
        <Header title="Hello" />
        <Card title="Hello" />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 80,
  },
});

export default AnalyticsScreen;
