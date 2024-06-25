import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';

type TopButtonProps = {
  text: string;
  onPress: () => void;
  isSelected: boolean;
};

const TopButton = ({text, onPress, isSelected}: TopButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{text}</Text>
      {isSelected && <View style={styles.selectedLine} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Nunito-Bold',
    color: '#D2D5D9',
    fontSize: 16,
  },
  selectedLine: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#699BF7',
    alignSelf: 'center',
  },
});

export default TopButton;
