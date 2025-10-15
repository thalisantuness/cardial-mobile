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
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const OrdersScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const { user } = useContextProvider();

  // Dados mockados de produtos
  const mockProducts = [
    {
      id: "1",
      name: "Smartphone Samsung Galaxy S23",
      description: "Smartphone Android com 128GB, 8GB RAM, câmera tripla",
      price: 1899.99,
      category: "Eletrônicos",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
      stock: 15,
      rating: 4.5,
    },
    {
      id: "2",
      name: "Notebook Dell Inspiron 15",
      description: "Notebook Intel i5, 8GB RAM, SSD 256GB, 15.6''",
      price: 2499.99,
      category: "Informática",
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
      stock: 8,
      rating: 4.3,
    },
    {
      id: "3",
      name: "Fone de Ouvido Sony WH-1000XM4",
      description: "Fone over-ear com cancelamento de ruído, Bluetooth",
      price: 1299.99,
      category: "Áudio",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      stock: 20,
      rating: 4.8,
    },
    {
      id: "4",
      name: "Smart TV LG 55'' 4K",
      description: "TV LED 55 polegadas, 4K UHD, Smart TV webOS",
      price: 2899.99,
      category: "TV & Vídeo",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400",
      stock: 5,
      rating: 4.6,
    },
    {
      id: "5",
      name: "Tablet Apple iPad Air",
      description: "Tablet 10.9'', 64GB, Wi-Fi, Chip M1",
      price: 3499.99,
      category: "Tablets",
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      stock: 12,
      rating: 4.7,
    },
    {
      id: "6",
      name: "Câmera Canon EOS R6",
      description: "Câmera mirrorless full-frame, 20.1MP, 4K video",
      price: 8999.99,
      category: "Câmeras",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
      stock: 3,
      rating: 4.9,
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Simulando chamada API
      setTimeout(() => {
        setProducts(mockProducts);
        setFilteredProducts(mockProducts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching products:", error);
      Alert.alert("Erro", "Não foi possível carregar os produtos.");
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

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    Alert.alert("Sucesso", `${product.name} adicionado ao carrinho!`);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetails", { product_id: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
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
          <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={[
              styles.addButton,
              item.stock === 0 && styles.disabledButton
            ]}
            onPress={() => addToCart(item)}
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Nossos Produtos</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Cart", { cart })}
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
          keyExtractor={(item) => item.id}
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
          onPress={() => navigation.navigate("Cart", { cart })}
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