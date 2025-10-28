import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput as RNTextInput,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '@/src/store/slices/authSlice';
import { RootState, AppDispatch } from '@/src/store/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  // Yukti Logo Icon Component
  const YuktiIcon = () => (
    <Svg width="30" height="30" viewBox="0 0 40 40" fill="none">
      <Path
        d="M20 5L25 15L35 20L25 25L20 35L15 25L5 20L15 15L20 5Z"
        fill="#6EE7B7"
        fillOpacity="0.9"
      />
    </Svg>
  );

  const handleSocialLogin = (provider: string) => {
    Alert.alert(`${provider} Login`, 'Social login coming soon!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      
      {/* Top Section - Dark Green Background with Logo */}
      <LinearGradient
        colors={['#1A362C', '#2C5C4A']}
        style={styles.topSection}>
        <View style={styles.logoContainer}>
          <YuktiIcon />
          <Text style={styles.logoText}>yukti</Text>
        </View>
      </LinearGradient>

      {/* Bottom Section - White Card */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        
        {/* White Content Card */}
        <View style={styles.card}>
          {/* Logo Icon in Card */}
          <View style={styles.cardLogoContainer}>
            <View style={styles.cardLogo}>
              <YuktiIcon />
            </View>
            <Text style={styles.cardTitle}>Get Started</Text>
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Google')}
              activeOpacity={0.9}>
              <LinearGradient
                colors={['#34D399', '#10B981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.socialGradient}>
                <Icon name="google" size={18} color="#fff" />
                <Text style={styles.socialButtonText}>Google</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('Github')}
              activeOpacity={0.9}>
              <LinearGradient
                colors={['#34D399', '#10B981']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.socialGradient}>
                <Icon name="github" size={18} color="#fff" />
                <Text style={styles.socialButtonText}>Github</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <RNTextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#A0A0A0"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={styles.input}
            />

            <View style={styles.passwordContainer}>
              <RNTextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#A0A0A0"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                style={[styles.input, styles.passwordInput]}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}>
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.9}>
            <LinearGradient
              colors={['#34D399', '#10B981']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.submitGradient}>
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Signing in...' : 'Get Started'}
              </Text>
              <Icon name="arrow-right" size={18} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer Text */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text 
                style={styles.footerLink}
                onPress={() => navigation.navigate('Register' as never)}>
                Register
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    letterSpacing: -0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 32,
    padding: 28,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  cardLogoContainer: {
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardLogo: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  socialGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: '#000000',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 18,
    padding: 4,
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footerContainer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#A0A0A0',
  },
  footerLink: {
    color: '#34D399',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
