import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  ScrollView,
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
      const formattedSchedules = data.map(agendamento => {
        const servico = agendamento.Servico || {};
        const empresa = servico.Empresa || {};
        const cliente = agendamento.Cliente || {};
        const observacao = agendamento.observacao || "";

        return {
          id: agendamento.agendamento_id?.toString(),
          agendamento_id: agendamento.agendamento_id,

          // Cliente
          cliente_nome: cliente.nome || "Cliente não informado",
          cliente_email: cliente.email || "-",
          cliente_role: cliente.role || "-",

          // Profissional / Empresa
          profissional_nome: empresa.nome || "Profissional não informado",
          profissional_email: empresa.email || "-",
          profissional_role: empresa.role || "-",

          // Serviço
          service: servico.nome || "Serviço não informado",
          servico_foto: servico.foto_principal,
          servico_valor: servico.valor || 0,
          servico_descricao: servico.descricao || "Sem descrição",
          servico_duracao: servico.duracao || "Não informada",
          servico_categoria: servico.categoria || "Sem categoria",

          // Agendamento
          date: agendamento.dia_marcado,
          time: new Date(agendamento.dia_marcado).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: agendamento.status,
          observacao: observacao || "Sem observações",
          data_cadastro: agendamento.data_cadastro,
          data_update: agendamento.data_update,
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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "agendado":
        return "#3182CE";
      case "confirmado":
        return "#38A169";
      case "cancelado":
        return "#E53E3E";
      default:
        return "#9E9E9E";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "agendado":
        return "AGENDADO";
      case "confirmado":
        return "CONFIRMADO";
      case "cancelado":
        return "CANCELADO";
      default:
        return status.toUpperCase();
    }
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      cliente: "Cliente",
      empresa: "Empresa",
      admin: "Administrador",
      motorista: "Motorista"
    };
    return roleLabels[role] || role;
  };

  const canManageSchedules = user?.role === 'motorista' || user?.role === 'admin';

  const renderScheduleCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("DetalhesAgendamento", {
          schedule_id: item.id,
        })
      }
    >
      {/* Header com ID e Status */}
      <View style={styles.cardHeader}>
        <View style={styles.idContainer}>
          <Text style={styles.idText}>{item.service}</Text>
          
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      {/* Imagem do Serviço */}
      {item.servico_foto && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.servico_foto }} 
            style={styles.serviceImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Informações do Serviço */}
      <View style={styles.serviceInfo}>
        <View style={styles.valueContainer}>
          <Feather name="dollar-sign" size={16} color="#38A169" />
        <Text style={styles.valueText}>{formatCurrency(item.servico_valor)}</Text>

        </View>
        
        {item.servico_categoria && item.servico_categoria !== "Sem categoria" && (
          <View style={styles.categoryContainer}>
            <Feather name="tag" size={14} color="#805AD5" />
            <Text style={styles.categoryText}>{item.servico_categoria}</Text>
          </View>
        )}
        
        {item.servico_duracao && item.servico_duracao !== "Não informada" && (
          <View style={styles.durationContainer}>
            <Feather name="clock" size={14} color="#3182CE" />
            <Text style={styles.durationText}>{item.servico_duracao}</Text>
          </View>
        )}
      </View>

      {/* Informações do Cliente */}
      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Feather name="user" size={16} color="#3182CE" />
          <Text style={styles.sectionTitle}>Cliente</Text>
        </View>
        <Text style={styles.infoText} numberOfLines={1}>
          <Text style={styles.infoLabel}>Nome: </Text>
          {item.cliente_nome}
        </Text>
       
      
       
      </View>

      {/* Informações do Profissional */}
      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Feather name="user-check" size={16} color="#805AD5" />
          <Text style={styles.sectionTitle}>Profissional</Text>
        </View>
        <Text style={styles.infoText} numberOfLines={1}>
          <Text style={styles.infoLabel}>Nome: </Text>
          {item.profissional_nome}
        </Text>
        
      </View>

      {/* Data e Hora */}
      <View style={styles.infoSection}>
        <View style={styles.sectionHeader}>
          <Feather name="calendar" size={16} color="#38A169" />
          <Text style={styles.sectionTitle}>Agendamento</Text>
        </View>
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <Feather name="calendar" size={14} color="#3182CE" />
            <Text style={styles.dateText}>{formatDate(item.date)}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Feather name="clock" size={14} color="#ffffff" />
            <Text style={styles.timeText}>{item.time}</Text>
          </View>
        </View>
      </View>

      {/* Observações */}
      {item.observacao && item.observacao !== "Sem observações" && (
        <View style={styles.notesSection}>
          <View style={styles.sectionHeader}>
            <Feather name="file-text" size={16} color="#D69E2E" />
            <Text style={styles.sectionTitle}>Observações</Text>
          </View>
          <Text style={styles.notesText}>{item.observacao}</Text>
        </View>
      )}

      {/* Footer com Datas */}
      <View style={styles.cardFooter}>
        <Text style={styles.footerText}>
          Cadastro: {formatDateTime(item.data_cadastro)}
        </Text>
        {item.data_update && (
          <Text style={styles.footerText}>
            Atualização: {formatDateTime(item.data_update)}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.servicesButton}
          onPress={() => navigation.navigate("Services")}
        >
          <Feather name="scissors" size={18} color="white" />
          <Text style={styles.servicesButtonText}>Serviços</Text>
        </TouchableOpacity>
        
      
      </View>

      {/* Título da Página */}
      <Text style={styles.pageTitle}>
        {user?.role === 'admin' ? "Todos os Agendamentos" : 
         user?.role === 'motorista' ? "Meus Agendamentos" : "Meus Agendamentos"}
      </Text>

      {/* Conteúdo */}
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#3182CE" />
        ) : schedules.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={64} color="#CBD5E0" />
            <Text style={styles.emptyMessage}>Nenhum agendamento encontrado</Text>
            <Text style={styles.emptySubtext}>
              Quando você agendar serviços, eles aparecerão aqui
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate("NovoAgendamento")}
            >
              <Text style={styles.emptyButtonText}>Fazer Primeiro Agendamento</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={schedules}
            keyExtractor={(item) => String(item.id)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#3182CE"]}
                tintColor="#3182CE"
              />
            }
            showsVerticalScrollIndicator={false}
            renderItem={renderScheduleCard}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
};

export default SchedulesScreen;