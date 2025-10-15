import { StyleSheet } from 'react-native';
import { laranjaPrincipal } from '../../colors';

export default StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: laranjaPrincipal,
    },
  });