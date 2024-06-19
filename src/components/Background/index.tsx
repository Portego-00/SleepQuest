import React from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {StyleSheet} from 'react-native';

type BackgroundProps = {
  children?: React.ReactNode;
};

const Background = ({children}: BackgroundProps) => {
  return (
    <LinearGradient
      colors={['#0A1733', '#020812']}
      style={styles.backgroundStyle}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    flex: 1,
  },
});

export default Background;
