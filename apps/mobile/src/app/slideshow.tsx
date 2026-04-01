import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVoice } from '../hooks/useVoice';
import { colors } from '../constants/theme';

const SLIDE_DURATION = 8000; // 8 seconds per slide

interface PhotoSlide {
  label: string;
  date: string;
  color: string;
  memory: string;
}

const DEMO_PHOTOS: PhotoSlide[] = [
  { label: 'Our Wedding Day', date: 'June 1975', color: '#E8D5B7', memory: 'You and Robert got married at St. Mary\'s Church.' },
  { label: 'Baby Lisa', date: '1978', color: '#B7D5E8', memory: 'Lisa was born on a snowy December morning.' },
  { label: 'Christmas Morning', date: '1985', color: '#D5E8B7', memory: 'The year Lisa got her first bicycle.' },
  { label: 'Teaching Award', date: '1990', color: '#E8B7D5', memory: 'You won Teacher of the Year at Westfield Primary.' },
  { label: 'Family Reunion', date: '2010', color: '#B7E8D5', memory: 'Everyone gathered at the lake house.' },
  { label: 'Emma\'s Birthday', date: '2020', color: '#D5B7E8', memory: 'Emma turned 8. She loves drawing.' },
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SlideshowScreen() {
  const router = useRouter();
  const { speak, stop: stopSpeaking } = useVoice();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const currentSlide = DEMO_PHOTOS[currentIndex];

  const startProgress = useCallback(() => {
    progressAnim.setValue(0);
    const anim = Animated.timing(progressAnim, {
      toValue: 1,
      duration: SLIDE_DURATION,
      useNativeDriver: false,
    });
    animRef.current = anim;
    anim.start(({ finished }) => {
      if (finished) {
        goToNext();
      }
    });
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % DEMO_PHOTOS.length);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + DEMO_PHOTOS.length) % DEMO_PHOTOS.length);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  // Speak memory when slide changes
  useEffect(() => {
    speak(currentSlide.memory);
  }, [currentIndex]);

  // Handle auto-advance and progress bar
  useEffect(() => {
    if (isPaused) {
      animRef.current?.stop();
      return;
    }

    startProgress();

    return () => {
      animRef.current?.stop();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [currentIndex, isPaused, startProgress]);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Memory Slideshow</Text>
        <Text style={styles.slideCounter}>
          {currentIndex + 1} of {DEMO_PHOTOS.length}
        </Text>
      </View>

      {/* Photo Card */}
      <View style={styles.slideContainer}>
        <View style={[styles.photoCard, { backgroundColor: currentSlide.color }]}>
          <Text style={styles.photoLabel}>{currentSlide.label}</Text>
          <Text style={styles.photoDate}>{currentSlide.date}</Text>
        </View>

        {/* Memory Description */}
        <View style={styles.memoryContainer}>
          <Text style={styles.memoryText}>{currentSlide.memory}</Text>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={goToPrevious} style={styles.navButton}>
          <Text style={styles.navButtonText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePause} style={styles.pauseButton}>
          <Text style={styles.pauseButtonText}>
            {isPaused ? 'Play' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNext} style={styles.navButton}>
          <Text style={styles.navButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <Animated.View
          style={[styles.progressBar, { width: progressWidth }]}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 17,
    color: '#1A7BC4',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A2B3C',
  },
  slideCounter: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  slideContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCard: {
    width: SCREEN_WIDTH - 48,
    aspectRatio: 1,
    maxHeight: 400,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  photoLabel: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A2B3C',
    textAlign: 'center',
    marginBottom: 8,
  },
  photoDate: {
    fontSize: 20,
    color: '#4A5568',
    fontWeight: '500',
  },
  memoryContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  memoryText: {
    fontSize: 22,
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '400',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  navButton: {
    minWidth: 120,
    height: 80,
    backgroundColor: '#E2E8F0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A2B3C',
  },
  pauseButton: {
    minWidth: 100,
    height: 80,
    backgroundColor: '#1A7BC4',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pauseButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1A7BC4',
    borderRadius: 3,
  },
});
