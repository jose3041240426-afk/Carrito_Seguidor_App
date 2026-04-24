import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  FlatList,
} from "react-native";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width * 0.75;
const ITEM_SPACING = (width - ITEM_SIZE) / 2;

const CircularCarousel = ({ items }) => {
  const scrollX = useRef(new Animated.Value(0)).current;

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 1) * ITEM_SIZE,
      index * ITEM_SIZE,
      (index + 1) * ITEM_SIZE,
    ];

    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [ITEM_SIZE * 0.2, 0, -ITEM_SIZE * 0.2],
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: "clamp",
    });

    const rotateY = scrollX.interpolate({
      inputRange,
      outputRange: ["30deg", "0deg", "-30deg"],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.itemWrapper}>
        <Animated.View
          style={[
            styles.card,
            {
              opacity,
              transform: [
                { perspective: 1000 },
                { translateX },
                { scale },
                { rotateY },
              ],
            },
          ]}
        >
          <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.itemImage} />
          </View>
          <View style={styles.content}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text numberOfLines={3} style={styles.itemDesc}>{item.desc}</Text>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.FlatList
        data={items}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        contentContainerStyle={styles.flatListContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        renderItem={renderItem}
        scrollEventThrottle={16}
      />
      
      <View style={styles.hintContainer}>
        <Text style={styles.hintText}>Desliza para explorar</Text>
        <View style={styles.dotsRow}>
          {items.map((_, i) => {
            const opacity = scrollX.interpolate({
              inputRange: [(i - 1) * ITEM_SIZE, i * ITEM_SIZE, (i + 1) * ITEM_SIZE],
              outputRange: [0.3, 1, 0.3],
              extrapolate: "clamp",
            });
            const scale = scrollX.interpolate({
              inputRange: [(i - 1) * ITEM_SIZE, i * ITEM_SIZE, (i + 1) * ITEM_SIZE],
              outputRange: [1, 1.5, 1],
              extrapolate: "clamp",
            });
            return <Animated.View key={i} style={[styles.dot, { opacity, transform: [{ scale }] }]} />;
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_SIZE * 1.5,
    marginVertical: 20,
  },
  flatListContent: {
    paddingHorizontal: ITEM_SPACING,
    alignItems: "center",
  },
  itemWrapper: {
    width: ITEM_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: ITEM_SIZE * 0.9,
    height: ITEM_SIZE * 1.2,
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  imageContainer: {
    width: "100%",
    height: "60%",
    backgroundColor: "#f8f9fa",
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  itemImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  itemDesc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "justify",
  },
  hintContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  hintText: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
    marginHorizontal: 4,
  },
});

export default CircularCarousel;
