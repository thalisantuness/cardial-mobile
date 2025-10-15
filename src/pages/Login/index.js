import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useContextProvider } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const navigation = useNavigation();
  const {
    loading,
    setLoading,
    login,
    setIsAuth,
  } = useContextProvider();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const onChangeEmailHandler = (email) => setEmail(email);
  const onChangeSenhaHandler = (senha) => setSenha(senha);

  const handleLogin = async () => {
    if (!email || !senha) {
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Email e senha são obrigatórios",
      });
      return;
    }

    console.log("Tentando login com:", { email, senha });

    try {
      setLoading(true);
      await login(email, senha);

    } catch (err) {
      console.error("Erro completo:", err);
      console.error("Resposta do erro:", err.response?.data);
      const errorMessage = err.response?.data?.error || err.message || "Erro ao fazer login.";
      Toast.show({
        type: "error",
        text1: "Login falhou",
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPress = () => navigation.navigate("ChooseRegister");

  useEffect(() => {
    const loadCredentials = async () => {
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedPassword = await AsyncStorage.getItem("userPassword");
      if (storedEmail && storedPassword) {
        setEmail(storedEmail);
        setSenha(storedPassword);
      }
    };
    loadCredentials();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Bem vindo! Fico feliz em vê-lo novamente
      </Text>
      <View style={styles.inputField}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={onChangeEmailHandler}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputField}>
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry={showPassword}
          value={senha}
          onChangeText={onChangeSenhaHandler}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <Ionicons name="eye-off" size={24} color="black" />
          ) : (
            <Ionicons name="eye" size={24} color="black" />
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={styles.register}>Não tem uma conta? </Text>
      <TouchableOpacity
        style={styles.linkregister}
        onPress={handleRegisterPress}
      >
        <Text style={styles.register2}>Cadastre-se agora</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
}