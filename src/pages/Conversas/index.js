import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContextProvider } from "../../context/AuthContext";
import { getConversas } from "../../services/api";
import styles from "./styles";

export default function ConversasScreen({ navigation }) {
  const { user, userRole } = useContextProvider();
  const [conversas, setConversas] = useState([]);

  const fetchConversas = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await getConversas(token);
      setConversas(response);
    } catch (error) {
      console.error("Erro ao carregar conversas:", error);
    }
  };

  useEffect(() => {
    fetchConversas();
    const unsubscribe = navigation.addListener("focus", fetchConversas);
    return unsubscribe;
  }, [navigation]);

  const renderConversa = (item) => {
    const outroUsuario = item.usuario1_id === user.usuario_id ? item.Usuario2 : item.Usuario1;
    return (
      <TouchableOpacity
        style={styles.conversaItem}
        onPress={() =>
          navigation.navigate("Chat", {
            conversa_id: item.conversa_id,
            frete_id: item.frete_id,
            destinatario: {
              usuario_id: outroUsuario.usuario_id,
              nome_completo: outroUsuario.nome_completo,
              email: outroUsuario.email,
              role: outroUsuario.role,
            },
          })
        }
      >
        <View style={styles.overlay}>
          <Text style={styles.conversaTitle}>
            {outroUsuario.nome_completo || outroUsuario.email}
          </Text>
          <Text style={styles.conversaSubtitle}>
            Última mensagem:{" "}
            {item.ultima_mensagem
              ? new Date(item.ultima_mensagem).toLocaleString()
              : "Sem mensagens"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.firstContainer}>
        <Text style={styles.textheader}>Conversas</Text>
      
      </View>

      <View style={styles.secondContainer}>
        
        <Text style={styles.subtitle}>
          Converse com  {userRole === "motorista" ? "empresas" : "motoristas"} que você tem fretes
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        {conversas.length === 0 ? (
          <Text style={styles.noConversasText}>
            Nenhuma conversa iniciada. Comece uma nova!
          </Text>
        ) : (
          conversas.map((item) => (
            <View key={item.conversa_id.toString()}>
              {renderConversa(item)}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}