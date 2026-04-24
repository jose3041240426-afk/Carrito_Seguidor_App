import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Video } from 'expo-av';
import FadeInView from '../components/FadeInView';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/fondo.mp4')}
        style={styles.backgroundVideo}
        resizeMode="cover"
        isLooping
        shouldPlay
        isMuted
      />
      <View style={styles.overlay} />
      
      <View style={styles.contentContainer}>
        <FadeInView delay={100}>
          <Image source={require('../../assets/utd.webp')} style={styles.logo} />
        </FadeInView>
        <FadeInView delay={300}>
          <Text style={styles.title}>Guía Carrito seguidor de línea</Text>
        </FadeInView>
        
        <FadeInView delay={500}>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Text style={styles.buttonText}>Ver el proceso</Text>
          </TouchableOpacity>
        </FadeInView>
      </View>
      
      <FadeInView delay={700} style={styles.integrantesContainer}>
        <Text style={styles.teamNameHome}>Equipo Dinastía</Text>
        <Text style={styles.integrantesTitle}>Miembros del equipo:</Text>
        <Text style={styles.integrantes}>
          Guerrero Simental José Manuel{'\n'}
          Castillo Diaz Humberto{'\n'}
          Hernandez Tavizón Josué Joán{'\n'}
          Mathey Ortiz Manuel Alejandro
        </Text>
      </FadeInView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 150,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    marginTop: 50,
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  integrantesContainer: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
  },
  teamNameHome: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    textAlign: 'left',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  integrantesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    opacity: 0.9,
  },
  integrantes: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'left',
    lineHeight: 22,
    opacity: 0.8,
  },
});

export default HomeScreen;
