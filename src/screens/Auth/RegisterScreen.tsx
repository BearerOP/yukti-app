// src/screens/Auth/RegisterScreen.tsx
import { registerUser } from '@/src/store/slices/authSlice';
import { AppDispatch, RootState } from '@/src/store/store';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
} from 'react-native';
import { Button, Headline, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, email, phone, password, confirmPassword } = formData;

    if (!fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!phone.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }

    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ''))) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number');
      return false;
    }

    if (!password) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const { fullName, email, phone, password } = formData;
      await dispatch(registerUser({ fullName, email, phone, password })).unwrap();
      
      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully! Please check your phone for OTP verification.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login' as never),
          },
        ]
      );
    } catch (err) {
      console.log('Registration Failed', err);
      Alert.alert('Registration Failed', error || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Header with Blur */}
      <View style={styles.headerContainer}>
        <BlurView intensity={30} tint="dark" style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <View style={{ width: 40 }} />
        </BlurView>
      </View>

      <ScrollView
        contentContainerStyle={styles.registerScrollContent}
        keyboardShouldPersistTaps="handled">
        <View style={styles.registerWelcome}>
          <Text style={styles.registerWelcomeTitle}>Welcome! 👋</Text>
          <Text style={styles.registerWelcomeSubtitle}>
            Join thousands trading on opinions
          </Text>
        </View>

        {/* Input Fields */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="account" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={formData.fullName}
              onChangeText={(text) => handleInputChange('fullName', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="email" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="phone" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="lock" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#999" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <Icon name="lock-check" size={20} color="#999" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Error Message */}
        {error && <Text style={styles.error}>{error}</Text>}

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleRegister}
          disabled={isLoading}
          activeOpacity={0.8}>
          <Text style={styles.registerButtonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginLinkText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.termsText}>
          By creating an account, you agree to our{'\n'}
          <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'rgba(10, 10, 10, 0.7)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'AbrilFatface_400Regular',
  },
  registerScrollContent: {
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  registerWelcome: {
    marginBottom: 32,
  },
  registerWelcomeTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  registerWelcomeSubtitle: {
    fontSize: 16,
    color: '#999',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
  },
  registerButton: {
    backgroundColor: '#6200ee',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#999',
  },
  loginLink: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#6200ee',
    fontWeight: '600',
  },
  error: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
});