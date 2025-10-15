import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import styles from "./styles";

import { Feather } from "@expo/vector-icons";

export default function ChooseRegister() {
  const navigation = useNavigation();

  const handleRegisterTruckerPress = () =>
    navigation.navigate("RegisterTrucker");
  const handleRegisterCompanyPress = () =>
    navigation.navigate("RegisterCompany");

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>
        Escolha uma das opções para se cadastrar
      </Text>

      <View style={styles.chooseSection}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleRegisterTruckerPress}
        >
          <Feather name="truck" size={25} color="white" />
          <Text style={styles.buttonText}>Caminhoneiro</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleRegisterCompanyPress}
        >
          <Feather name="briefcase" size={25} color="white" />
          <Text style={styles.buttonText}>Empresa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
