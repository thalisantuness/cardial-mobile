import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContextProvider } from "../../context/AuthContext";
import { getFretes, criarConversa, atualizarFrete } from "../../services/api";
import styles from "./styles";
import { colors } from "../../colors";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";

// Opções para os filtros múltiplos
const tipoCargaOptions = [
  "Grãos",
  "Combustível",
  "Líquidos",
  "Sólidos",
  "Paletizada",
  "Granel",
  "Frigorífica",
  "Perigosa",
  "Viva",
  "Frágil",
  "Outros",
];

const veiculoTracaoOptions = [
  "Caminhonete",
  "3/4",
  "3/4 Trucado",
  "Toco",
  "Truck",
  "Bitruck",
  "Cavalo Simples",
  "Cavalo Trucado",
  "Trucado Eixo Aux.",
];
const tiposCarretaOptions = [
  "Graneleiro",
  "Aberta",
  "Basculante",
  "Baú",
  "Sider",
  "Refrigerado",
  "Tanque",
  "Prancha",
  "Boiadeiro",
  "Gaiola",
  "Porta Container",
  "Cegonha",
];
const comprimentoCarretaOptions = [
  "12,40 mt.",
  "13,00 mt.",
  "13,50 mt.",
  "14,00 mt",
  "14,50 mt.",
  "15,00 mt.",
  "15,50 mt.",
  "Mais...",
];
const numeroEixosOptions = [
  "2 eixos",
  "3 eixos",
  "4 eixos",
  "Vanderleia",
  "Canguru",
  "Mais de 4 eixos",
];
const configModeloOptions = ["Bitrem", "Tritrem", "Rodotrem", "Especial"];

// Componente SimNaoSelector
const SimNaoSelector = ({ title, value, onSelect }) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.checkboxGroupRow}>
      <TouchableOpacity style={styles.checkboxContainer} onPress={() => onSelect(true)}>
        <View style={[styles.checkbox, value === true && styles.checkboxChecked]}>
          {value === true && <Feather name="check" size={14} color="white" />}
        </View>
        <Text style={styles.checkboxLabel}>Sim</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.checkboxContainer} onPress={() => onSelect(false)}>
        <View style={[styles.checkbox, value === false && styles.checkboxChecked]}>
          {value === false && <Feather name="check" size={14} color="white" />}
        </View>
        <Text style={styles.checkboxLabel}>Não</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Componente MultiCheckboxGroup
const MultiCheckboxGroup = ({ title, options, selectedOptions, onSelect }) => (
  <View>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.checkboxGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.checkboxContainer}
          onPress={() => onSelect(option)}
        >
          <View style={[styles.checkbox, selectedOptions[option] && styles.checkboxChecked]}>
            {selectedOptions[option] && <Feather name="check" size={14} color="white" />}
          </View>
          <Text style={styles.checkboxLabel}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

export default function FretesScreen() {
  const navigation = useNavigation();
  const { user, userRole } = useContextProvider();

  const [fretes, setFretes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalFiltroVisible, setModalFiltroVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalLocalidade, setModalLocalidade] = useState({ visible: false, type: null });
  const [showFilters, setShowFilters] = useState(true); // Estado para controlar visibilidade dos filtros

  // Estados para seleção de localidades
  const [estados, setEstados] = useState([]);
  const [cidadesOrigem, setCidadesOrigem] = useState([]);
  const [cidadesDestino, setCidadesDestino] = useState([]);
  const [loadingLocalidades, setLoadingLocalidades] = useState(false);

  // Estado para filtros
  const [filtros, setFiltros] = useState({
    origem_estado: "",
    origem_cidade: "",
    destino_estado: "",
    destino_cidade: "",
    valor_frete: "",
    data_prevista_entrega: null,
    precisa_lona: null,
    produto_quimico: null,
    veiculo_tracao: {},
    tipos_carreta: {},
    comprimento_carreta: {},
    numero_eixos: {},
    configuracao_modelo: {},
    tipo_carga: "",
    filtro_geral: "",
  });

  // Carrega estados do IBGE
  useEffect(() => {
    const fetchEstados = async () => {
      setLoadingLocalidades(true);
      try {
        const response = await fetch(
          "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome"
        );
        const data = await response.json();
        console.log("Estados recebidos:", JSON.stringify(data, null, 2));
        setEstados(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
        Toast.show({
          type: "error",
          text1: "Erro",
          text2: "Não foi possível carregar os estados",
        });
      } finally {
        setLoadingLocalidades(false);
      }
    };
    fetchEstados();
  }, []);

  const fetchCidades = async (uf, type) => {
    if (!uf) return;
    setLoadingLocalidades(true);
    try {
      const response = await fetch(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      );
      const data = await response.json();
      console.log(`Cidades recebidas para ${uf} (${type}):`, JSON.stringify(data, null, 2));
      if (type === "origem") {
        setCidadesOrigem(data);
      } else if (type === "destino") {
        setCidadesDestino(data);
      }
    } catch (error) {
      console.error(`Erro ao buscar cidades para ${uf}:`, error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar as cidades",
      });
    } finally {
      setLoadingLocalidades(false);
    }
  };

  const handleSelectEstado = (uf, type) => {
    console.log(`Estado selecionado: ${uf} (${type})`);
    if (type === "origemEstado") {
      handleInputChange("origem_estado", uf);
      handleInputChange("origem_cidade", "");
      fetchCidades(uf, "origem");
    } else if (type === "destinoEstado") {
      handleInputChange("destino_estado", uf);
      handleInputChange("destino_cidade", "");
      fetchCidades(uf, "destino");
    }
    setModalLocalidade({ visible: false, type: null });
  };

  const handleSelectCidade = (cidade, type) => {
    console.log(`Cidade selecionada: ${cidade} (${type})`);
    if (type === "origemCidade") {
      handleInputChange("origem_cidade", cidade);
    } else if (type === "destinoCidade") {
      handleInputChange("destino_cidade", cidade);
    }
    setModalLocalidade({ visible: false, type: null });
  };

  const handleInputChange = (campo, valor) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleCheckboxChange = (campo, opcao) => {
    setFiltros((prev) => ({
      ...prev,
      [campo]: {
        ...prev[campo],
        [opcao]: !prev[campo][opcao],
      },
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange("data_prevista_entrega", selectedDate);
    }
  };

  const fetchFretes = async (appliedFilters = {}) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      console.log("Filtros aplicados:", JSON.stringify(appliedFilters, null, 2));

      const filtrosParaAPI = { ...appliedFilters };

      const multiSelectFields = [
        "veiculo_tracao",
        "tipos_carreta",
        "comprimento_carreta",
        "numero_eixos",
        "configuracao_modelo",
      ];

      multiSelectFields.forEach((field) => {
        if (appliedFilters[field] && Object.keys(appliedFilters[field]).length > 0) {
          const selecionados = Object.keys(appliedFilters[field])
            .filter((key) => appliedFilters[field][key])
            .join(",");
          filtrosParaAPI[field] = selecionados;
          console.log(`${field} selecionados:`, selecionados || "Nenhum");
        } else {
          delete filtrosParaAPI[field];
          console.log(`${field}: Nenhum selecionado`);
        }
      });

      if (appliedFilters.data_prevista_entrega) {
        filtrosParaAPI.data_prevista_entrega = appliedFilters.data_prevista_entrega.toISOString();
        console.log("Data prevista entrega:", filtrosParaAPI.data_prevista_entrega);
      } else {
        delete filtrosParaAPI.data_prevista_entrega;
      }

      Object.keys(filtrosParaAPI).forEach((key) => {
        if (
          filtrosParaAPI[key] === "" ||
          filtrosParaAPI[key] === null ||
          filtrosParaAPI[key] === undefined
        ) {
          delete filtrosParaAPI[key];
        }
      });

      console.log("Parâmetros da API:", JSON.stringify(filtrosParaAPI, null, 2));

      const baseUrl = "https://sua-api-base-url.com/fretes"; // Substitua pela URL real
      const queryString = new URLSearchParams(filtrosParaAPI).toString();
      const fullUrl = `${baseUrl}?${queryString}`;
      console.log("URL completa da requisição:", fullUrl);

      const response = await getFretes(token, filtrosParaAPI);

      console.log("Status da resposta:", response.status || "Desconhecido");
      console.log("Resposta da API - Quantidade de fretes:", response.length);
      console.log("Resposta da API - Dados:", JSON.stringify(response, null, 2));

      setFretes(response);
    } catch (error) {
      console.error("Erro ao carregar fretes:", error);
      console.error("Detalhes do erro:", {
        message: error.message,
        stack: error.stack,
        response: error.response
          ? {
              status: error.response.status,
              data: JSON.stringify(error.response.data, null, 2),
              headers: JSON.stringify(error.response.headers, null, 2),
            }
          : null,
      });
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Não foi possível carregar os fretes",
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFretes(filtros);
    }, [])
  );

  const handleApplyFilters = () => {
    console.log("Aplicando filtros...");
    fetchFretes(filtros);
    setModalFiltroVisible(false);
  };

  const handleClearFilters = () => {
    console.log("Limpando filtros...");
    const clearedFilters = {
      origem_estado: "",
      origem_cidade: "",
      destino_estado: "",
      destino_cidade: "",
      valor_frete: "",
      data_prevista_entrega: null,
      precisa_lona: null,
      produto_quimico: null,
      veiculo_tracao: {},
      tipos_carreta: {},
      comprimento_carreta: {},
      numero_eixos: {},
      configuracao_modelo: {},
      tipo_carga: "",
      filtro_geral: "",
    };
    setFiltros(clearedFilters);
    fetchFretes(clearedFilters);
    setModalFiltroVisible(false);
  };

  const handleAtualizarStatusFrete = async (freteId, novoStatus) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      await atualizarFrete(freteId, { status: novoStatus }, token);

      Toast.show({
        type: "success",
        text1: "Sucesso",
        text2: `Frete ${novoStatus === "finalizado" ? "finalizado" : "cancelado"} com sucesso`,
      });

      fetchFretes(filtros);
    } catch (error) {
      console.error("Erro ao atualizar frete:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.error || "Falha ao atualizar status do frete",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCriarConversa = async (frete) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (userRole === "empresa" && !frete.motorista_id) {
        Toast.show({
          type: "info",
          text1: "Atenção",
          text2: "Este frete ainda não tem um motorista atribuído",
        });
        return;
      }

      const destinatario_id = userRole === "motorista" ? frete.empresa_id : frete.motorista_id;
      const response = await criarConversa(frete.frete_id, destinatario_id, token);
      const destinatario = userRole === "motorista" ? response.conversa.Usuario1 : response.conversa.Usuario2;

      navigation.navigate("Chat", {
        conversa_id: response.conversa.conversa_id,
        frete_id: frete.frete_id,
        destinatario: {
          usuario_id: destinatario_id,
          nome_completo: destinatario.nome_completo || "Sem nome",
          email: destinatario.email || "Sem email",
          role: destinatario.role,
          imagem_perfil: destinatario.imagem_perfil,
        },
      });
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: error.error || "Falha ao criar conversa",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFrete = ({ item }) => {
    const isEmpresaDona = userRole === "empresa" && item.empresa_id === user.usuario_id;

    return (
      <TouchableOpacity
        style={styles.freteItemContainer}
        onPress={() => navigation.navigate("FreteDetalhes", { frete_id: item.frete_id })}
      >
        <View style={styles.freteHeader}>
          <Text style={styles.freteTitle}>{item.Empresa?.nome_completo || "Frete em Aberto"}</Text>
          <Text style={styles.freteValor}>R$ {parseFloat(item.valor_frete || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.routeContainer}>
          <Feather name="map-pin" size={16} color={colors.cinza} />
          <Text style={styles.routeText}>{`${item.origem_cidade}, ${item.origem_estado}`}</Text>
          <Feather name="arrow-right" size={16} color={colors.cinza} style={{ marginHorizontal: 5 }} />
          <Feather name="map-pin" size={16} color={colors.cinza} />
          <Text style={styles.routeText}>{`${item.destino_cidade}, ${item.destino_estado}`}</Text>
        </View>

        <View style={styles.actionsContainer}>
          {(userRole === "empresa" && item.motorista_id) || (userRole === "motorista" && item.status !== "anunciado") ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.chatButton]}
              onPress={() => handleCriarConversa(item)}
              disabled={loading}
            >
              <Text style={styles.actionButtonText}>Chat</Text>
            </TouchableOpacity>
          ) : null}

          {isEmpresaDona && item.status === "em_andamento" && (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.finalizarButton]}
                onPress={() => handleAtualizarStatusFrete(item.frete_id, "finalizado")}
                disabled={loading}
              >
                <Text style={styles.actionButtonText}>Finalizar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.cancelarButton]}
                onPress={() => handleAtualizarStatusFrete(item.frete_id, "cancelado")}
                disabled={loading}
              >
                <Text style={styles.actionButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Modal para seleção de estados e cidades
  const renderLocalidadeModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalLocalidade.visible}
      onRequestClose={() => {
        console.log("Fechando modal de localidade via onRequestClose");
        setModalLocalidade({ visible: false, type: null });
      }}
    >
      <View style={styles.localidadeModalContainer}>
        <TouchableOpacity
          style={styles.localidadeModalOverlay}
          activeOpacity={1}
          onPress={() => {
            console.log("Clicado no overlay do modal de localidade");
            setModalLocalidade({ visible: false, type: null });
          }}
        >
          <View
            style={styles.localidadeModalContent}
            onStartShouldSetResponder={() => true}
          >
            <View style={styles.localidadeModalHeader}>
              <Text style={styles.modalTitle}>
                {modalLocalidade.type?.includes("Estado") ? "Selecionar Estado" : "Selecionar Cidade"}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  console.log("Fechando modal de localidade via botão X");
                  setModalLocalidade({ visible: false, type: null });
                }}
              >
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {loadingLocalidades ? (
              <ActivityIndicator size="large" color={colors.laranjaPrincipal} />
            ) : (
              <FlatList
                data={
                  modalLocalidade.type?.includes("Estado")
                    ? estados
                    : modalLocalidade.type === "origemCidade"
                    ? cidadesOrigem
                    : cidadesDestino
                }
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalOption}
                    onPress={() => {
                      console.log(`Item selecionado: ${item.nome} (${modalLocalidade.type})`);
                      if (modalLocalidade.type?.includes("Estado")) {
                        handleSelectEstado(item.sigla, modalLocalidade.type);
                      } else {
                        handleSelectCidade(item.nome, modalLocalidade.type);
                      }
                    }}
                  >
                    <Text style={styles.modalOptionText}>
                      {item.nome} {item.sigla ? `(${item.sigla})` : ""}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text style={styles.emptyListText}>
                    {modalLocalidade.type?.includes("Estado")
                      ? "Nenhum estado carregado"
                      : "Nenhuma cidade carregada"}
                  </Text>
                }
              />
            )}
            <View style={styles.localidadeModalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  console.log("Fechando modal de localidade via botão Cancelar");
                  setModalLocalidade({ visible: false, type: null });
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Fretes Disponíveis</Text>
      </View>

      {userRole === "empresa" && (
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate("CriarFrete")}>
          <Feather name="plus" size={20} color="white" />
          <Text style={styles.addButtonText}>Adicionar Novo Frete</Text>
        </TouchableOpacity>
      )}

      {/* Botão para mostrar/esconder filtros */}
      <TouchableOpacity 
        style={styles.toggleFilterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Text style={styles.toggleFilterButtonText}>
          {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
        </Text>
        <Feather 
          name={showFilters ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="white" 
        />
      </TouchableOpacity>

      {/* Filtros na listagem principal - condicionais ao estado showFilters */}
      {showFilters && (
        <ScrollView style={styles.filterSection}>
          <View style={styles.filterHeader}>
            <Text style={styles.sectionTitle}>Filtros</Text>
            <TouchableOpacity 
              style={styles.moreFiltersButton}
              onPress={() => setModalFiltroVisible(true)}
            >
              <Text style={styles.moreFiltersText}>Mais filtros</Text>
              <Feather name="filter" size={16} color={colors.laranjaPrincipal} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.sectionSubtitle}>Embarque</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              console.log("Abrindo modal para origem_estado");
              setModalLocalidade({ visible: true, type: "origemEstado" });
            }}
          >
            <Text style={styles.pickerText}>
              {filtros.origem_estado || "Selecione o Estado de Origem"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, !filtros.origem_estado && styles.inputDisabled]}
            onPress={() => {
              if (filtros.origem_estado) {
                console.log("Abrindo modal para origem_cidade");
                setModalLocalidade({ visible: true, type: "origemCidade" });
              }
            }}
            disabled={!filtros.origem_estado}
          >
            <Text style={styles.pickerText}>
              {filtros.origem_cidade || "Selecione a Cidade de Origem"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionSubtitle}>Entrega</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              console.log("Abrindo modal para destino_estado");
              setModalLocalidade({ visible: true, type: "destinoEstado" });
            }}
          >
            <Text style={styles.pickerText}>
              {filtros.destino_estado || "Selecione o Estado de Destino"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.input, !filtros.destino_estado && styles.inputDisabled]}
            onPress={() => {
              if (filtros.destino_estado) {
                console.log("Abrindo modal para destino_cidade");
                setModalLocalidade({ visible: true, type: "destinoCidade" });
              }
            }}
            disabled={!filtros.destino_estado}
          >
            <Text style={styles.pickerText}>
              {filtros.destino_cidade || "Selecione a Cidade de Destino"}
            </Text>
          </TouchableOpacity>

          <View style={styles.filterActions}>
            <TouchableOpacity 
              style={[styles.filterActionButton, styles.clearFilterButton]}
              onPress={handleClearFilters}
            >
              <Text style={styles.clearFilterButtonText}>Limpar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterActionButton, styles.applyButton]} 
              onPress={() => fetchFretes(filtros)}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtro</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} size="large" color={colors.laranjaPrincipal} />
      ) : (
        <FlatList
          data={fretes}
          renderItem={renderFrete}
          keyExtractor={(item) => item.frete_id.toString()}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum frete encontrado.</Text>}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalFiltroVisible}
        onRequestClose={() => {
          console.log("Fechando modal de filtros via onRequestClose");
          setModalFiltroVisible(false);
          setModalLocalidade({ visible: false, type: null });
        }}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { maxHeight: "80%" }]}>
            <Text style={styles.modalTitle}>Filtros Específicos</Text>
            <ScrollView style={styles.modalScrollView}>
         

            
           

             
              <SimNaoSelector
                title="Precisa Lona?"
                value={filtros.precisa_lona}
                onSelect={(v) => handleInputChange("precisa_lona", v)}
              />
              <SimNaoSelector
                title="Produto Químico?"
                value={filtros.produto_quimico}
                onSelect={(v) => handleInputChange("produto_quimico", v)}
              />

              <MultiCheckboxGroup
                title="Veículo de Tração"
                options={veiculoTracaoOptions}
                selectedOptions={filtros.veiculo_tracao}
                onSelect={(opt) => handleCheckboxChange("veiculo_tracao", opt)}
              />
              <MultiCheckboxGroup
                title="Tipos de Carreta"
                options={tiposCarretaOptions}
                selectedOptions={filtros.tipos_carreta}
                onSelect={(opt) => handleCheckboxChange("tipos_carreta", opt)}
              />
              <MultiCheckboxGroup
                title="Comprimento da Carreta"
                options={comprimentoCarretaOptions}
                selectedOptions={filtros.comprimento_carreta}
                onSelect={(opt) => handleCheckboxChange("comprimento_carreta", opt)}
              />
              <MultiCheckboxGroup
                title="Número de Eixos"
                options={numeroEixosOptions}
                selectedOptions={filtros.numero_eixos}
                onSelect={(opt) => handleCheckboxChange("numero_eixos", opt)}
              />
              <MultiCheckboxGroup
                title="Configuração do Modelo"
                options={configModeloOptions}
                selectedOptions={filtros.configuracao_modelo}
                onSelect={(opt) => handleCheckboxChange("configuracao_modelo", opt)}
              />

        
            </ScrollView>

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.clearButton]}
                onPress={handleClearFilters}
              >
                <Text style={styles.modalButtonText}>Limpar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleApplyFilters}>
                <Text style={styles.modalButtonText}>Aplicar Filtros Específicos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {renderLocalidadeModal()}
      <Toast />
    </View>
  );
}