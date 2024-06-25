import React, {ReactNode} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';

type CardProps = {
  children?: ReactNode;
  onPress?: () => void;
};

const Card = ({children, onPress}: CardProps) => {
  return onPress ? (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {children}
    </TouchableOpacity>
  ) : (
    <View style={styles.container}>{children}</View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#252A40',
    borderRadius: 8,
    padding: 16,
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
});

export default Card;
