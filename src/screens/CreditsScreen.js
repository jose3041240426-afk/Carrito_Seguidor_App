import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';
import Typewriter from '../components/Typewriter';

const CreditsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Typewriter
          words={['Créditos y Contacto']}
          style={styles.headerTitle}
          loop={true}
          speed={80}
        />
      </View>

      <View style={styles.content}>
        <FadeInView delay={0}>
          <View style={styles.creditsCard}>
            <Text style={styles.label}>Materia</Text>
            <Text style={styles.value}>Desarrollo de aplicaciones moviles</Text>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Grupo</Text>
                <Text style={styles.value}>5° A TI</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Cuatrimestre</Text>
                <Text style={styles.value}>Mayo-Agosto 2026</Text>
              </View>
            </View>

            <Text style={styles.label}>Docente</Text>
            <Text style={styles.value}>Ing. Ana Laura Lara Chairez</Text>

            <Text style={styles.label}>Fecha de Entrega</Text>
            <Text style={styles.value}>Viernes 24 de Abril de 2026</Text>
          </View>
        </FadeInView>

        <FadeInView delay={150}>
          <View style={styles.contactInfo}>
            <Text style={styles.contactTitle}>Contacto del Equipo</Text>
            <TouchableOpacity style={styles.contactItem}>
              <Ionicons name="mail" size={18} color="#007AFF" />
              <Text style={styles.contactText}>jose_3041240426@utd.edu.mx</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem}>
              <Ionicons name="mail" size={18} color="#007AFF" />
              <Text style={styles.contactText}>humberto_3027230031@utd.edu.mx</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem}>
              <Ionicons name="mail" size={18} color="#007AFF" />
              <Text style={styles.contactText}>josue_3041240412@utd.edu.mx</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactItem}>
              <Ionicons name="mail" size={18} color="#007AFF" />
              <Text style={styles.contactText}>manuel_3041240406@utd.edu.mx</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.contactItem, { marginTop: 20, flexDirection: 'column' }]}>
              <Ionicons name="logo-github" size={26} color="#007AFF" />
              <Text style={[styles.contactText, { marginLeft: 0, marginTop: 5 }]}>
                github.com/jose3041240426-afk/Carrito_Seguidor_App
              </Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        <FadeInView delay={300} style={styles.footerText}>
          <Text style={{ color: '#999', fontSize: 14, textAlign: 'center' }}>Universidad Tecnológica de Durango</Text>
        </FadeInView>
      </View>
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
  content: {
    padding: 25,
    flex: 1,
    justifyContent: 'center',
  },
  creditsCard: {
    backgroundColor: '#f8f9fa',
    padding: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#eee',
  },
  label: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 5,
    marginTop: 15,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  contactInfo: {
    marginTop: 40,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contactText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 10,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  footerText: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
});

export default CreditsScreen;
