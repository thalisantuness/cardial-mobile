import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, TextInput, Modal, FlatList, Text, Image, ActivityIndicator, ScrollView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getServicos, criarAgendamento } from "../../services/api";
import { useContextProvider } from "../../context/AuthContext";
import styles from "./styles";
import { colors } from "../../colors";

export default function Services() {
  const [openModal, setOpenModal] = useState(false);
  const [openAgendamentoModal, setOpenAgendamentoModal] = useState(false);
  const [selectedServico, setSelectedServico] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [servicos, setServicos] = useState([]);
  const [filteredServicos, setFilteredServicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingAgendamento, setCreatingAgendamento] = useState(false);
  const navigation = useNavigation();
  const { user } = useContextProvider();

  // Dados do agendamento
  const [clienteNome, setClienteNome] = useState("");
  const [clienteTelefone, setClienteTelefone] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  // Buscar serviços da API
  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = async () => {
    try {
      setLoading(true);
      const data = await getServicos();
      
      if (Array.isArray(data)) {
        // Validar cada serviço antes de setar
        const servicosValidos = data.map(servico => ({
          ...servico,
          // Garantir que foto_principal seja string ou null
          foto_principal: typeof servico.foto_principal === 'string' ? servico.foto_principal : null
        }));
        
        setServicos(servicosValidos);
        setFilteredServicos(servicosValidos);
      }
    } catch (error) {
      console.error("Erro ao buscar serviços:", error);
      alert("Erro ao carregar serviços. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar serviços pela pesquisa
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredServicos(servicos);
    } else {
      const filtered = servicos.filter(servico =>
        servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.servico_id.toString().includes(searchTerm)
      );
      setFilteredServicos(filtered);
    }
  }, [searchTerm, servicos]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatDateTime = (date) => {
    return date.toLocaleDateString('pt-BR') + ' ' + 
           date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const handleCreateAgendamento = async () => {
    // Validações
    if (!clienteNome.trim()) {
      alert("Por favor, informe o nome do cliente");
      return;
    }
    if (!clienteTelefone.trim()) {
      alert("Por favor, informe o telefone do cliente");
      return;
    }

    try {
      setCreatingAgendamento(true);
      
      // Formato correto esperado pela API (tudo é usuario_id, role define o tipo)
      const agendamentoData = {
        servico_id: selectedServico.servico_id,
        usuario_id: user?.id || user?.usuario_id || 2,
        dia_marcado: dataAgendamento.toISOString(),
        observacao: `${clienteNome} | Tel: ${clienteTelefone}${observacoes ? ' | ' + observacoes : ''}`,
      };

      await criarAgendamento(agendamentoData);
      
      alert("Agendamento criado com sucesso!");
      
      // Limpar formulário
      setClienteNome("");
      setClienteTelefone("");
      setObservacoes("");
      setDataAgendamento(new Date());
      setOpenAgendamentoModal(false);
      
      // Navegar para tela de agendamentos
      navigation.navigate("Schedules");
      
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
      alert("Erro ao criar agendamento. Tente novamente.");
    } finally {
      setCreatingAgendamento(false);
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(dataAgendamento);
      newDate.setFullYear(selectedDate.getFullYear());
      newDate.setMonth(selectedDate.getMonth());
      newDate.setDate(selectedDate.getDate());
      setDataAgendamento(newDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(dataAgendamento);
      newDate.setHours(selectedTime.getHours());
      newDate.setMinutes(selectedTime.getMinutes());
      setDataAgendamento(newDate);
    }
  };

  function renderModal() {
    return (
      <Modal visible={openModal} animationType="slide" transparent={true}>
        <View style={styles.viewModal}>
          <View style={styles.viewContentModal}>
            <View style={styles.headerModal}>
              <Text style={styles.titleModal}>Buscar Serviços</Text>
              <TouchableOpacity onPress={() => setOpenModal(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
  
            <View style={styles.modalLabelForm}>
              <Feather name="search" size={20} color={colors.azulPrincipal} style={styles.modalIconForm} />
              <TextInput
                style={styles.inputModal}
                placeholder="Nome do serviço ou código..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                autoFocus
              />
            </View>
            <View style={styles.searchResults}>
              <Text style={styles.resultsTitle}>
                {filteredServicos.length} serviços encontrados
              </Text>
              <FlatList
                data={filteredServicos.slice(0, 5)}
                keyExtractor={(item) => item.servico_id.toString()}
                renderItem={({ item }) => {
                  // Validar se a URL da imagem é válida
                  let imageUri = null;
                  try {
                    if (item?.foto_principal && 
                        typeof item.foto_principal === 'string' && 
                        item.foto_principal.trim() !== '' &&
                        (item.foto_principal.startsWith('http://') || item.foto_principal.startsWith('https://'))) {
                      imageUri = item.foto_principal.trim();
                    }
                  } catch (e) {
                    // Silenciosamente ignora erros de validação
                  }
                  
                  return (
                    <TouchableOpacity
                      style={styles.searchResultItem}
                      onPress={() => {
                        setOpenModal(false);
                        // Navigate to service details if needed
                      }}
                    >
                      {imageUri ? (
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.resultImage}
                        />
                      ) : (
                        <View style={[styles.resultImage, styles.placeholderImage]}>
                          <Feather name="scissors" size={24} color={colors.background} />
                        </View>
                      )}
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultName} numberOfLines={1}>{item.nome}</Text>
                        <Text style={styles.resultPrice}>R$ {item.valor?.toFixed(2)}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <TouchableOpacity
              style={styles.buttonSearchPlace}
              onPress={() => setOpenModal(false)}
            >
              <Text style={styles.buttonTextSearchPlace}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const ServiceCard = ({ item }) => {
    // Validar se a URL da imagem é válida
    let imageUri = null;
    try {
      if (item?.foto_principal && 
          typeof item.foto_principal === 'string' && 
          item.foto_principal.trim() !== '' &&
          (item.foto_principal.startsWith('http://') || item.foto_principal.startsWith('https://'))) {
        imageUri = item.foto_principal.trim();
      }
    } catch (e) {
      // Silenciosamente ignora erros de validação
    }
    
    return (
      <TouchableOpacity 
        style={styles.serviceCard}
        activeOpacity={0.8}
      >
        <View style={styles.serviceImageContainer}>
          {imageUri ? (
            <Image
              style={styles.serviceImage}
              source={{ uri: imageUri }}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.serviceImage, styles.placeholderImage]}>
              <Feather name="scissors" size={40} color={colors.background} />
            </View>
          )}
        </View>

        <View style={styles.serviceInfo}>
          <Text style={styles.serviceName} numberOfLines={2}>{item.nome}</Text>
          <Text style={styles.servicePrice}>R$ {item.valor?.toFixed(2)}</Text>
          
          <View style={styles.serviceMeta}>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={14} color={colors.cinza} />
              <Text style={styles.metaText}>
                Cadastrado em {formatDate(item.data_cadastro)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.buttonSchedule}
            onPress={() => {
              setSelectedServico(item);
              setOpenAgendamentoModal(true);
            }}
          >
            <Feather name="calendar" size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonScheduleText}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Serviços Disponíveis</Text>
        <Text style={styles.headerSubtitle}>
          Agende seu atendimento
        </Text>
      </View>

      <View style={styles.divSearchNotify}>
        <TouchableOpacity 
          onPress={() => setOpenModal(true)} 
          style={styles.buttonInputSearchLocation}
        >
          <TextInput
            placeholder="Buscar serviços..."
            style={styles.inputSearchPlaceholder}
            editable={false}
            value={searchTerm}
          />
          <Feather name="search" size={24} color={colors.azulPrincipal} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.azulPrincipal} />
          <Text style={styles.loadingText}>Carregando serviços...</Text>
        </View>
      ) : filteredServicos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={64} color={colors.cinza} />
          <Text style={styles.emptyText}>Nenhum serviço encontrado</Text>
          <Text style={styles.emptySubtext}>
            {searchTerm ? "Tente uma busca diferente" : "Não há serviços disponíveis no momento"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredServicos}
          keyExtractor={(item) => item.servico_id.toString()}
          renderItem={({ item }) => <ServiceCard item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
        />
      )}

      {renderModal()}
      
      {/* Modal de Criar Agendamento */}
      <Modal visible={openAgendamentoModal} animationType="slide" transparent={true}>
        <View style={styles.viewModal}>
          <View style={[styles.viewContentModal, { maxHeight: '90%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.headerModal}>
                <Text style={styles.titleModal}>Novo Agendamento</Text>
                <TouchableOpacity onPress={() => setOpenAgendamentoModal(false)}>
                  <Feather name="x" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {selectedServico && (
                <View style={styles.selectedServiceContainer}>
                  <Text style={styles.selectedServiceLabel}>Serviço Selecionado:</Text>
                  <Text style={styles.selectedServiceName}>{selectedServico.nome}</Text>
                  <Text style={styles.selectedServicePrice}>R$ {selectedServico.valor?.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.formContainer}>

               

                <Text style={styles.formLabel}>Data do Agendamento</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Feather name="calendar" size={20} color={colors.azulPrincipal} />
                  <Text style={styles.dateButtonText}>
                    {dataAgendamento.toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={dataAgendamento}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    minimumDate={new Date()}
                  />
                )}

                <Text style={styles.formLabel}>Horário</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Feather name="clock" size={20} color={colors.azulPrincipal} />
                  <Text style={styles.dateButtonText}>
                    {dataAgendamento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={dataAgendamento}
                    mode="time"
                    display="default"
                    onChange={onChangeTime}
                  />
                )}

                <Text style={styles.formLabel}>Observações (opcional)</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Informações adicionais..."
                  value={observacoes}
                  onChangeText={setObservacoes}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setOpenAgendamentoModal(false)}
                  disabled={creatingAgendamento}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleCreateAgendamento}
                  disabled={creatingAgendamento}
                >
                  {creatingAgendamento ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <>
                      <Feather name="check" size={18} color="white" style={{ marginRight: 8 }} />
                      <Text style={styles.confirmButtonText}>Confirmar</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

