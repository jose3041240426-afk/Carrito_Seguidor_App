import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import DescriptionScreen from '../screens/DescriptionScreen';
import TeamScreen from '../screens/TeamScreen';
import ComponentsScreen from '../screens/ComponentsScreen';
import GalleryScreen from '../screens/GalleryScreen';
import InfoScreen from '../screens/InfoScreen';
import FunctionalityScreen from '../screens/FunctionalityScreen';

const Tab = createBottomTabNavigator();

const AnimatedTabItem = ({ isFocused, onPress, label, iconName }) => {
  const animation = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animation, {
      toValue: isFocused ? 1 : 0,
      tension: 50,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', 'rgba(0, 122, 255, 0.1)'],
  });

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [40, 105],
  });

  const iconY = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -5, 0],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Animated.View style={[styles.tabItem, { backgroundColor, width }]}>
        <Animated.View style={{ transform: [{ translateY: isFocused ? iconY : 0 }] }}>
          <Ionicons 
            name={iconName} 
            size={22} 
            color={isFocused ? '#007AFF' : '#8e8e93'} 
          />
        </Animated.View>
        
        {isFocused && (
          <Animated.Text 
            style={[styles.tabLabel, { opacity: animation }]}
            numberOfLines={1}
          >
            {label}
          </Animated.Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      <SafeAreaView>
        <View style={styles.tabBar}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            let iconName;
            if (route.name === 'Info') iconName = isFocused ? 'information-circle' : 'information-circle-outline';
            if (route.name === 'Equipo') iconName = isFocused ? 'people' : 'people-outline';
            if (route.name === 'Materiales') iconName = isFocused ? 'list' : 'list-outline';
            if (route.name === 'Lógica') iconName = isFocused ? 'hardware-chip' : 'hardware-chip-outline';
            if (route.name === 'Galería') iconName = isFocused ? 'images' : 'images-outline';
            if (route.name === 'Final') iconName = isFocused ? 'checkmark-circle' : 'checkmark-circle-outline';

            return (
              <AnimatedTabItem
                key={index}
                isFocused={isFocused}
                onPress={onPress}
                label={route.name}
                iconName={iconName}
              />
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Info" component={DescriptionScreen} />
      <Tab.Screen name="Equipo" component={TeamScreen} />
      <Tab.Screen name="Materiales" component={ComponentsScreen} />
      <Tab.Screen name="Lógica" component={FunctionalityScreen} />
      <Tab.Screen name="Galería" component={GalleryScreen} />
      <Tab.Screen name="Final" component={InfoScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    height: 70,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    borderRadius: 22,
  },
  tabLabel: {
    color: '#007AFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
  },
});

export default MainTabs;
