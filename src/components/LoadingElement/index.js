import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useContextProvider } from '../../context/AuthContext'; 
import { azulPrincipal } from '../../colors';
import styles from './styles';

const Loading = () => {
  const { loading } = useContextProvider();

  if (!loading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={azulPrincipal} />
    </View>
  );
};

export default Loading;
