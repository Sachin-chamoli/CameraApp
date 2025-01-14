import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

const Home = () => {
  const Nav = useNavigation<any>()
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

  const swipeFunction = (state : any , direction : string) =>{
    console.log("state" , state , direction)
    if(direction == 'SWIPE_LEFT'){
      Nav.navigate('CameraRoll')
    }
  }
  return (
    <GestureRecognizer
    onSwipe={(direction, state) => {swipeFunction(state , direction)}}
    config={config}
    style={{
      flex: 1,
    }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>
        <TouchableOpacity style={styles.button} onPress={() => Nav.navigate('CameraRoll')}>
          <Text style={styles.buttonText}>Go to Camera Roll</Text>
        </TouchableOpacity>
      </View>
     </GestureRecognizer>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  button: { padding: 10, backgroundColor: 'blue', borderRadius: 5 },
  buttonText: { color: 'white' },
});

export default Home;
