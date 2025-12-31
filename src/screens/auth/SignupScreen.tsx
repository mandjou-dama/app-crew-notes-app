import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Eye, EyeClosed, Lock, Mailbox } from "lucide-react-native";
import { KeyboardController } from "react-native-keyboard-controller";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthStackParamList } from "@/types/navigation";
import { COLORS, SPACES } from "@/constant";
import { authService } from "@/services/auth.service";
import Button from "@/components/Button";

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, "Signup">;

export function SignupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [ConfirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords need to be the same.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const { error } = await authService.signUp({
        email: email.trim(),
        password,
        options: {
          // emailRedirectTo: "http://localhost:3000/auth/callback",
        },
      });

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setError("");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 50, paddingBottom: insets.bottom },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback
          onPress={() => KeyboardController.dismiss()}
          style={{ flex: 1 }}
        >
          <View style={styles.content}>
            <View>
              <Text style={styles.title}>Create Account to get started</Text>
              <Text style={styles.subtitle}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
                sapiente aperiam quo exercitationem.
              </Text>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Mailbox color={COLORS.black} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                <View
                  style={[
                    styles.inputContainer,
                    { justifyContent: "space-between", flexDirection: "row" },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Lock color={COLORS.black} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your password"
                      placeholderTextColor="#666"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!passwordVisible}
                    />
                  </View>

                  <Pressable
                    hitSlop={10}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                    style={{ opacity: 0.4 }}
                  >
                    {passwordVisible ? (
                      <Eye size={18} />
                    ) : (
                      <EyeClosed size={18} />
                    )}
                  </Pressable>
                </View>

                <View
                  style={[
                    styles.inputContainer,
                    { justifyContent: "space-between" },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Lock color={COLORS.black} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor="#666"
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      secureTextEntry={!ConfirmPasswordVisible}
                    />
                  </View>

                  <Pressable
                    hitSlop={10}
                    onPress={() =>
                      setConfirmPasswordVisible(!ConfirmPasswordVisible)
                    }
                    style={{ opacity: 0.4 }}
                  >
                    {ConfirmPasswordVisible ? (
                      <Eye size={18} />
                    ) : (
                      <EyeClosed size={18} />
                    )}
                  </Pressable>
                </View>
                {error && <Text style={styles.errorText}>{error}</Text>}
              </View>
            </View>

            <View>
              <Button
                title="Sign Up"
                onPress={handleSignup}
                isLoading={loading}
                disabled={
                  email.length < 5
                    ? true
                    : false || password.length < 8
                    ? true
                    : false || confirmPassword.length < 8
                    ? true
                    : false || loading
                }
              />

              <TouchableOpacity
                onPress={() => navigation.navigate("Login")}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>
                  Already have an account? Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: SPACES.l,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    color: COLORS.black,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.black,
    marginBottom: 32,
    opacity: 0.6,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    height: 50,
    borderWidth: 1,
    borderColor: "#c7c7c7",
    borderRadius: 13,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
    flexDirection: "row",
    borderCurve: "continuous",
    alignItems: "center",
    gap: 8,
  },
  input: {
    fontSize: 16,
    flex: 0.8,
  },
  errorText: {
    color: "red",
    fontSize: 14,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  forgetPassword: {
    marginTop: 0,
  },
  linkButton: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  linkText: {
    color: COLORS.black,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
