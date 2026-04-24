import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Animated, LayoutAnimation, UIManager, Platform, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import FadeInView from '../components/FadeInView';
import Typewriter from '../components/Typewriter';

const { width, height: windowHeight } = Dimensions.get('window');

const EVIDENCE = [
  { title: 'Chasis Base', image: require('../../assets/tutorial/paso1.webp') },
  { title: 'Conexión de Motores', image: require('../../assets/tutorial/prueba1.jpeg') },
  { title: 'Sensores Infrarrojos', image: require('../../assets/tutorial/calibracion.jpeg') },
  { title: 'Estructura Final', image: require('../../assets/tutorial/integracion_final.jpeg') },
];

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const BorderBeam = () => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={styles.beamWrapper}>
      <AnimatedGradient
        colors={['rgba(255,255,255,0)', '#00D4FF', '#007AFF', 'rgba(255,255,255,0)']}
        locations={[0.4, 0.48, 0.52, 0.6]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.beamGradient, { transform: [{ rotate }] }]}
      />
    </View>
  );
};

const ZoomableImage = ({ item }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const openZoom = () => {
    setIsZoomed(true);
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0);

    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  };

  const closeZoom = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.8,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => setIsZoomed(false));
  };

  return (
    <>
      <TouchableOpacity
        style={styles.imageCardWrapper}
        activeOpacity={0.9}
        onPress={openZoom}
      >
        <Ionicons name="add" size={20} color="#007AFF" style={styles.cornerTopLeft} />
        <Ionicons name="add" size={20} color="#007AFF" style={styles.cornerTopRight} />
        <Ionicons name="add" size={20} color="#007AFF" style={styles.cornerBottomLeft} />
        <Ionicons name="add" size={20} color="#007AFF" style={styles.cornerBottomRight} />

        <View style={styles.imageCardInner}>
          <Image source={item.image} style={styles.image} />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.9)']}
            style={styles.imageOverlay}
          >
            <Text style={styles.imageTitle}>{item.title}</Text>
          </LinearGradient>
        </View>
      </TouchableOpacity>

      <Modal visible={isZoomed} transparent={true} animationType="none" onRequestClose={closeZoom}>
        <Animated.View style={[styles.modalContainer, { opacity: opacityAnim }]}>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={closeZoom}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Animated.Image
            source={item.image}
            style={[styles.zoomedImage, { transform: [{ scale: scaleAnim }] }]}
            resizeMode="contain"
          />
        </Animated.View>
      </Modal>
    </>
  );
};

const GalleryScreen = () => {
  const videoRef = useRef(null);
  const [status, setStatus] = useState({});
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const controlsTimeout = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (showControls && status.isPlaying) {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      controlsTimeout.current = setTimeout(() => hideControls(), 3000);
    }
    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    };
  }, [showControls, status.isPlaying]);

  const hideControls = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowControls(false));
  };

  const displayControls = () => {
    setShowControls(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleControls = () => {
    if (showControls) hideControls();
    else displayControls();
  };

  const togglePlayPause = () => {
    if (status.isPlaying) {
      videoRef.current.pauseAsync();
    } else {
      videoRef.current.playAsync();
      displayControls();
    }
  };

  const toggleMute = () => {
    videoRef.current.setIsMutedAsync(!status.isMuted);
    displayControls();
  };

  const setSpeed = (rate) => {
    videoRef.current.setRateAsync(rate, true);
    displayControls();
  };

  const handleSeek = (event) => {
    if (status.durationMillis && sliderWidth) {
      const { locationX } = event.nativeEvent;
      const position = Math.max(0, Math.min((locationX / sliderWidth) * status.durationMillis, status.durationMillis));
      videoRef.current.setPositionAsync(position);
      displayControls();
    }
  };

  const handleFullscreen = () => {
    LayoutAnimation.configureNext({
      duration: 400,
      create: { type: 'fade', property: 'opacity' },
      update: { type: 'spring', springDamping: 0.8 },
      delete: { type: 'fade', property: 'opacity' },
    });
    setIsFullscreen(!isFullscreen);
    displayControls();
  };

  const formatTime = (millis) => {
    if (!millis) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const progressPercent = status.durationMillis ? (status.positionMillis / status.durationMillis) * 100 : 0;

  return (
    <SafeAreaView style={[styles.container, isFullscreen && { backgroundColor: '#000' }]}>
      {!isFullscreen && (
        <View style={styles.header}>
          <Typewriter 
            words={['Galería y Evidencia']} 
            style={styles.headerTitle} 
            loop={true}
            speed={80}
          />
        </View>
      )}

      <ScrollView
        contentContainerStyle={[styles.scrollContent, isFullscreen && { padding: 0 }]}
        scrollEnabled={!isFullscreen}
      >
        {!isFullscreen && (
          <>
            <Text style={styles.introText}>Evidencia visual del proceso de armado y pruebas del carrito seguidor de línea.</Text>

            <View style={styles.grid}>
              {EVIDENCE.map((item, index) => (
                <FadeInView key={index} delay={index * 150}>
                  {item.noZoom ? (
                    <View style={styles.imageCardWrapper}>
                      <View style={styles.imageCardInner}>
                        <Image source={item.image} style={styles.image} />
                        <LinearGradient
                          colors={['transparent', 'rgba(0,0,0,0.8)']}
                          style={styles.imageOverlay}
                        >
                          <Text style={styles.imageTitle}>{item.title}</Text>
                        </LinearGradient>
                      </View>
                    </View>
                  ) : (
                    <ZoomableImage item={item} />
                  )}
                </FadeInView>
              ))}
            </View>
          </>
        )}

        <FadeInView delay={EVIDENCE.length * 150}>
          <View style={[
            styles.customPlayerContainer,
            isFullscreen && {
              height: windowHeight,
              marginTop: 0,
              marginBottom: 0,
              borderRadius: 0,
            }
          ]}>
            <BorderBeam />

            <View style={[styles.innerPlayerContainer, isFullscreen && { margin: 0, borderRadius: 0 }]}>
              <TouchableWithoutFeedback onPress={toggleControls}>
                <Video
                  ref={videoRef}
                  source={require('../../assets/fondo.mp4')}
                  style={styles.customVideo}
                  resizeMode={isFullscreen ? "contain" : "cover"}
                  isLooping
                  shouldPlay={false}
                  onPlaybackStatusUpdate={setStatus}
                />
              </TouchableWithoutFeedback>

              <View style={styles.videoInfoAbsoluteTop}>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>PRUEBA EN PISTA</Text>
                </View>
              </View>

              {showControls && (
                <Animated.View style={[styles.floatingControls, { opacity: fadeAnim }]}>
                  <View style={styles.progressRow}>
                    <Text style={styles.timeText}>{formatTime(status.positionMillis)}</Text>

                    <TouchableWithoutFeedback onPress={handleSeek}>
                      <View
                        style={styles.sliderContainer}
                        onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
                      >
                        <View style={styles.sliderBackground}>
                          <View style={[styles.sliderFill, { width: `${progressPercent}%` }]} />
                        </View>
                      </View>
                    </TouchableWithoutFeedback>

                    <Text style={styles.timeText}>{formatTime(status.durationMillis)}</Text>
                  </View>

                  <View style={styles.controlsRow}>
                    <View style={styles.leftControls}>
                      <TouchableOpacity onPress={togglePlayPause} style={styles.controlBtn}>
                        <Ionicons name={status.isPlaying ? 'pause' : 'play'} size={22} color="#fff" />
                      </TouchableOpacity>

                      <TouchableOpacity onPress={toggleMute} style={styles.controlBtn}>
                        <Ionicons name={status.isMuted ? 'volume-mute' : 'volume-high'} size={22} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.rightControls}>
                      {[0.5, 1, 1.5, 2].map(speed => (
                        <TouchableOpacity
                          key={speed}
                          onPress={() => setSpeed(speed)}
                          style={[styles.speedBtn, status.rate === speed && styles.speedBtnActive]}
                        >
                          <Text style={styles.speedText}>{speed}x</Text>
                        </TouchableOpacity>
                      ))}
                      <TouchableOpacity onPress={handleFullscreen} style={[styles.controlBtn, { marginLeft: 8 }]}>
                        <Ionicons name={isFullscreen ? "contract" : "expand"} size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Animated.View>
              )}
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
    padding: 20,
  },
  introText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    lineHeight: 24,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageCardWrapper: {
    width: (width - 60) / 2,
    marginBottom: 30,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,122,255,0.2)',
    backgroundColor: '#f8f9fa',
  },
  cornerTopLeft: { position: 'absolute', top: -10, left: -10, zIndex: 2 },
  cornerTopRight: { position: 'absolute', top: -10, right: -10, zIndex: 2 },
  cornerBottomLeft: { position: 'absolute', bottom: -10, left: -10, zIndex: 2 },
  cornerBottomRight: { position: 'absolute', bottom: -10, right: -10, zIndex: 2 },
  imageCardInner: {
    width: '100%',
    height: 180,
    backgroundColor: '#eaeaea',
    overflow: 'hidden',
    borderRadius: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    justifyContent: 'flex-end',
    padding: 10,
  },
  imageTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  zoomedImage: {
    width: '100%',
    height: '80%',
  },
  beamWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  beamGradient: {
    width: '200%',
    height: '200%',
    position: 'absolute',
  },
  innerPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
    borderRadius: 23,
    overflow: 'hidden',
    margin: 3,
  },
  customPlayerContainer: {
    width: '100%',
    height: 260,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 40,
    backgroundColor: '#000',
    elevation: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  customVideo: {
    width: '100%',
    height: '100%',
  },
  videoInfoAbsoluteTop: {
    position: 'absolute',
    top: 15,
    left: 15,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFF',
    marginRight: 6,
  },
  liveText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  floatingControls: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    right: 15,
    backgroundColor: 'rgba(17, 17, 17, 0.75)',
    borderRadius: 20,
    padding: 15,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    minWidth: 35,
    textAlign: 'center',
  },
  sliderContainer: {
    flex: 1,
    height: 20,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  sliderBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rightControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  speedBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 4,
  },
  speedBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  speedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default GalleryScreen;
