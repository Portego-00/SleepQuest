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
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default Header;
