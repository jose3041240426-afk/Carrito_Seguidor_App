import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Animated, LayoutAnimation, UIManager, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Typewriter from '../components/Typewriter';

const DESCRIPTION_DATA = [
  {
    id: 1,
    title: '¿Qué es el Carrito Seguidor de Línea?',
    icon: 'car-sport',
    content: 'Es un robot autónomo capaz de detectar una trayectoria marcada por una línea (generalmente negra sobre fondo blanco) y seguirla de manera precisa utilizando sensores infrarrojos y lógica de control.'
  },
  {
    id: 2,
    title: '¿Qué problema resuelve?',
    icon: 'help-circle',
    content: 'Fue desarrollado para simular sistemas de transporte automatizado en fábricas y almacenes, donde la eficiencia y la precisión en el movimiento de materiales son críticas para la productividad.'
  },
  {
    id: 3,
    title: 'Objetivo General',
    icon: 'flag',
    content: 'Diseñar e implementar un sistema mecatrónico controlado por un microcontrolador ESP32 que integre sensores y actuadores para el seguimiento autónomo de rutas predefinidas.'
  },
  {
    id: 4,
    title: 'Funcionamiento General',
    icon: 'settings',
    content: 'El sistema lee constantemente los datos de los sensores infrarrojos. Si el sensor izquierdo detecta la línea, el robot gira a la izquierda; si es el derecho, gira a la derecha; y si ambos detectan la línea, avanza. Esto se logra mediante el control de velocidad por PWM en los motores.'
  }
];

const AccordionItem = ({ title, content, icon, expanded, onPress, index }) => {
  const animatedController = useRef(new Animated.Value(expanded ? 1 : 0)).current;
  const slideInAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

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

  const [isMounted, setIsMounted] = useState(expanded);

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
          {
            opacity: contentOpacity,
            transform: [{ translateY: contentTranslateY }],
            // Cuando no está expandido pero sigue montado (cerrando),
            // LayoutAnimation se encargará de colapsar el espacio.
          }
        ]}>
          <View style={styles.divider} />
          <Text style={styles.cardText}>{content}</Text>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const DescriptionScreen = ({ navigation }) => {
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
          words={['Descripción del Proyecto']}
          style={styles.headerTitle}
          loop={true}
          speed={80}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {DESCRIPTION_DATA.map((item, index) => (
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fbfbfb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  scrollContent: {
    padding: 20,
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
});

export default DescriptionScreen;
