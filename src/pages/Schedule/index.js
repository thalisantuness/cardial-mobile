import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const SchedulesScreen = ({ navigation }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContextProvider();

  // Dados mockados
  const mockSchedules = [
    {
      id: "1",
      title: "Entrega de Eletrônicos",
      description: "Entrega de notebooks e tablets",
      status: "agendado",
      date: "2024-01-15 14:30:00",
      client: "João Silva",
      driver: "Carlos Santos",
      value: 150.00,
      address: "Rua das Flores, 123 - Centro"
    },
    {
      id: "2",
      title: "Mudança Residencial",
      description: "Mudança completa apartamento",
      status: "em_andamento",
      date: "2024-01-16 09:00:00",
      client: "Maria Oliveira",
      driver: "Pedro Costa",
      value: 450.00,
      address: "Av. Principal, 456 - Jardim"
    },
    {
      id: "3",
      title: "Transporte de Móveis",
      description: "Transporte de sofá e mesa",
      status: "concluido",
      date: "2024-01-14 11:00:00",
      client: "Ana Souza",
      driver: "Lucas Lima",
      value: 120.00,
      address: "Rua das Árvores, 789 - Parque"
    },
    {
      id: "4",
      title: "Entrega Rápida Documentos",
      description: "Entrega urgente de documentos",
      status: "cancelado",
      date: "2024-01-17 16:00:00",
      client: "Roberto Alves",
      driver: "Fernando Dias",
      value: 80.00,
      address: "Praça Central, 321 - Centro"
    }
  ];

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      // Simulando chamada API
      setTimeout(() => {
        setSchedules(mockSchedules);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching schedules:", error);
      alert("Erro ao carregar agendamentos.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchSchedules();
    });
    
    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("pt-BR") +
      " " +
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "agendado":
        return "#FFA500";
      case "em_andamento":
        return "#2196F3";
      case "concluido":
        return "#4CAF50";
      case "cancelado":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "agendado":
        return "AGENDADO";
      case "em_andamento":
        return "EM ANDAMENTO";
      case "concluido":
        return "CONCLUÍDO";
      case "cancelado":
        return "CANCELADO";
      default:
        return status.toUpperCase();
    }
  };

  const canManageSchedules = user?.role === 'motorista' || user?.role === 'admin';

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        {canManageSchedules && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("CriarAgendamento")}
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.pageTitle}>
        {user?.role === 'admin' ? "Todos os Agendamentos" : (user?.role === 'motorista' ? "Meus Agendamentos" : "Meus Agendamentos")}
      </Text>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : schedules.length === 0 ? (
          <Text style={styles.emptyMessage}>Nenhum agendamento encontrado</Text>
        ) : (
          <FlatList
            data={schedules}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  navigation.navigate("DetalhesAgendamento", {
                    schedule_id: item.id,
                  })
                }
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.title}>{item.title}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {getStatusText(item.status)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.description}>{item.description}</Text>

                <View style={styles.infoContainer}>
                  <Text style={styles.clientText}>
                    Cliente: {item.client}
                  </Text>
                  <Text style={styles.driverText}>
                    Motorista: {item.driver}
                  </Text>
                </View>

                <View style={styles.dateContainer}>
                  <Feather name="calendar" size={14} color="#385b3e" />
                  <Text style={styles.dateText}>
                    {formatDate(item.date)}
                  </Text>
                </View>

                <View style={styles.valueContainer}>
                  <Text style={styles.valueText}>
                    R$ {item.value.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default SchedulesScreen;