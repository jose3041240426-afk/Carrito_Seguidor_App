import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import FadeInView from '../components/FadeInView';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
  { id: 'Description', title: 'Descripción', icon: 'information-circle', color: '#4158D0' },
  { id: 'Components', title: 'Materiales', icon: 'list', color: '#C850C0' },
  { id: 'Tutorial', title: 'Funcionamiento', icon: 'settings', color: '#FFCC70' },
  { id: 'Gallery', title: 'Galería', icon: 'images', color: '#00DBDE' },
  { id: 'Team', title: 'Equipo', icon: 'people', color: '#FC00FF' },
  { id: 'Conclusions', title: 'Conclusiones', icon: 'checkmark-circle', color: '#0093E9' },
  { id: 'Credits', title: 'Créditos', icon: 'ribbon', color: '#80D0C7' },
];

const MenuScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Secciones del Proyecto</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {MENU_ITEMS.map((item, index) => (
            <FadeInView key={item.id} delay={index * 100}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Ionicons name={item.icon} size={30} color="#fff" />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </TouchableOpacity>
            </FadeInView>
          ))}
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
    padding: 20,
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
  scrollContent: {
    paddingBottom: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  menuItem: {
    width: (width - 60) / 2,
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    padding: 20,
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
});

export default MenuScreen;
