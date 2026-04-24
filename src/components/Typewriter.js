import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Typewriter = ({ 
  words, 
  speed = 100, 
  delayBetweenWords = 2000, 
  cursor = true, 
  cursorChar = "|",
  style,
  loop = true
}) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  const currentWord = words[wordIndex];

  useEffect(() => {
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentWord.length) {
            setDisplayText(currentWord.substring(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          } else {
            if (loop || wordIndex < words.length - 1) {
              setTimeout(() => {
                setIsDeleting(true);
              }, delayBetweenWords);
            }
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(currentWord.substring(0, charIndex - 1));
            setCharIndex(charIndex - 1);
          } else {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [charIndex, currentWord, isDeleting, speed, delayBetweenWords, wordIndex, words, loop]);

  useEffect(() => {
    if (!cursor) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, [cursor]);

  return (
    <View style={styles.container}>
      <Text style={style}>
        {displayText}
        {cursor && (
          <Text style={[style, { opacity: showCursor ? 1 : 0 }]}>
            {cursorChar}
          </Text>
        )}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Typewriter;
