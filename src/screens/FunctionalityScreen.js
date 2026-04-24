import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated, LayoutAnimation, UIManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';
import Typewriter from '../components/Typewriter';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STEPS = [
  {
    id: 1,
    title: 'Detección de la Línea',
    desc: 'Los sensores infrarrojos emiten luz. Si el suelo es blanco, la luz rebota; si es negro (la línea), la luz es absorbida. El sensor envía esta señal al ESP32.',
    icon: 'eye'
  },
  {
    id: 2,
    title: 'Procesamiento Lógico',
    desc: 'El ESP32 recibe los datos. Si el sensor izquierdo detecta negro, sabe que debe girar a la izquierda. Si ambos detectan blanco, sigue recto.',
    icon: 'analytics'
  },
  {
    id: 3,
    title: 'Control de Motores',
    desc: 'Mediante el Puente H, el ESP32 regula la potencia (PWM) de cada motor para corregir el rumbo o avanzar a máxima velocidad.',
    icon: 'settings'
  }
];

const AccordionItem = ({ title, content, icon, expanded, onPress, index }) => {
  const animatedController = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const slideInAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [isMounted, setIsMounted] = useState(expanded);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideInAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 150,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  useEffect(() => {
    if (expanded) {
      setIsMounted(true);
      Animated.timing(animatedController, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedController, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIsMounted(false);
      });
    }
  }, [expanded]);

  const rotateChevron = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  const contentTranslateY = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [-15, 0]
  });

  const contentOpacity = animatedController.interpolate({
    inputRange: [0, 0.4, 1],
    outputRange: [0, 0, 1]
  });

  return (
    <Animated.View style={[
      styles.accordionItem, 
      expanded && styles.accordionItemExpanded,
      { 
        opacity: opacityAnim, 
        transform: [{ translateY: slideInAnim }] 
      }
    ]}>
      <TouchableOpacity style={styles.accordionHeader} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, expanded && styles.iconContainerExpanded]}>
            <Ionicons name={icon} size={22} color={expanded ? "#fff" : "#007AFF"} />
          </View>
          <Text style={[styles.accordionTitle, expanded && styles.accordionTitleExpanded]}>{title}</Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateChevron }] }}>
          <Ionicons name="chevron-down" size={24} color={expanded ? "#007AFF" : "#999"} />
        </Animated.View>
      </TouchableOpacity>
      
      {isMounted && (
        <Animated.View style={[
          styles.accordionContent,
          { opacity: contentOpacity, transform: [{ translateY: contentTranslateY }] }
        ]}>
          <View style={styles.divider} />
          <Text style={styles.stepDesc}>{content}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const FunctionalityScreen = () => {
  const [expandedIndices, setExpandedIndices] = useState([0]);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Typewriter
          words={['Funcionamiento']}
          style={styles.headerTitle}
          loop={true}
          speed={80}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <FadeInView delay={0}>
          <Text style={styles.sectionTitle}>¿Cómo trabaja el robot?</Text>
          <Text style={styles.introText}>
            El sistema se basa en un ciclo de retroalimentación en tiempo real que permite al carrito mantenerse sobre la pista.
          </Text>
        </FadeInView>

        <View style={styles.accordionContainer}>
          {STEPS.map((step, index) => (
            <AccordionItem 
              key={step.id}
              title={step.title}
              content={step.desc}
              icon={step.icon}
              expanded={expandedIndices.includes(index)}
              onPress={() => toggleExpand(index)}
              index={index}
            />
          ))}
        </View>

        <FadeInView delay={800}>
          <View style={styles.logicCard}>
            <Text style={styles.logicTitle}>Lógica de Decisión</Text>
            <View style={styles.logicRow}>
              <Ionicons name="arrow-up-circle" size={20} color="#34C759" />
              <Text style={styles.logicText}>Ambos Sensores en Blanco: <Text style={styles.bold}>Avanzar</Text></Text>
            </View>
            <View style={styles.logicRow}>
              <Ionicons name="arrow-back-circle" size={20} color="#FF9500" />
              <Text style={styles.logicText}>Sensor Izquierdo en Negro: <Text style={styles.bold}>Girar Izquierda</Text></Text>
            </View>
            <View style={styles.logicRow}>
              <Ionicons name="arrow-forward-circle" size={20} color="#FF9500" />
              <Text style={styles.logicText}>Sensor Derecho en Negro: <Text style={styles.bold}>Girar Derecha</Text></Text>
            </View>
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
    padding: 25,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  introText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
    textAlign: 'justify',
  },
  accordionContainer: {
    marginBottom: 10,
  },
  accordionItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  accordionItemExpanded: {
    borderColor: '#cce5ff',
    backgroundColor: '#fff',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    paddingRight: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  iconContainerExpanded: {
    backgroundColor: '#007AFF',
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    flex: 1,
    paddingRight: 10,
  },
  accordionTitleExpanded: {
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 15,
    marginHorizontal: 15,
  },
  accordionContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  stepDesc: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    textAlign: 'justify',
  },
  logicCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    padding: 25,
    marginTop: 10,
  },
  logicTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  logicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  logicText: {
    color: '#eee',
    fontSize: 15,
    marginLeft: 12,
  },
  bold: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default FunctionalityScreen;
