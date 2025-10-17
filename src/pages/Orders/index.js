// src/pages/Orders/index.js (atualizado)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const OrdersScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContextProvider();
  const { cart, addToCart, getTotal: getCartTotal, getItemsCount: getCartItemsCount } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://back-pdv-production.up.railway.app/produtos");
     
      if (Array.isArray(response.data)) {
        const produtosData = response.data.map(produto => ({
          id: produto.produto_id,
          name: produto.nome,
          price: produto.valor,
          category: produto.tipo_produto,
          image: produto.foto_principal,
          stock: produto.quantidade,
          description: `${produto.tipo_produto} - ${produto.tipo_comercializacao || 'Produto padrão'}`,
          rating: 4.5,
          quantidade: produto.quantidade,
        }));
        setProducts(produtosData);
        setFilteredProducts(produtosData);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const renderProductItem = ({ item }) => {
    const hasImage = item.image;
    return (
      <TouchableOpacity
        style={styles.productCard}
        onPress={() => navigation.navigate("OrderDetails", { product_id: item.id })}
      >
        {hasImage ? (
          <Image source={{ uri: item.image }} style={styles.productImage} />
        ) : (
          <View style={[styles.productImage, styles.placeholderImage]}>
            <Text style={styles.placeholderText}>Sem Imagem</Text>
          </View>
        )}
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          
          <View style={styles.productMeta}>
            <View style={styles.ratingContainer}>
              <Feather name="star" size={14} color="#FFD700" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            <Text style={styles.stockText}>
              {item.stock > 0 ? `${item.stock} em estoque` : "Fora de estoque"}
            </Text>
          </View>
          
          <View style={styles.priceContainer}>
            <Text style={styles.productPrice}>R$ {item.price?.toFixed(2)}</Text>
            <TouchableOpacity
              style={[
                styles.addButton,
                item.stock === 0 && styles.disabledButton
              ]}
              onPress={() => addToCart(item, 1)}
              disabled={item.stock === 0}
            >
              <Feather name="shopping-cart" size={16} color="white" />
              <Text style={styles.addButtonText}>
                {item.stock === 0 ? "Sem estoque" : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Nossos Serviços</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Carrinho")}
        >
          <Feather name="shopping-cart" size={20} color="white" />
          {getCartItemsCount() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getCartItemsCount()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar produtos..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000000" style={styles.loader} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productsList}
          ListEmptyComponent={
            <Text style={styles.emptyMessage}>
              Nenhum produto encontrado
            </Text>
          }
        />
      )}

      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.footerButton}
          onPress={() => navigation.navigate("Carrinho")}
        >
          <Text style={styles.footerButtonText}>
            Ver Carrinho ({getCartItemsCount()} itens)
          </Text>
          <Text style={styles.footerButtonPrice}>
            R$ {getCartTotal().toFixed(2)}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OrdersScreen;