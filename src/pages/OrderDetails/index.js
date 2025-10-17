// src/pages/OrderDetails/index.js (CORRIGIDO)
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import styles from "./styles";
import { colors } from "../../colors";

const OrderDetails = ({ route, navigation }) => {
  const { product_id } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [product_id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://back-pdv-production.up.railway.app/produtos/${product_id}`);
      const data = response.data;
      
      console.log("Dados do produto:", data); // Para debug
      
      // CORREÇÃO: Processar imagens corretamente
      const allImages = [];
      
      // Adicionar imagem principal
      if (data.foto_principal) {
        allImages.push(data.foto_principal);
      } else if (data.imageData) {
        allImages.push(data.imageData);
      }
      
      // CORREÇÃO: Adicionar fotos secundárias - extrair imageData do array de objetos
      if (data.photos && Array.isArray(data.photos)) {
        data.photos.forEach(photo => {
          if (photo.imageData) {
            allImages.push(photo.imageData);
          }
        });
      }

      // CORREÇÃO: Também verificar o array fotos (caso exista)
      if (data.fotos && Array.isArray(data.fotos)) {
        data.fotos.forEach(foto => {
          if (foto.imageData) {
            allImages.push(foto.imageData);
          }
        });
      }

      console.log("Imagens processadas:", allImages); // Para debug

      setProduct({
        id: data.produto_id,
        name: data.nome,
        price: data.valor,
        stock: data.quantidade,
        images: allImages,
        description: data.descricao || `Produto ${data.nome} do tipo ${data.tipo_produto}. ${data.tipo_comercializacao ? `Comercialização: ${data.tipo_comercializacao}` : ''}`,
        rating: 4.5,
        tipo_produto: data.tipo_produto,
        tipo_comercializacao: data.tipo_comercializacao,
        data_cadastro: data.data_cadastro,
      });
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      Alert.alert("Erro", "Não foi possível carregar os detalhes do produto.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      Alert.alert("Erro", "Quantidade excede o estoque disponível!");
      return;
    }
    addToCart(product, quantity);
    Alert.alert("Sucesso", `${quantity} ${product.name} adicionado ao carrinho!`);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const renderImageThumbnail = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => setSelectedImageIndex(index)}
      style={[
        styles.thumbnail,
        selectedImageIndex === index && styles.activeThumbnail
      ]}
    >
      <Image 
        source={{ uri: item }} 
        style={styles.thumbnailImage}
        onError={(error) => console.log("Erro ao cargar thumbnail:", error)}
      />
    </TouchableOpacity>
  );

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.azulPrincipal} />
        <Text style={styles.loadingText}>Carregando produto...</Text>
      </View>
    );
  }

  const currentImage = product.images[selectedImageIndex];
  const hasMultipleImages = product.images.length > 1;

  console.log("Produto carregado:", product); // Para debug
  console.log("Número de imagens:", product.images.length); // Para debug

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagem principal */}
        <View style={styles.imageContainer}>
          {currentImage ? (
            <Image 
              source={{ uri: currentImage }} 
              style={styles.productImage}
              onError={(error) => console.log("Erro ao cargar imagem principal:", error)}
            />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>Sem Imagem</Text>
            </View>
          )}
        </View>

        {/* Miniaturas das imagens */}
        {hasMultipleImages ? (
          <View style={styles.thumbnailsContainer}>
            <Text style={styles.thumbnailsTitle}>
              {product.images.length} {product.images.length === 1 ? 'imagem' : 'imagens'} disponível{product.images.length === 1 ? '' : 's'}
            </Text>
            <FlatList
              data={product.images}
              renderItem={renderImageThumbnail}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.thumbnailsList}
            />
          </View>
        ) : (
          <View style={styles.thumbnailsContainer}>
            <Text style={styles.thumbnailsTitle}>1 imagem disponível</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Feather name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewsText}>(128 avaliações)</Text>
          </View>

          <Text style={styles.price}>R$ {product.price?.toFixed(2)}</Text>
          
          <View style={styles.productMeta}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Categoria:</Text>
              <Text style={styles.metaValue}>{product.tipo_produto}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Tipo:</Text>
              <Text style={styles.metaValue}>{product.tipo_comercializacao}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.stockContainer}>
            <Text style={[
              styles.stockText, 
              product.stock > 0 ? styles.inStock : styles.outOfStock
            ]}>
              {product.stock > 0
                ? `✅ ${product.stock} unidades disponíveis`
                : "❌ Produto esgotado"
              }
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantitySelector}>
          <Text style={styles.quantityLabel}>Quantidade:</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity <= 1 && styles.disabledQuantityButton
              ]}
              onPress={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Feather name="minus" size={20} color={quantity <= 1 ? "#CCC" : "#333"} />
            </TouchableOpacity>
           
            <Text style={styles.quantityText}>{quantity}</Text>
           
            <TouchableOpacity
              style={[
                styles.quantityButton,
                quantity >= product.stock && styles.disabledQuantityButton
              ]}
              onPress={increaseQuantity}
              disabled={quantity >= product.stock}
            >
              <Feather name="plus" size={20} color={quantity >= product.stock ? "#CCC" : "#333"} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            product.stock === 0 && styles.disabledButton
          ]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Feather name="shopping-cart" size={20} color="white" />
          <Text style={styles.addToCartText}>
            {product.stock === 0 ? "Sem Estoque" : "Adicionar ao Carrinho"}
          </Text>
          <Text style={styles.totalPrice}>
            R$ {(product.price * quantity)?.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderDetails;