import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path, G, ClipPath, Defs, Rect } from 'react-native-svg';
import { HorizontalLogo } from '../../components/SVGAssets';

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  illustration: string;
  quote: string;
}

const onboardingData: OnboardingSlide[] = [
  {
    illustration: 'splash-1',
    quote: 'Opinions have odds — make yours count.',
  },
  {
    illustration: 'splash-2',
    quote: 'Predict. Compete. Profit from perspective.',
  },
  {
    illustration: 'splash-3',
    quote: 'Every opinion has value — put yours to work.',
  },
];

const IllustrationComponent = ({ type }: { type: string }) => {
  const illustrationWidth = width * 0.85;
  const illustrationHeight = illustrationWidth * 0.95;
  
  return (
    <View style={{ width: illustrationWidth, height: illustrationHeight, alignItems: 'center', justifyContent: 'center' }}>
      {type === 'splash-1' && (
        <Svg width={illustrationWidth} height={illustrationHeight} viewBox="0 0 277 263" fill="none">
          <Path
            d="M130.127 17.0397C125.194 17.1188 120.278 17.6784 115.446 18.7014C97.3271 22.754 82.3544 35.2282 68.7863 47.9625C57.4374 58.6111 46.2683 70.1244 40.3635 84.5656C34.7171 98.419 34.3576 114.109 27.8235 127.607C23.6885 136.164 17.3173 143.365 12.2497 151.408C3.69867 165.001 -0.683574 182.997 6.9067 197.196C11.2271 205.267 18.8006 211.015 26.3628 216.13C45.7177 229.237 67.0783 240.197 90.1582 243.616C98.9676 244.922 107.901 245.126 116.8 245.555C124.48 245.939 132.245 246.516 139.796 245.075C158.684 241.463 172.994 226.095 190.5 218.103C202.95 212.417 216.771 210.602 229.997 207.194C243.222 203.78 256.745 198.241 265.06 187.304C272.482 177.543 274.561 165.137 275.853 153.228C277.1 141.759 270.117 131.02 265.847 120.474C256.616 97.6786 246.97 74.6122 230.12 56.2937C212.889 37.6643 190.293 24.9244 165.505 19.8544C156.235 18.0797 146.824 17.1358 137.391 17.0397C134.975 16.9945 132.548 16.9775 130.127 17.0453V17.0397Z"
            fill="#30C285"
            opacity="0.18"
          />
          {/* Simplified version of the illustration */}
          <Path d="M111.105 118.426H131.439C132.26 118.424 133.048 118.099 133.629 117.519C134.21 116.94 134.537 116.155 134.538 115.336V95.0641C134.537 94.2451 134.21 93.4599 133.629 92.8808C133.048 92.3016 132.26 91.9757 131.439 91.9746H111.105C110.283 91.9757 109.495 92.3016 108.914 92.8808C108.333 93.4599 108.007 94.2451 108.005 95.0641V115.336C108.007 116.155 108.334 116.94 108.914 117.52C109.495 118.099 110.283 118.424 111.105 118.426Z" fill="#179E66" />
          <Path d="M121.396 87.5248C122.902 87.5248 124.124 86.3073 124.124 84.8054C124.124 83.3035 122.902 82.0859 121.396 82.0859C119.889 82.0859 118.668 83.3035 118.668 84.8054C118.668 86.3073 119.889 87.5248 121.396 87.5248Z" fill="#179E66" />
        </Svg>
      )}
      {type === 'splash-2' && (
        <Svg width={illustrationWidth} height={illustrationHeight} viewBox="0 0 277 263" fill="none">
          <Path
            d="M130.127 17.0397C125.194 17.1188 120.278 17.6784 115.446 18.7014C97.3271 22.754 82.3544 35.2282 68.7863 47.9625C57.4374 58.6111 46.2683 70.1244 40.3635 84.5656C34.7171 98.419 34.3576 114.109 27.8235 127.607C23.6885 136.164 17.3173 143.365 12.2497 151.408C3.69867 165.001 -0.683574 182.997 6.9067 197.196C11.2271 205.267 18.8006 211.015 26.3628 216.13C45.7177 229.237 67.0783 240.197 90.1582 243.616C98.9676 244.922 107.901 245.126 116.8 245.555C124.48 245.939 132.245 246.516 139.796 245.075C158.684 241.463 172.994 226.095 190.5 218.103C202.95 212.417 216.771 210.602 229.997 207.194C243.222 203.78 256.745 198.241 265.06 187.304C272.482 177.543 274.561 165.137 275.853 153.228C277.1 141.759 270.117 131.02 265.847 120.474C256.616 97.6786 246.97 74.6122 230.12 56.2937C212.889 37.6643 190.293 24.9244 165.505 19.8544C156.235 18.0797 146.824 17.1358 137.391 17.0397C134.975 16.9945 132.548 16.9775 130.127 17.0453V17.0397Z"
            fill="#30C285"
            opacity="0.18"
          />
        </Svg>
      )}
      {type === 'splash-3' && (
        <Svg width={illustrationWidth} height={illustrationHeight} viewBox="0 0 289 263" fill="none">
          <Path
            d="M132.127 17.0397C127.194 17.1188 122.278 17.6784 117.446 18.7014C99.3271 22.754 84.3544 35.2282 70.7863 47.9625C59.4374 58.6111 48.2683 70.1244 42.3635 84.5656C36.7171 98.419 36.3576 114.109 29.8235 127.607C25.6885 136.164 19.3173 143.365 14.2497 151.408C5.69867 165.001 1.31643 182.997 8.9067 197.196C13.2271 205.267 20.8006 211.015 28.3628 216.13C47.7177 229.237 69.0783 240.197 92.1582 243.616C100.968 244.922 109.901 245.126 118.8 245.555C126.48 245.939 134.245 246.516 141.796 245.075C160.684 241.463 174.994 226.095 192.5 218.103C204.95 212.417 218.771 210.602 231.997 207.194C245.222 203.78 258.745 198.241 267.06 187.304C274.482 177.543 276.561 165.137 277.853 153.228C279.1 141.759 272.117 131.02 267.847 120.474C258.616 97.6786 248.97 74.6122 232.12 56.2937C214.889 37.6643 192.293 24.9244 167.505 19.8544C158.235 18.0797 148.824 17.1358 139.391 17.0397C136.975 16.9945 134.548 16.9775 132.127 17.0453V17.0397Z"
            fill="#30C285"
            opacity="0.18"
          />
        </Svg>
      )}
    </View>
  );
};

const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Change content
        setCurrentIndex((prev) => (prev + 1) % onboardingData.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleGetStarted = () => {
    navigation.navigate('Register' as never);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <HorizontalLogo width={width * 0.5} height={(width * 0.5) * (98 / 274)} />
      </View>

      {/* Main Content with Fade Animation */}
      <Animated.View
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
          },
        ]}>
        {/* SVG Illustration */}
        <View style={styles.imageContainer}>
          <IllustrationComponent type={onboardingData[currentIndex].illustration} />
        </View>

        {/* Quote */}
        <Text style={styles.quote}>
          {onboardingData[currentIndex].quote}
        </Text>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </Animated.View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
        {/* Get Started Button */}
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started with us</Text>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Footer */}
        <Text style={styles.copyright}>Yukti 2025. All Rights Reserved</Text>
        <TouchableOpacity>
          <Text style={styles.terms}>Terms & Conditions *</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1913',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
  quote: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'serif',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#179E66',
    width: 24,
  },
  inactiveDot: {
    backgroundColor: '#474747',
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#179E66',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#179E66',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  getStartedText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#30C285',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  copyright: {
    color: '#a0a0a0',
    fontSize: 12,
    marginBottom: 8,
  },
  terms: {
    color: '#a0a0a0',
    fontSize: 12,
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen;
