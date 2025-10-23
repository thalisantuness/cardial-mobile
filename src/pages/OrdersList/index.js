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
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";
import { getPedidos, deletarPedido } from "../../services/api";
import { colors } from "../../colors";

const OrdersListScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useContextProvider();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getPedidos();
      
      if (Array.isArray(data)) {
        const formattedOrders = data.map(pedido => {
          const produto = pedido.ProdutoPedido || {};
          
          return {
            id: pedido.pedido_id?.toString(),
            productName: produto.nome || `Pedido #${pedido.pedido_id}`,
            observacao: pedido.observacao || "Sem observações",
            status: pedido.status || "pendente",
            dataEntrega: pedido.data_hora_entrega || new Date().toISOString(),
            value: parseFloat(produto.valor || 0),
            fotoProduto: produto.foto_principal || null,
            produtoId: pedido.produto_pedido_id,
            dataCadastro: pedido.data_cadastro,
            dataUpdate: pedido.data_update,
          };
        });
        
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      alert("Erro ao carregar pedidos. Verifique sua conexão.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchOrders();
    });
    return unsubscribe;
  }, [navigation]);

  const formatDate = (dateString) => {
    if (!dateString) return "Data não informada";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    const statusColors = {
      pendente: "#FFA500",
      confirmado: "#4169E1",
      em_preparo: "#9370DB",
      enviado: "#00CED1",
      entregue: "#32CD32",
      cancelado: "#DC143C",
    };
    return statusColors[status] || "#808080";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pendente: "Pendente",
      confirmado: "Confirmado",
      em_preparo: "Em Preparo",
      enviado: "Enviado",
      entregue: "Entregue",
      cancelado: "Cancelado",
    };
    return statusTexts[status] || status;
  };

  const handleDeleteOrder = (orderId, productName) => {
    Alert.alert(
      "Excluir Pedido",
      `Deseja realmente excluir o pedido de "${productName}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deletarPedido(orderId);
              alert("Pedido excluído com sucesso!");
              fetchOrders();
            } catch (error) {
              console.error("Erro ao excluir pedido:", error);
              alert("Erro ao excluir pedido. Tente novamente.");
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.productsButton}
          onPress={() => navigation.navigate("ProductsOrder")}
        >
          <Feather name="package" size={18} color="white" />
          <Text style={styles.productsButtonText}>Produtos</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>
        {user?.role === 'admin' ? "Todos os Pedidos" : "Meus Pedidos"}
      </Text>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.azulPrincipal} />
        ) : orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="shopping-cart" size={64} color="#CCC" />
            <Text style={styles.emptyMessage}>Nenhum pedido encontrado</Text>
            <Text style={styles.emptySubtext}>
              Quando você fizer pedidos, eles aparecerão aqui
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => navigation.navigate("ProductsOrder")}
            >
              <Feather name="plus" size={18} color="white" style={{ marginRight: 8 }} />
              <Text style={styles.emptyButtonText}>Fazer Pedido</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => String(item.id)}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.azulPrincipal]}
              />
            }
            renderItem={({ item }) => {
              const hasValidImage = item.fotoProduto && 
                                   typeof item.fotoProduto === 'string' && 
                                   item.fotoProduto.trim() !== '';

              return (
                <View style={styles.item}>
                  <View style={styles.itemContent}>
                    {hasValidImage ? (
                      <Image
                        source={{ uri: item.fotoProduto }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={[styles.productImage, styles.placeholderImage]}>
                        <Feather name="package" size={32} color={colors.cinza} />
                      </View>
                    )}

                    <View style={styles.itemInfo}>
                      <View style={styles.itemHeader}>
                        <Text style={styles.title} numberOfLines={2}>
                          {item.productName}
                        </Text>
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

                      {item.observacao && (
                        <Text style={styles.description} numberOfLines={2}>
                          {item.observacao}
                        </Text>
                      )}

                      <View style={styles.dateContainer}>
                        <Feather name="truck" size={14} color="#385b3e" />
                        <Text style={styles.dateText}>
                          Entrega: {formatDate(item.dataEntrega)}
                        </Text>
                      </View>

                      <View style={styles.valueContainer}>
                        <Text style={styles.valueText}>
                          R$ {item.value.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() =>
                        navigation.navigate("OrderDetailsView", {
                          order_id: item.id,
                        })
                      }
                    >
                      <Feather name="eye" size={18} color={colors.azulPrincipal} />
                      <Text style={styles.actionButtonText}>Detalhes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeleteOrder(item.id, item.productName)}
                    >
                      <Feather name="trash-2" size={18} color="#DC143C" />
                      <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                        Excluir
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
          />
        )}
      </View>
    </View>
  );
};

export default OrdersListScreen;

