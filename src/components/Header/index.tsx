import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

type HeaderProps = {
  title?: string;
};

const Header = ({title}: HeaderProps) => {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    fontWeight: '900',
    marginBottom: 8,
    color: '#D2D5D9',
  },
});

export default Header;
