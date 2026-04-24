import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';
import Typewriter from '../components/Typewriter';
import CircularCarousel from '../components/CircularCarousel';

const COMPONENTS = [
  {
    name: 'Microcontrolador ESP32',
    desc: 'Cerebro del robot que procesa las señales de los sensores y controla los motores.',
    image: { uri: 'https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32/_images/esp32-DevKitM-1-isometric.png' }
  },
  {
    name: 'Puente H L298N',
    desc: 'Módulo que permite controlar el sentido de giro y la velocidad de los motores.',
    image: { uri: 'https://teknomovo.com.mx/wp-content/uploads/2021/06/l298nr__3_.png' }
  },
  {
    name: 'Sensores Infrarrojos',
    desc: 'Detectan el contraste entre el color negro de la línea y el fondo blanco.',
    image: { uri: 'https://mvelectronica.s3.us-east-2.amazonaws.com/productos/SOBS/607f1ac66a595.webp' }
  },
  {
    name: 'Motores Reductores',
    desc: 'Proporcionan el movimiento a las ruedas con el torque necesario.',
    image: { uri: 'https://cdn-reichelt.de/resize/600%2F-/web/xxl_ws/A300%2FCOM_MOTOR_RAD_03.png?type=ProductXxl&resize=600%252F-&' }
  },
  {
    name: 'Portapilas y Baterías',
    desc: 'Fuente de energía para alimentar tanto el ESP32 como los motores.',
    image: require('../../assets/tutorial/portapilas.webp')
  },
  {
    name: 'Chasis de Acrílico',
    desc: 'Estructura física donde se montan todos los componentes.',
    image: { uri: 'https://http2.mlstatic.com/D_NQ_NP_2X_857357-MLA96075134005_102025-F.webp' }
  },
  {
    name: 'Rueda Loca',
    desc: 'Proporciona un tercer punto de apoyo y permite el giro libre del robot.',
    image: { uri: 'https://mktronik.mx/1753-large_default/rueda-loca.jpg' }
  },
  {
    name: 'Ruedas de Tracción',
    desc: 'Neumáticos de goma de alto agarre que transmiten la fuerza de los motores al suelo.',
    image: { uri: 'https://imgs.search.brave.com/nuFuAx2jkNWsfV3JOau2Otp5n8PnJRSzpRXHXFg8ssA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9odHRw/Mi5tbHN0YXRpYy5j/b20vRF9RX05QXzJY/XzczOTg5OC1NTE01/MjI1MDk0NzA1NV8x/MTIwMjItRS53ZWJw' }
  },
];

const ComponentsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typewriter
          words={['Materiales y Componentes']}
          style={styles.headerTitle}
          loop={true}
          speed={80}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <FadeInView delay={0}>
          <Text style={styles.introText}>
            Desliza para explorar los componentes principales utilizados en la construcción del robot seguidor de línea.
          </Text>
        </FadeInView>

        <FadeInView delay={200}>
          <CircularCarousel items={COMPONENTS} />
        </FadeInView>

        <FadeInView delay={400}>
          <TouchableOpacity
            style={[styles.tutorialButton, { marginTop: 20 }]}
            onPress={() => navigation.navigate('Tutorial')}
          >
            <Ionicons name="play-circle" size={24} color="#fff" />
            <Text style={styles.tutorialButtonText}>Ver Paso a Paso</Text>
          </TouchableOpacity>
        </FadeInView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  introText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
    marginTop: 20,
    lineHeight: 24,
  },
  tutorialButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
    marginTop: -20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  tutorialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ComponentsScreen;
