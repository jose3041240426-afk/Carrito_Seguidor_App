import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated, LayoutAnimation, UIManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';
import Typewriter from '../components/Typewriter';

const CONCLUSIONS_DATA = [
  {
    id: 1,
    title: 'Aprendizajes',
    icon: 'bulb',
    content: '• Integración de hardware con el microcontrolador ESP32.\n• Control de motores mediante señales PWM.\n• Lógica de control basada en sensores infrarrojos.\n• Trabajo colaborativo en el diseño y ensamble.'
  },
  {
    id: 2,
    title: 'Dificultades',
    icon: 'warning',
    content: '• Calibración de la sensibilidad de los sensores ante diferentes condiciones de luz.\n• Sincronización de velocidad de los motores para mantener una trayectoria recta.\n• Gestión de la energía para alimentar todos los módulos de forma estable.'
  },
  {
    id: 3,
    title: 'Mejoras Futuras',
    icon: 'trending-up',
    content: '• Implementación de un algoritmo PID para un seguimiento de línea más suave y rápido.\n• Control inalámbrico vía Wi-Fi o Bluetooth desde la misma App.\n• Adición de sensores ultrasónicos para detección de obstáculos.'
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

  const cardScale = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02]
  });

  return (
    <Animated.View style={[
      styles.accordionItem, 
      expanded && styles.accordionItemExpanded,
      { 
        opacity: opacityAnim, 
        transform: [
          { translateY: slideInAnim },
          { scale: cardScale }
        ] 
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
          <Text style={styles.cardText}>{content}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const InfoScreen = ({ navigation }) => {
  const [expandedIndices, setExpandedIndices] = useState([0]);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext({
      duration: 500,
      create: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,
        springDamping: 0.7,
      },
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.8,
      },
      delete: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.opacity,
        springDamping: 0.7,
      },
    });
    
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
          words={['Conclusiones']}
          style={styles.headerTitle}
          loop={true}
          speed={80}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Conclusiones Section */}
        <FadeInView delay={0}>
          <Text style={styles.sectionTitle}>Conclusiones</Text>
        </FadeInView>

        <View style={styles.accordionContainer}>
          {CONCLUSIONS_DATA.map((item, index) => (
            <AccordionItem 
              key={item.id}
              title={item.title}
              content={item.content}
              icon={item.icon}
              expanded={expandedIndices.includes(index)}
              onPress={() => toggleExpand(index)}
              index={index}
            />
          ))}
        </View>

        <FadeInView delay={600}>
          <TouchableOpacity 
            style={styles.creditsButton}
            onPress={() => navigation.navigate('Credits')}
          >
            <View style={styles.creditsButtonContent}>
              <Ionicons name="ribbon-outline" size={24} color="#fff" />
              <Text style={styles.creditsButtonText}>Ver Créditos y Contacto</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#fff" opacity={0.7} />
          </TouchableOpacity>
        </FadeInView>

        <FadeInView delay={800}>
          <Text style={styles.footerText}>Universidad Tecnológica de Durango</Text>
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
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
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
  cardText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
  },
  creditsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 20,
    marginTop: 30,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  creditsButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  footerText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});

export default InfoScreen;
