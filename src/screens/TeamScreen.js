import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';
import Typewriter from '../components/Typewriter';

const MEMBERS = [
  { name: 'Guerrero Simental José Manuel', role: 'Programación', icon: 'code-slash', color: '#ff7e5f', ig: '@instagram', image: require('../../assets/tutorial/Manuel.png') },
  { name: 'Castillo Diaz Humberto', role: 'Ensamblaje Mecánico y Electrónica', icon: 'construct', color: '#0396FF', ig: '@instagram', image: require('../../assets/tutorial/Humberto.jpeg') },
  { name: 'Hernandez Tavizón Josué Joán', role: 'Pruebas y Calibración', icon: 'speedometer', color: '#7367F0', ig: '@instagram', image: require('../../assets/tutorial/Joan.jpeg') },
  { name: 'Mathey Ortiz Manuel Alejandro', role: 'Pruebas y Calibración', icon: 'speedometer', color: '#32CD32', ig: '@instagram', image: require('../../assets/tutorial/mathey.jpeg') },
];

const TeamScreen = ({ navigation }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.spring(animation, {
      toValue: isExpanded ? 0 : 1,
      friction: 8,
      tension: 40,
      useNativeDriver: false
    }).start();
    setIsExpanded(!isExpanded);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typewriter
          words={['Equipo de Trabajo']}
          style={styles.headerTitle}
          loop={true}
          speed={80}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeInView delay={0}>
          <View style={styles.projectInfoCard}>
            <Text style={styles.projectName}>PROYECTO FINAL</Text>
            <View style={styles.divider} />
            <Text style={styles.infoText}>Profesor: Ing. Ana Laura Lara Chairez</Text>
            <Text style={styles.infoText}>Grado: 5°  Grupo: A TI</Text>
            <Text style={styles.infoText}>Fecha: Abril 2026</Text>
          </View>
        </FadeInView>

        <FadeInView delay={100}>
          <Text style={styles.teamName}>Equipo Dinastía</Text>
        </FadeInView>

        <FadeInView delay={200}>
          <Text style={styles.sectionTitle}>Integrantes</Text>
        </FadeInView>

        <FadeInView delay={400}>
          <View style={styles.stackedContainer}>
            {MEMBERS.map((member, index) => {
              const marginTop = animation.interpolate({
                inputRange: [0, 1],
                outputRange: [index === 0 ? 0 : -70, 15]
              });

              const scale = animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1 - (0.05 * index), 1]
              });

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.memberCard,
                    {
                      marginTop,
                      transform: [{ scale }],
                      zIndex: MEMBERS.length - index,
                    }
                  ]}
                >
                  <View style={[styles.iconContainer, { backgroundColor: member.color + '20' }]}>
                    {member.image ? (
                      <Image source={member.image} style={styles.memberImage} />
                    ) : (
                      <Ionicons name={member.icon} size={26} color={member.color} />
                    )}
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <Text style={styles.memberRole}>{member.role}</Text>
                  </View>
                  <View style={styles.igBadge}>
                    <Ionicons name="logo-instagram" size={14} color="#E1306C" />
                    <Text style={styles.igText}>{member.ig}</Text>
                  </View>
                </Animated.View>
              );
            })}

            <View style={styles.btnGroup}>
              <TouchableOpacity
                style={[styles.toggleBtn, isExpanded && styles.toggleBtnActive]}
                onPress={toggleExpand}
                activeOpacity={0.8}
              >
                <Text style={[styles.toggleBtnText, isExpanded && styles.toggleBtnTextActive]}>
                  {isExpanded ? "Ocultar" : "Ver a todos"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </FadeInView>

        <View style={styles.authContainer}>
          <FadeInView delay={600}>
            <View style={styles.authCard}>
              <Text style={styles.authLabel}>Presenta</Text>
              <Text style={styles.authName}>Ing. Ana Laura Lara Chairez</Text>
              <Text style={styles.authRole}>Titular de la Materia</Text>
            </View>
          </FadeInView>
        </View>
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
    padding: 20,
  },
  projectInfoCard: {
    backgroundColor: '#007AFF',
    padding: 25,
    borderRadius: 25,
    marginBottom: 30,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  projectName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 15,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
    opacity: 0.9,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  stackedContainer: {
    marginBottom: 20,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 15,
  },
  memberName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  memberRole: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  teamName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  igBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  igText: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    fontWeight: 'bold',
  },
  btnGroup: {
    alignItems: 'center',
    marginTop: 30,
    zIndex: 99,
  },
  toggleBtn: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  toggleBtnActive: {
    backgroundColor: '#007AFF',
  },
  toggleBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  toggleBtnTextActive: {
    color: '#fff',
  },
  authContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  authCard: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  authLabel: {
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  authName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  authRole: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
});

export default TeamScreen;
