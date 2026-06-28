import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppHeader } from '../components/AppHeader';
import { PrimaryButton } from '../components/PrimaryButton';
import { Screen } from '../components/Screen';
import { RADIUS, SHADOWS } from '../constants/theme';
import { getAuthErrorMessage, isValidEmail, loginWithCredentials, sendPasswordReset, signUpWithCredentials } from '../utils/auth';

export default function Login({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return 'Enter your email address.';
    }
    if (!isValidEmail(trimmedEmail)) {
      return 'Enter a valid email address.';
    }
    if (!password) {
      return 'Enter your password.';
    }
    return '';
  };

  const handleLogin = async () => {
    const validationError = validate();
    setError(validationError);
    if (validationError || loading) return;

    setLoading(true);
    try {
      await loginWithCredentials({ email, password });
      setPassword('');
      navigation.navigate('Main', { screen: 'HomeTab' });
    } catch (loginError) {
      setError(getAuthErrorMessage(loginError));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setError('Enter your email address first.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(trimmedEmail);
      Alert.alert('Password reset sent', 'Check your email for the reset link.');
    } catch (resetError) {
      setError(getAuthErrorMessage(resetError));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    const validationError = validate();
    setError(validationError);
    if (validationError || loading) return;

    setLoading(true);
    try {
      await signUpWithCredentials({ email, password });
      setPassword('');
      navigation.navigate('Main', { screen: 'HomeTab' });
    } catch (signUpError) {
      setError(getAuthErrorMessage(signUpError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen contentStyle={styles.screenContent}>
      <AppHeader title="Login" onBack={() => navigation.navigate('Main')} />

      <View style={[styles.card, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
        <View style={styles.headerBlock}>
          <View style={[styles.iconWrap, { backgroundColor: colors.accentLight.health, borderColor: colors.borderLight }]}>
            <Ionicons name="person-circle-outline" size={28} color={colors.health} />
          </View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome back</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in with Firebase Auth to keep your Lifio account ready across sessions.
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <View style={[styles.inputShell, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="mail-outline" size={18} color={colors.textHint} />
              <TextInput
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  if (error) setError('');
                }}
                placeholder="you@example.com"
                placeholderTextColor={colors.textHint}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                textContentType="username"
                style={[styles.input, { color: colors.textPrimary }]}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
            <View style={[styles.inputShell, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textHint} />
              <TextInput
                value={password}
                onChangeText={(value) => {
                  setPassword(value);
                  if (error) setError('');
                }}
                placeholder="Password"
                placeholderTextColor={colors.textHint}
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry={!showPassword}
                textContentType="password"
                style={[styles.input, { color: colors.textPrimary }]}
              />
              <Pressable
                onPress={() => setShowPassword((current) => !current)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
              >
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.dangerBg, borderColor: colors.borderLight }]}>
              <Ionicons name="alert-circle-outline" size={15} color={colors.danger} />
              <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
            </View>
          ) : null}

          <PrimaryButton
            title={loading ? 'Signing In...' : 'Log In'}
            color={colors.health}
            onPress={handleLogin}
            disabled={loading}
            icon={<Ionicons name="log-in-outline" size={18} />}
          />
        </View>

        <View style={styles.linksRow}>
          <Pressable onPress={handlePasswordReset} hitSlop={8} disabled={loading}>
            <Text style={[styles.linkText, { color: colors.health }]}>Forgot Password?</Text>
          </Pressable>
          <Pressable onPress={handleSignUp} hitSlop={8} disabled={loading}>
            <Text style={[styles.linkText, { color: colors.health }]}>Sign up</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flexGrow: 1,
  },
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    gap: 20,
    padding: 20,
    ...SHADOWS.subtle,
  },
  headerBlock: {
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    maxWidth: 280,
    textAlign: 'center',
  },
  form: {
    gap: 12,
  },
  fieldGroup: {
    gap: 7,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  inputShell: {
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    minHeight: 50,
  },
  errorBox: {
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '800',
  },
});
