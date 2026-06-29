import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppHeader } from './AppHeader';
import { InputField } from './InputField';
import { PrimaryButton } from './PrimaryButton';
import { Screen } from './Screen';
import { getWalletPasscode, isValidWalletPasscode, saveWalletPasscode, verifyWalletPasscode } from '../utils/walletSecurity';
import { RADIUS, SHADOWS } from '../constants/theme';

export function WalletPasscodeGate({ children }) {
  const { colors } = useTheme();
  const [checking, setChecking] = useState(true);
  const [hasPasscode, setHasPasscode] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [confirmPasscode, setConfirmPasscode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    const checkPasscode = async () => {
      try {
        const stored = await getWalletPasscode();
        if (!mounted) return;
        setHasPasscode(Boolean(stored));
      } catch (storageError) {
        console.error('Error loading wallet passcode:', storageError);
        if (mounted) setError('Wallet privacy could not be loaded. Please try again.');
      } finally {
        if (mounted) setChecking(false);
      }
    };
    checkPasscode();
    return () => {
      mounted = false;
    };
  }, []);

  const clearError = () => {
    if (error) setError('');
  };

  const handleSubmit = async () => {
    const normalizedPasscode = passcode.trim();
    clearError();

    if (!isValidWalletPasscode(normalizedPasscode)) {
      setError('Enter a 4 to 8 digit wallet passcode.');
      return;
    }

    if (!hasPasscode && normalizedPasscode !== confirmPasscode.trim()) {
      setError('Passcodes do not match.');
      return;
    }

    setSubmitting(true);
    try {
      if (hasPasscode) {
        const valid = await verifyWalletPasscode(normalizedPasscode);
        if (!valid) {
          setError('Incorrect passcode. Wallet remains locked.');
          return;
        }
      } else {
        await saveWalletPasscode(normalizedPasscode);
        setHasPasscode(true);
      }
      setPasscode('');
      setConfirmPasscode('');
      setUnlocked(true);
    } catch (submitError) {
      console.error('Wallet passcode error:', submitError);
      setError(submitError.message || 'Wallet could not be unlocked. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (unlocked) return children;

  return (
    <Screen scroll={false}>
      <View style={styles.headerWrap}>
        <AppHeader title="Wallet" />
      </View>
      <KeyboardAvoidingView
        style={styles.sheetHost}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={12}
      >
        <View style={styles.sheetSpacer} />
        <View style={[styles.sheet, { backgroundColor: colors.white, borderColor: colors.borderLight }]}>
          <View style={[styles.sheetHandle, { backgroundColor: colors.borderLight }]} />
          <View style={styles.sheetHeader}>
            <View style={[styles.iconWrap, { backgroundColor: colors.accentLight.wallet, borderColor: colors.borderLight }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.wallet} />
            </View>
            <View style={styles.sheetCopy}>
              <Text style={[styles.eyebrow, { color: colors.wallet }]}>Private Wallet</Text>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {hasPasscode ? 'Unlock your wallet' : 'Create wallet passcode'}
              </Text>
              <Text style={[styles.body, { color: colors.textSecondary }]}>
                {hasPasscode
                  ? 'Enter your passcode to view balances, accounts, and transaction history.'
                  : 'Set a short passcode before viewing financial information.'}
              </Text>
            </View>
          </View>

          {checking ? (
            <View style={[styles.loaderRow, { backgroundColor: colors.surface, borderColor: colors.borderLight }]}>
              <ActivityIndicator color={colors.wallet} />
              <Text style={[styles.body, { color: colors.textSecondary }]}>Checking wallet privacy...</Text>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                {hasPasscode ? 'Passcode' : 'New passcode'}
              </Text>
              <InputField
                value={passcode}
                onChangeText={(value) => {
                  setPasscode(value);
                  clearError();
                }}
                placeholder={hasPasscode ? 'Wallet passcode' : 'Create passcode'}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={8}
                autoCapitalize="none"
                autoCorrect={false}
                style={[styles.passcodeInput, { backgroundColor: colors.surface }]}
              />
              {!hasPasscode ? (
                <>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Confirm passcode</Text>
                  <InputField
                    value={confirmPasscode}
                    onChangeText={(value) => {
                      setConfirmPasscode(value);
                      clearError();
                    }}
                    placeholder="Confirm passcode"
                    keyboardType="number-pad"
                    secureTextEntry
                    maxLength={8}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={[styles.passcodeInput, { backgroundColor: colors.surface }]}
                  />
                </>
              ) : null}
              {error ? (
                <View style={[styles.errorBox, { backgroundColor: colors.dangerBg, borderColor: colors.borderLight }]}>
                  <Ionicons name="alert-circle-outline" size={15} color={colors.danger} />
                  <Text selectable style={[styles.error, { color: colors.danger }]}>{error}</Text>
                </View>
              ) : null}
              <PrimaryButton
                title={hasPasscode ? 'Unlock Wallet' : 'Save Passcode'}
                color={colors.wallet}
                onPress={handleSubmit}
                disabled={submitting}
                icon={<Ionicons name={hasPasscode ? 'key-outline' : 'shield-checkmark-outline'} size={18} />}
              />
              <Text style={[styles.footerNote, { color: colors.textHint }]}>
                Wallet details stay hidden until this passcode is verified.
              </Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerWrap: {
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  sheetHost: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
  },
  sheetSpacer: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    borderWidth: 1,
    borderBottomWidth: 0,
    gap: 18,
    maxHeight: '82%',
    padding: 20,
    paddingBottom: 24,
    ...SHADOWS.subtle,
  },
  sheetHandle: {
    alignSelf: 'center',
    borderRadius: RADIUS.pill,
    height: 4,
    marginBottom: 2,
    width: 38,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  sheetCopy: {
    flex: 1,
    gap: 4,
  },
  iconWrap: {
    alignItems: 'center',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
  },
  loaderRow: {
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 14,
  },
  form: {
    gap: 9,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7,
    marginLeft: 2,
    textTransform: 'uppercase',
  },
  passcodeInput: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 1.8,
    textAlign: 'center',
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
  error: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  footerNote: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 15,
    textAlign: 'center',
  },
});
