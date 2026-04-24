import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import FadeInView from './FadeInView';

const { width, height } = Dimensions.get('window');

const STEPS = [
  {
    id: '1',
    title: '1. Ensamblaje Mecánico',
    content: 'Primero se debe armar toda la estructura física del robot:\n\n• Fija la base del chasis (acrílico, MDF o 3D).\n• Coloca los motores reductores a los lados.\n• Monta las llantas en los ejes.\n• Instala la rueda loca (caster) para estabilidad.\n• Fija el porta pilas y el interruptor.\n• Instala la base de sensores al frente, cerca del suelo.',
    image: require('../../assets/tutorial/paso1.png'),
    color: '#4158D0',
  },
  {
    id: '2',
    title: '2. Conexión de Alimentación',
    content: 'Define cómo fluye la energía:\n\n• Positivo (+) del porta pilas al interruptor.\n• Del interruptor al pin VCC (12V/VIN) del Puente H.\n• Negativo (-) del porta pilas al GND del Puente H.',
    warning: 'Este GND debe compartirse con el ESP32 (tierra común).',
    images: [
      require('../../assets/tutorial/portapilas.webp'),
      require('../../assets/tutorial/baterias 18650.jpg'),
    ],
    color: '#C850C0',
  },
  {
    id: '3',
    title: '3. Motores al Puente H',
    content: 'Cada motor va a una salida del puente H:\n\nMotor A:\n• Positivo → OUT1\n• Negativo → OUT2\n\nMotor B:\n• Positivo → OUT4\n• Negativo → OUT3',
    image: require('../../assets/tutorial/step2.png'),
    color: '#FFCC70',
  },
  {
    id: '4',
    title: '4. Puente H al ESP32',
    content: 'El ESP32 controla dirección y velocidad:\n\n• IN1–IN4 → Control de dirección (GPIOs)\n• ENA/ENB → Control de velocidad (PWM)\n\nEjemplo: IN1(14), IN2(27), IN3(26), IN4(25), ENA(33), ENB(32).',
    warning: '¡CRÍTICO: Conecta el GND del ESP32 con el GND del puente H!',
    image: { uri: 'https://teknomovo.com.mx/wp-content/uploads/2021/06/l298nr__3_.png' },
    color: '#00DBDE',
  },
  {
    id: '5',
    title: '5. Sensores Seguidores',
    content: 'Para los sensores infrarrojos:\n\n• VCC → 3.3V del ESP32\n• GND → GND común\n• AO (Analógico) → ADC del ESP32\n• DO (Digital) → GPIOs\n\nIzquierdo: GPIO 34, Derecho: GPIO 35',
    image: { uri: 'https://mvelectronica.s3.us-east-2.amazonaws.com/productos/SOBS/607f1ac66a595.webp' },
    color: '#FC00FF',
  },
  {
    id: '6',
    title: '6. Organización del Cableado',
    content: '• Usa cables cortos y ordenados.\n• Evita cruces innecesarios.\n• Asegura conexiones flojas.\n\nColores sugeridos:\n• Rojo → VCC\n• Negro → GND\n• Otros → Señales',
    image: { uri: 'https://imgs.search.brave.com/IKY-DfEWytQhF7l9dgag9qIzLzVypAVCa-vHPuSDdvE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/dGVjbmV1LmNvbS9j/ZG4vc2hvcC9maWxl/cy90aXJhLWRlLTQw/LWNhYmxlcy1qdW1w/ZXJzLWR1cG9udC0y/MGNtLW1hY2hvbWFj/aG8taGVtYnJhaGVt/YnJhLWhlbWJyYW1h/Y2hvLTE5NzY3Ny5q/cGc_dj0xNzUwMjA0/NTM3JndpZHRoPTcy/MA' },
    color: '#0093E9',
  },
  {
    id: '7',
    title: '7. Pruebas Iniciales',
    content: 'Antes de programar, verifica:\n\n• Enciende el robot.\n• El ESP32 debe encender.\n• No debe haber sobrecalentamiento.\n• Los motores no deben girar solos.',
    image: require('../../assets/tutorial/prueba1.jpeg'),
    color: '#80D0C7',
  },
  {
    id: '8',
    title: '8. Prueba de Motores',
    content: 'Haz un código simple para probar:\n\n• Avanzar\n• Retroceder\n• Girar izquierda/derecha\n\nEsto confirma que el puente H funciona correctamente.',
    video: require('../../assets/tutorial/prueba inicial.mp4'),
    color: '#FFAA00',
  },
  {
    id: '9',
    title: '9. Calibración de Sensores',
    content: 'Sobre la línea, ajusta sensibilidad:\n\n• Blanco → Valor alto\n• Negro → Valor bajo\n\nUsa el potenciómetro del sensor si es necesario.',
    image: require('../../assets/tutorial/calibracion.jpeg'),
    color: '#FF3CAC',
  },
  {
    id: '10',
    title: '10. Integración Final',
    content: 'Aplica la lógica final:\n\n• Ambos detectan línea → Avanzar\n• Izquierdo detecta → Girar izquierda\n• Derecho detecta → Girar derecha',
    image: require('../../assets/tutorial/integracion final.jpeg'),
    color: '#21D4FD',
  },
];

const StepMedia = ({ image, images, video }) => {
  const [isFirst, setIsFirst] = useState(true);
  const anim = useRef(new Animated.Value(0)).current;

  if (video) {
    return <Video 
      source={video} 
      style={styles.image} 
      resizeMode="cover"
      shouldPlay={true}
      isMuted={true}
      isLooping
    />;
  }

  if (!images) {
    return <Image source={image} style={styles.image} />;
  }

  const handlePress = () => {
    Animated.spring(anim, {
      toValue: isFirst ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    setIsFirst(!isFirst);
  };

  const card1Transform = {
    transform: [
      { perspective: 1000 },
      { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 80] }) },
      { rotateY: anim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '45deg'] }) },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.8] }) },
    ],
    zIndex: isFirst ? 2 : 1,
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }),
  };

  const card2Transform = {
    transform: [
      { perspective: 1000 },
      { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-80, 0] }) },
      { rotateY: anim.interpolate({ inputRange: [0, 1], outputRange: ['-45deg', '0deg'] }) },
      { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
    ],
    zIndex: isFirst ? 1 : 2,
    opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
  };

  return (
    <TouchableOpacity 
      activeOpacity={1} 
      onPress={handlePress}
      style={[styles.imageContainer, { height: height * 0.35 }]}
    >
      <Animated.View style={[styles.card3d, card2Transform, { position: 'absolute' }]}>
        <Image source={images[1]} style={styles.image} />
      </Animated.View>
      <Animated.View style={[styles.card3d, card1Transform]}>
        <Image source={images[0]} style={styles.image} />
      </Animated.View>
      
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Toca para intercambiar</Text>
      </View>
    </TouchableOpacity>
  );
};

const StepCard = React.memo(({ item }) => {
  return (
    <View style={styles.mainCard}>
      <View style={styles.imageContainer}>
        <StepMedia image={item.image} images={item.images} video={item.video} />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.stepTitle}>{item.title}</Text>
        <Text style={styles.stepContent}>{item.content}</Text>
        
        {item.warning && (
          <View style={styles.warningContainer}>
            <Ionicons name="alert-circle" size={20} color="#d32f2f" />
            <Text style={styles.warningText}>{item.warning}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

import { PanResponder } from 'react-native';

const Tutorial = ({ onBack }) => {
  const [cardOrder, setCardOrder] = useState(() => STEPS.map((_, i) => i));
  const swipeAnim = useRef(new Animated.ValueXY()).current;
  const [isResetting, setIsResetting] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isResetting) {
          swipeAnim.setValue({ x: gestureState.dx, y: 0 });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (isResetting) return;
        if (gestureState.dx < -120) {
          forceSwipe('left');
        } else if (gestureState.dx > 120) {
          forceSwipe('right');
        } else {
          resetPosition();
        }
      }
    })
  ).current;

  const forceSwipe = (direction) => {
    const x = direction === 'left' ? -width - 50 : width + 50;
    Animated.timing(swipeAnim, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false
    }).start(() => onSwipeComplete(direction));
  };

  const resetPosition = () => {
    Animated.spring(swipeAnim, {
      toValue: { x: 0, y: 0 },
      friction: 5,
      useNativeDriver: false
    }).start();
  };

  const onSwipeComplete = (direction) => {
    setIsResetting(true);
    setCardOrder(prev => {
      const newOrder = [...prev];
      if (direction === 'left') {
        const topCard = newOrder.shift();
        newOrder.push(topCard);
      } else {
        const bottomCard = newOrder.pop();
        newOrder.unshift(bottomCard);
      }
      return newOrder;
    });

    // Desvinculamos el valor animado para que no haya parpadeo, y lo reseteamos silenciosamente
    setTimeout(() => {
      swipeAnim.setValue({ x: 0, y: 0 });
      setIsResetting(false);
    }, 50);
  };

  const renderCards = () => {
    const rendered = [];

    // --- DEEP CARDS ---
    for (let depth = 3; depth >= 1; depth--) {
      const stepIndex = cardOrder[depth];
      const step = STEPS[stepIndex];

      const progress = isResetting ? new Animated.Value(0) : swipeAnim.x.interpolate({
        inputRange: [-width / 2, 0, width],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
      });

      const scale = isResetting ? (1 - 0.05 * depth) : progress.interpolate({
        inputRange: [0, 1],
        outputRange: [1 - 0.05 * depth, 1 - 0.05 * (depth - 1)]
      });

      const translateY = isResetting ? (25 * depth) : progress.interpolate({
        inputRange: [0, 1],
        outputRange: [25 * depth, 25 * (depth - 1)]
      });

      rendered.push(
        <Animated.View
          key={`next-${step.id}-${depth}`}
          style={[styles.cardAbsolute, { zIndex: 10 - depth, transform: [{ scale }, { translateY }] }]}
        >
          <StepCard item={step} />
        </Animated.View>
      );
    }

    // --- TOP CARD ---
    const topStep = STEPS[cardOrder[0]];
    const topTranslateX = isResetting ? 0 : swipeAnim.x.interpolate({
      inputRange: [-width, 0, width],
      outputRange: [-width, 0, 0],
      extrapolate: 'clamp'
    });
    const topRotate = isResetting ? '0deg' : swipeAnim.x.interpolate({
      inputRange: [-width, 0, width],
      outputRange: ['-15deg', '0deg', '0deg'],
      extrapolate: 'clamp'
    });

    rendered.push(
      <Animated.View
        key={`top-${topStep.id}`}
        style={[
          styles.cardAbsolute, 
          { zIndex: 10, transform: [{ translateX: topTranslateX }, { rotate: topRotate }] }
        ]}
      >
        <StepCard item={topStep} />
      </Animated.View>
    );

    // --- PREV CARD ---
    const prevIndex = cardOrder[cardOrder.length - 1];
    const prevStep = STEPS[prevIndex];
    const prevTranslateX = isResetting ? -width - 50 : swipeAnim.x.interpolate({
      inputRange: [-width, 0, width],
      outputRange: [-width - 50, -width - 50, 0],
      extrapolate: 'clamp'
    });
    const prevRotate = isResetting ? '-15deg' : swipeAnim.x.interpolate({
      inputRange: [0, width],
      outputRange: ['-15deg', '0deg'],
      extrapolate: 'clamp'
    });

    rendered.push(
      <Animated.View
        key={`prev-${prevStep.id}`}
        style={[
          styles.cardAbsolute,
          { zIndex: 20, transform: [{ translateX: prevTranslateX }, { rotate: prevRotate }] }
        ]}
      >
        <StepCard item={prevStep} />
      </Animated.View>
    );

    return rendered;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <FadeInView delay={300}>
          <View style={styles.cardsContainer} {...panResponder.panHandlers}>
            {renderCards()}
          </View>
        </FadeInView>

        <FadeInView delay={100} style={styles.backButton}>
          <TouchableOpacity onPress={onBack}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
        </FadeInView>

        <FadeInView delay={600} style={styles.swipeHintContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="swap-horizontal" size={24} color="#666" />
            <Text style={styles.swipeHintText}>← Atrás | Adelante →</Text>
          </View>
        </FadeInView>

      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  safeArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    width: width * 0.9,
    height: height * 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardAbsolute: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainCard: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  imageContainer: {
    height: height * 0.35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: width * 0.7,
    height: height * 0.3,
    borderRadius: 20,
    resizeMode: 'contain',
  },
  card3d: {
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  badge: {
    position: 'absolute',
    bottom: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 999,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 25,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  stepContent: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: '#fff5f5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffe3e3',
  },
  warningText: {
    color: '#d32f2f',
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    fontWeight: '600',
  },
  swipeHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 40,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  swipeHintText: {
    color: '#666',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 14,
  },
});

export default Tutorial;
