import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";
import { getAgendamentos } from "../../services/api";

const SchedulesScreen = ({ navigation }) => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContextProvider();

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getAgendamentos();
      
      if (Array.isArray(data)) {
        // Mapear dados da API para o formato esperado pelo componente
        const formattedSchedules = data.map(agendamento => {
          // Extrair dados dos objetos relacionados
          // Tudo é Usuario, o role define se é empresa ou cliente
          const servico = agendamento.Servico || {};
          const usuario = agendamento.Usuario || {}; // Usuário que fez o agendamento
          const empresaServico = servico.Usuario || {}; // Empresa dona do serviço (se existir)
          const observacao = agendamento.observacao || "";
          
          // Tentar extrair telefone e observações separadas da observacao
          const parts = observacao.split(' | ');
          const nomeCliente = parts[0] || usuario.nome || "Cliente não informado";
          const telefoneMatch = observacao.match(/Tel:\s*([^|]+)/);
          const telefone = telefoneMatch ? telefoneMatch[1].trim() : "";
          const obsTexto = parts.length > 2 ? parts.slice(2).join(' | ') : "";
          
          return {
            id: agendamento.agendamento_id?.toString(),
            title: servico.nome || `Agendamento #${agendamento.agendamento_id}`,
            description: obsTexto || observacao || "Sem observações",
            status: agendamento.status || "agendado",
            date: agendamento.dia_marcado || new Date().toISOString(),
            client: nomeCliente,
            clientPhone: telefone,
            clientEmail: usuario.email || "",
            clientRole: usuario.role || "",
            service: servico.nome || "Serviço não informado",
            servicoId: agendamento.servico_id,
            value: parseFloat(servico.valor || 0),
            foto_servico: servico.foto_principal || null,
            empresa: empresaServico.nome || "",
            empresaRole: empresaServico.role || "",
            data_cadastro: agendamento.data_cadastro,
            data_update: agendamento.data_update
          };
        });
        
        setSchedules(formattedSchedules);
      }
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      alert("Erro ao carregar agendamentos. Verifique sua conexão.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSchedules();
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
        <TouchableOpacity
          style={styles.servicesButton}
          onPress={() => navigation.navigate("Services")}
        >
          <Feather name="scissors" size={18} color="white" />
          <Text style={styles.servicesButtonText}>Serviços</Text>
        </TouchableOpacity>
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
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={64} color="#CCC" />
            <Text style={styles.emptyMessage}>Nenhum agendamento encontrado</Text>
            <Text style={styles.emptySubtext}>
              Quando você agendar serviços, eles aparecerão aqui
            </Text>
          </View>
        ) : (
          <FlatList
            data={schedules}
            keyExtractor={(item) => String(item.id)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#000000"]}
              />
            }
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

                {item.service && (
                  <View style={styles.serviceContainer}>
                    <Feather name="briefcase" size={14} color="#385b3e" />
                    <Text style={styles.serviceText}>
                      {item.service}
                    </Text>
                  </View>
                )}

                <View style={styles.infoContainer}>
                  <Text style={styles.clientText}>
                    Cliente: {item.client}
                  </Text>
                  {item.clientPhone && (
                    <Text style={styles.phoneText}>
                      Tel: {item.clientPhone}
                    </Text>
                  )}
                  {item.clientEmail && (
                    <Text style={styles.phoneText}>
                      Email: {item.clientEmail}
                    </Text>
                  )}
                </View>

                {item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}

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