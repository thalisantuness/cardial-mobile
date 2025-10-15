import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useContextProvider } from "../../context/AuthContext";

const ScheduleDetails = ({ route }) => {
  const { schedule_id } = route.params;
  const navigation = useNavigation();
  const { user } = useContextProvider();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Dados mockados
  const mockScheduleDetails = {
    "1": {
      id: "1",
      title: "Entrega de Eletrônicos",
      description: "Entrega de notebooks e tablets para escritório",
      status: "agendado",
      date: "2024-01-15 14:30:00",
      client: "João Silva",
      client_phone: "(11) 99999-9999",
      driver: "Carlos Santos",
      driver_phone: "(11) 88888-8888",
      value: 150.00,
      address: "Rua das Flores, 123 - Centro, São Paulo - SP",
      notes: "Produtos frágeis, manusear com cuidado",
      vehicle: "Fiorino",
      distance: "15 km",
      weight: "50 kg"
    },
    "2": {
      id: "2",
      title: "Mudança Residencial",
      description: "Mudança completa do apartamento",
      status: "em_andamento",
      date: "2024-01-16 09:00:00",
      client: "Maria Oliveira",
      client_phone: "(11) 97777-7777",
      driver: "Pedro Costa",
      driver_phone: "(11) 86666-6666",
      value: 450.00,
      address: "Av. Principal, 456 - Jardim, São Paulo - SP",
      notes: "Elevador disponível até 18h",
      vehicle: "Caminhão Médio",
      distance: "8 km",
      weight: "800 kg"
    }
  };

  const fetchScheduleDetails = async () => {
    try {
      setLoading(true);
      // Simulando chamada API
      setTimeout(() => {
        const scheduleData = mockScheduleDetails[schedule_id];
        setSchedule(scheduleData);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error("Erro ao buscar detalhes do agendamento:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do agendamento");
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchScheduleDetails();
    });
    return unsubscribe;
  }, [navigation, schedule_id]);

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este agendamento?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              // Simulando exclusão
              setTimeout(() => {
                Alert.alert("Sucesso", "Agendamento excluído com sucesso");
                navigation.goBack();
              }, 500);
            } catch (error) {
              console.error("Erro ao excluir agendamento:", error);
              Alert.alert("Erro", "Não foi possível excluir o agendamento");
            }
          },
        },
      ]
    );
    setModalVisible(false);
  };

  const handleCancel = async () => {
    try {
      // Simulando cancelamento
      setTimeout(() => {
        Alert.alert("Sucesso", "Agendamento cancelado com sucesso");
        fetchScheduleDetails(); // Recarrega os dados
      }, 500);
    } catch (error) {
      console.error("Erro ao cancelar agendamento:", error);
      Alert.alert("Erro", "Não foi possível cancelar o agendamento");
    }
  };

  const handleComplete = async () => {
    try {
      // Simulando conclusão
      setTimeout(() => {
        Alert.alert("Sucesso", "Agendamento marcado como concluído");
        fetchScheduleDetails(); // Recarrega os dados
      }, 500);
    } catch (error) {
      console.error("Erro ao concluir agendamento:", error);
      Alert.alert("Erro", "Não foi possível concluir o agendamento");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (!schedule) {
    return (
      <View style={styles.container}>
        <Text>Não foi possível carregar os detalhes do agendamento</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.navigate("Schedules")}
          >
            <Feather name="arrow-left" size={16} color="black" />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.pageTitle}>Detalhes do Agendamento</Text>

        <View style={styles.detailCard}>
          <View style={styles.row}>
            <Text style={styles.label}>Título:</Text>
            <Text style={styles.value}>{schedule.title}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(schedule.status) }]}>
              <Text style={styles.statusText}>{getStatusText(schedule.status)}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Data agendada:</Text>
            <Text style={styles.value}>{formatDate(schedule.date)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Valor:</Text>
            <Text style={[styles.value, { fontWeight: 'bold', color: '#FF6B35' }]}>
              R$ {schedule.value.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Cliente</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              <Text style={{ fontWeight: 'bold' }}>Nome:</Text> {schedule.client}
            </Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontWeight: 'bold' }}>Telefone:</Text> {schedule.client_phone}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações do Motorista</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              <Text style={{ fontWeight: 'bold' }}>Nome:</Text> {schedule.driver}
            </Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontWeight: 'bold' }}>Telefone:</Text> {schedule.driver_phone}
            </Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontWeight: 'bold' }}>Veículo:</Text> {schedule.vehicle}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalhes do Serviço</Text>
          <View style={styles.sectionContent}>
            <Text style={styles.sectionText}>
              <Text style={{ fontWeight: 'bold' }}>Descrição:</Text> {schedule.description}
            </Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontWeight: 'bold' }}>Endereço:</Text> {schedule.address}
            </Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontWeight: 'bold' }}>Distância:</Text> {schedule.distance}
            </Text>
            <Text style={styles.sectionText}>
              <Text style={{ fontWeight: 'bold' }}>Peso:</Text> {schedule.weight}
            </Text>
            {schedule.notes && (
              <Text style={styles.sectionText}>
                <Text style={{ fontWeight: 'bold' }}>Observações:</Text> {schedule.notes}
              </Text>
            )}
          </View>
        </View>

        {canManageSchedules && (
          <View style={styles.actionsContainer}>
            {schedule.status === "agendado" && (
              <>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => navigation.navigate("EditarAgendamento", { schedule_id: schedule.id })}
                >
                  <Feather name="edit" size={16} color="white" />
                  <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.completeButton]}
                  onPress={handleComplete}
                >
                  <Feather name="check" size={16} color="white" />
                  <Text style={styles.actionButtonText}>Concluir</Text>
                </TouchableOpacity>
              </>
            )}

            {schedule.status !== "cancelado" && schedule.status !== "concluido" && (
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Feather name="x" size={16} color="white" />
                <Text style={styles.actionButtonText}>Cancelar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => setModalVisible(true)}
            >
              <Feather name="trash-2" size={16} color="white" />
              <Text style={styles.actionButtonText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal de confirmação de exclusão */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Confirmar exclusão</Text>
              <Text style={styles.modalText}>Tem certeza que deseja excluir este agendamento?</Text>
              
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelModalButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmModalButton]}
                  onPress={handleDelete}
                >
                  <Text style={styles.modalButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

export default ScheduleDetails;