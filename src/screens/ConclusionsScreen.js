import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';

const ConclusionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conclusiones</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeInView delay={0}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Aprendizajes</Text>
            <Text style={styles.cardText}>
              • Integración de hardware con el microcontrolador ESP32.{'\n'}
              • Control de motores mediante señales PWM.{'\n'}
              • Lógica de control basada en sensores infrarrojos.{'\n'}
              • Trabajo colaborativo en el diseño y ensamble.
            </Text>
          </View>
        </FadeInView>

        <FadeInView delay={150}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Dificultades</Text>
            <Text style={styles.cardText}>
              • Calibración de la sensibilidad de los sensores ante diferentes condiciones de luz.{'\n'}
              • Sincronización de velocidad de los motores para mantener una trayectoria recta.{'\n'}
              • Gestión de la energía para alimentar todos los módulos de forma estable.
            </Text>
          </View>
        </FadeInView>

        <FadeInView delay={300}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Mejoras Futuras</Text>
            <Text style={styles.cardText}>
              • Implementación de un algoritmo PID para un seguimiento de línea más suave y rápido.{'\n'}
              • Control inalámbrico vía Wi-Fi o Bluetooth desde la misma App.{'\n'}
              • Adición de sensores ultrasónicos para detección de obstáculos.
            </Text>
          </View>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    backgroundColor: '#f8f9fa',
    padding: 25,
    borderRadius: 25,
    marginBottom: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: '#444',
    lineHeight: 26,
  },
});

export default ConclusionsScreen;
