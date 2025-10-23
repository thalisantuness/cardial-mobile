import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { getPedidoById, atualizarPedido, deletarPedido } from "../../services/api";
import styles from "./styles";
import { colors } from "../../colors";

const OrderDetailsView = ({ route, navigation }) => {
  const { order_id } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [order_id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await getPedidoById(order_id);
      
      console.log("Detalhes do pedido:", data);
      
      setOrder(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do pedido:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do pedido.");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = () => {
    Alert.alert(
      "Excluir Pedido",
      "Deseja realmente excluir este pedido?",
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
              await deletarPedido(order_id);
              Alert.alert("Sucesso", "Pedido excluído com sucesso!");
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir pedido:", error);
              Alert.alert("Erro", "Não foi possível excluir o pedido.");
            }
          },
        },
      ]
    );
  };

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

  if (loading || !order) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.azulPrincipal} />
        <Text style={styles.loadingText}>Carregando detalhes...</Text>
      </View>
    );
  }

  const produto = order.ProdutoPedido || {};
  const hasValidImage = produto.foto_principal && 
                       typeof produto.foto_principal === 'string' && 
                       produto.foto_principal.trim() !== '';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalhes do Pedido</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagem do Produto */}
        {hasValidImage ? (
          <Image
            source={{ uri: produto.foto_principal }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Feather name="package" size={64} color={colors.cinza} />
          </View>
        )}

        <View style={styles.content}>
          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(order.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>

          {/* Nome do Produto */}
          <Text style={styles.productName}>
            {produto.nome || `Pedido #${order.pedido_id}`}
          </Text>

          {/* Valor */}
          <Text style={styles.price}>R$ {produto.valor?.toFixed(2) || "0,00"}</Text>

          {/* Informações do Pedido */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Informações do Pedido</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Feather name="hash" size={18} color={colors.azulPrincipal} />
                <Text style={styles.infoLabel}>Número do Pedido:</Text>
              </View>
              <Text style={styles.infoValue}>#{order.pedido_id}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Feather name="calendar" size={18} color={colors.azulPrincipal} />
                <Text style={styles.infoLabel}>Data do Pedido:</Text>
              </View>
              <Text style={styles.infoValue}>
                {formatDate(order.data_cadastro)}
              </Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Feather name="truck" size={18} color={colors.azulPrincipal} />
                <Text style={styles.infoLabel}>Entrega Prevista:</Text>
              </View>
              <Text style={styles.infoValue}>
                {formatDate(order.data_hora_entrega)}
              </Text>
            </View>

            {order.data_update !== order.data_cadastro && (
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <Feather name="clock" size={18} color={colors.azulPrincipal} />
                  <Text style={styles.infoLabel}>Última Atualização:</Text>
                </View>
                <Text style={styles.infoValue}>
                  {formatDate(order.data_update)}
                </Text>
              </View>
            )}
          </View>

          {/* Observações */}
          {order.observacao && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Observações</Text>
              <View style={styles.observacaoBox}>
                <Feather name="file-text" size={18} color={colors.cinza} />
                <Text style={styles.observacaoText}>{order.observacao}</Text>
              </View>
            </View>
          )}

          {/* Detalhes do Produto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detalhes do Produto</Text>
            
            <View style={styles.productDetails}>
              <Text style={styles.productDetailLabel}>Nome:</Text>
              <Text style={styles.productDetailValue}>{produto.nome}</Text>
            </View>

            <View style={styles.productDetails}>
              <Text style={styles.productDetailLabel}>Valor Unitário:</Text>
              <Text style={styles.productDetailValue}>
                R$ {produto.valor?.toFixed(2)}
              </Text>
            </View>

            {produto.data_cadastro && (
              <View style={styles.productDetails}>
                <Text style={styles.productDetailLabel}>Produto Cadastrado em:</Text>
                <Text style={styles.productDetailValue}>
                  {formatDate(produto.data_cadastro)}
                </Text>
              </View>
            )}
          </View>

          {/* Botão de Exclusão */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteOrder}
          >
            <Feather name="trash-2" size={20} color="white" />
            <Text style={styles.deleteButtonText}>Excluir Pedido</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetailsView;

