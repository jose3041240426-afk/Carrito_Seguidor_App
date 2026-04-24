import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import Screens
import HomeScreen from './src/screens/HomeScreen';
import MainTabs from './src/navigation/MainTabs';
import Tutorial from './src/components/Tutorial';
import CreditsScreen from './src/screens/CreditsScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Tutorial" component={TutorialWrapper} />
        <Stack.Screen name="Credits" component={CreditsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Wrapper for Tutorial to match Navigation expected onBack behavior
const TutorialWrapper = ({ navigation }) => {
  return <Tutorial onBack={() => navigation.goBack()} />;
};
