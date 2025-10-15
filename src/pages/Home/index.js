import { View, TouchableOpacity, Image, Text, ScrollView, Modal } from "react-native";
import React, {useState} from "react";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useContextProvider } from "../../context/AuthContext"
import { Feather } from '@expo/vector-icons';
import { colors } from "../../colors.js";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation();

  const { userName, setIsAuth, setToken } = useContextProvider();

  function logout() {
    setIsAuth(false);
    setToken("");
  }

  function handleAccept() {
    setModalVisible(false);
  }

  function handleDecline() {
    setIsAuth(false);
    setToken("");
  }

  return (
    <View style={styles.container}>

  

      <View style={styles.firstContainer}>
        <Text style={styles.textheader}>TRUCKAGE APP</Text>
        <TouchableOpacity onPress={logout}>
          <Feather name="log-out" size={25} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.secondContainer}>
        <Text style={styles.title}>Bem-vindo {userName}</Text>
        <Text style={styles.subtitle}>O que você gostaria de fazer hoje?</Text>
      </View>

      <View style={styles.viewWelcome}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeTitle}>Aqui tudo fica mais fácil</Text>
          <Text style={styles.welcomeSubtitle}>Fretes seguros e práticos</Text>
        </View>

        <Image
          source={require("../../../assets/trucker.png")}
          style={styles.imageTrucker}
          resizeMode="contain"
        />
      </View>

      <View style={styles.viewOptions}>
     

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("Fretes")}
        >
          <View style={styles.optionIconContainer}>
            <Feather name="truck" size={32} color={colors.laranjaPrincipal} />
          </View>
          <Text style={styles.optionText}>Fretes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("Solicitacoes")}
        >
          <View style={styles.optionIconContainer}>
            <Feather name="inbox" size={32} color={colors.laranjaPrincipal} />
          </View>
          <Text style={styles.optionText}>Solicitações</Text>
        </TouchableOpacity>

           <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate("Chat")}
        >
          <View style={styles.optionIconContainer}>
            <Feather name="message-circle" size={32} color={colors.laranjaPrincipal} />
          </View>
          <Text style={styles.optionText}>Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}