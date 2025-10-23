import React, { useState, useEffect } from "react";
import { 
  View, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  FlatList, 
  Text, 
  Image, 
  ActivityIndicator, 
  ScrollView,
  Platform 
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { getProdutosPedido, criarPedido } from "../../services/api";
import { useContextProvider } from "../../context/AuthContext";
import styles from "./styles";
import { colors } from "../../colors";

export default function ProductsOrder() {
  const [openModal, setOpenModal] = useState(false);
  const [openPedidoModal, setOpenPedidoModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creatingPedido, setCreatingPedido] = useState(false);
  const navigation = useNavigation();
  const { user } = useContextProvider();

  // Dados do pedido
  const [dataEntrega, setDataEntrega] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [observacoes, setObservacoes] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProdutosPedido();
      if (Array.isArray(data)) {
        setProducts(data);
        setFilteredProducts(data);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      alert("Erro ao carregar produtos. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Não informado";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const currentTime = dataEntrega;
      selectedDate.setHours(currentTime.getHours());
      selectedDate.setMinutes(currentTime.getMinutes());
      setDataEntrega(selectedDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const currentDate = dataEntrega;
      selectedTime.setFullYear(currentDate.getFullYear());
      selectedTime.setMonth(currentDate.getMonth());
      selectedTime.setDate(currentDate.getDate());
      setDataEntrega(selectedTime);
    }
  };

  const handleCreatePedido = async () => {
    if (!observacoes.trim()) {
      alert("Por favor, informe uma observação para o pedido");
      return;
    }

    try {
      setCreatingPedido(true);
      
      const pedidoData = {
        produto_pedido_id: selectedProduct.produto_pedido_id,
        data_hora_entrega: dataEntrega.toISOString(),
        observacao: observacoes,
      };

      await criarPedido(pedidoData);
      
      alert("Pedido criado com sucesso!");
      
      setObservacoes("");
      setDataEntrega(new Date());
      setOpenPedidoModal(false);
      
      // Navegar para a lista de pedidos
      navigation.navigate("OrdersList");
      
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      alert("Erro ao criar pedido. Tente novamente.");
    } finally {
      setCreatingPedido(false);
    }
  };

  const renderModal = () => (
    <Modal visible={openModal} animationType="slide" transparent={true}>
      <View style={styles.viewModal}>
        <View style={styles.viewContentModal}>
          <View style={styles.headerModal}>
            <Text style={styles.titleModal}>Buscar Produto</Text>
            <TouchableOpacity onPress={() => setOpenModal(false)}>
              <Feather name="x" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchInputContainer}>
            <Feather name="search" size={20} color={colors.cinza} />
            <TextInput
              style={styles.modalSearchInput}
              placeholder="Digite o nome do produto..."
              placeholderTextColor={colors.cinza}
              value={searchTerm}
              onChangeText={(text) => {
                setSearchTerm(text);
                if (text === "") {
                  setFilteredProducts(products);
                } else {
                  const filtered = products.filter((product) =>
                    product.nome.toLowerCase().includes(text.toLowerCase())
                  );
                  setFilteredProducts(filtered);
                }
              }}
            />
          </View>

          <FlatList
            data={filteredProducts}
            keyExtractor={(item) => String(item.produto_pedido_id)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const hasValidImage = item.foto_principal && 
                                   typeof item.foto_principal === 'string' && 
                                   item.foto_principal.trim() !== '';

              return (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedProduct(item);
                    setOpenModal(false);
                    setOpenPedidoModal(true);
                  }}
                >
                  {hasValidImage ? (
                    <Image
                      source={{ uri: item.foto_principal }}
                      style={styles.modalItemImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.modalItemImage, styles.placeholderImage]}>
                      <Feather name="package" size={32} color={colors.cinza} />
                    </View>
                  )}
                  <View style={styles.modalItemInfo}>
                    <Text style={styles.modalItemName}>{item.nome}</Text>
                    <Text style={styles.modalItemPrice}>R$ {item.valor?.toFixed(2)}</Text>
                  </View>
                  <Feather name="chevron-right" size={20} color={colors.cinza} />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );

  const ProductCard = ({ item }) => {
    const hasValidImage = item.foto_principal && 
                         typeof item.foto_principal === 'string' && 
                         item.foto_principal.trim() !== '';

    return (
      <TouchableOpacity 
        style={styles.productCard}
        activeOpacity={0.8}
      >
        {hasValidImage ? (
          <Image
            source={{ uri: item.foto_principal }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Feather name="package" size={48} color={colors.cinza} />
          </View>
        )}

        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{item.nome}</Text>
          <Text style={styles.productPrice}>R$ {item.valor?.toFixed(2)}</Text>
          
          <View style={styles.productMeta}>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={14} color={colors.cinza} />
              <Text style={styles.metaText}>
                Cadastrado em {formatDate(item.data_cadastro)}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.buttonOrder}
            onPress={() => {
              setSelectedProduct(item);
              setOpenPedidoModal(true);
            }}
          >
            <Feather name="shopping-cart" size={16} color="white" style={{ marginRight: 8 }} />
            <Text style={styles.buttonOrderText}>Fazer Pedido</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Produtos para Pedidos</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => setOpenModal(true)}
        >
          <Feather name="search" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.azulPrincipal} />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="package" size={64} color="#CCC" />
          <Text style={styles.emptyMessage}>Nenhum produto disponível</Text>
          <Text style={styles.emptySubtext}>
            Quando produtos estiverem disponíveis, eles aparecerão aqui
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.produto_pedido_id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <ProductCard item={item} />}
        />
      )}

      {renderModal()}
      
      {/* Modal de Criar Pedido */}
      <Modal visible={openPedidoModal} animationType="slide" transparent={true}>
        <View style={styles.viewModal}>
          <View style={[styles.viewContentModal, { maxHeight: '90%' }]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.headerModal}>
                <Text style={styles.titleModal}>Novo Pedido</Text>
                <TouchableOpacity onPress={() => setOpenPedidoModal(false)}>
                  <Feather name="x" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              {selectedProduct && (
                <View style={styles.selectedProductContainer}>
                  <Text style={styles.selectedProductLabel}>Produto Selecionado:</Text>
                  <Text style={styles.selectedProductName}>{selectedProduct.nome}</Text>
                  <Text style={styles.selectedProductPrice}>R$ {selectedProduct.valor?.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.formContainer}>
                <Text style={styles.formLabel}>Data de Entrega</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Feather name="calendar" size={20} color={colors.azulPrincipal} />
                  <Text style={styles.dateButtonText}>
                    {dataEntrega.toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={dataEntrega}
                    mode="date"
                    display="default"
                    onChange={onChangeDate}
                    minimumDate={new Date()}
                  />
                )}

                <Text style={styles.formLabel}>Horário de Entrega</Text>
                <TouchableOpacity
                  style={styles.dateButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Feather name="clock" size={20} color={colors.azulPrincipal} />
                  <Text style={styles.dateButtonText}>
                    {dataEntrega.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>

                {showTimePicker && (
                  <DateTimePicker
                    value={dataEntrega}
                    mode="time"
                    display="default"
                    onChange={onChangeTime}
                  />
                )}

                <Text style={styles.formLabel}>Observações *</Text>
                <TextInput
                  style={[styles.formInput, styles.textArea]}
                  placeholder="Ex: Tocar campainha, entregar na portaria..."
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
                  onPress={() => setOpenPedidoModal(false)}
                  disabled={creatingPedido}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleCreatePedido}
                  disabled={creatingPedido}
                >
                  {creatingPedido ? (
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

