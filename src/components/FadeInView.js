import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const FadeInView = ({ children, delay = 0, style }) => {
  const slideInAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideInAnim, {
        toValue: 0,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
      })
    ]).start();
  }, [delay]);

  return (
    <Animated.View style={[style, { opacity: opacityAnim, transform: [{ translateY: slideInAnim }] }]}>
      {children}
    </Animated.View>
  );
};

export default FadeInView;
