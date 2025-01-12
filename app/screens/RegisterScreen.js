import React, { useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { phoneNoValidator } from "../helpers/phoneNoValidator";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RECAPTCHA_SECRET_KEY, RECAPTCHA_SITE_KEY, API_BASE_URL } from "../core/config";

const REGISTER_API_URL = API_BASE_URL + "api/register";
const LOGIN_API_URL = API_BASE_URL + "api/login";

export default function RegisterScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [phone, setPhone] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const phoneError = phoneNoValidator(phone.value);

    if (emailError || passwordError || nameError || phoneError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setPhone({ ...phone, error: phoneError });
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.value,
        email: email.value,
        password: password.value,
        phoneno: phone.value,
      };

      const registerResponse = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await registerResponse.json();

      if (registerResponse.ok) {
        // Registration success, proceed to login
        setTimeout(async () => {

          try {
            const loginResponse = await fetch(LOGIN_API_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: email.value,
                password: password.value,
                role: "user"
              }),
            });

            const result = await loginResponse.json();

            if (loginResponse.ok) {
              await AsyncStorage.setItem("user", JSON.stringify(result.user)); // Store user data

              navigation.reset({
                index: 0,
                routes: [{ name: "HomeScreen" }],
              });
            } else {
              Alert.alert("Login Failed", result.message || "Invalid credentials.");
            }
          } catch (error) {
            console.log("🚀 ~ setTimeout ~ error:", error)
            Alert.alert("Error", "Login error occurred. Please try again.");
          } finally {
            setLoading(false);
          }

        }, 2000)
      } else {
        Alert.alert("Registration Failed", data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      Alert.alert("Error", "Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }

  };

  const onRecaptchaError = () => {
    Alert.alert("Verification Failed", "Please complete the reCAPTCHA.");
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome to SkyLander</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Phone Number"
        returnKeyType="next"
        value={phone.value}
        onChangeText={(text) => setPhone({ value: text, error: "" })}
        error={!!phone.error}
        errorText={phone.error}
        keyboardType="phone-pad"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </Button>
      <View style={styles.row}>
        <Text>I already have an account!</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>

    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
