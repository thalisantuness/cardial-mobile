import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    Alert.alert("Sucesso", `${quantity} ${product.name} adicionado ao carrinho!`);
    navigation.goBack();
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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: product.image }} style={styles.productImage} />
        
        <View style={styles.content}>
          <Text style={styles.productName}>{product.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Feather name="star" size={20} color="#FFD700" />
            <Text style={styles.ratingText}>{product.rating}</Text>
            <Text style={styles.reviewsText}>(128 avaliações)</Text>
          </View>

          <Text style={styles.price}>R$ {product.price.toFixed(2)}</Text>
          
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.stockContainer}>
            <Text style={styles.stockText}>
              {product.stock > 0 
                ? `${product.stock} unidades disponíveis` 
                : "Produto esgotado"
              }
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={decreaseQuantity}
            disabled={quantity <= 1}
          >
            <Feather name="minus" size={20} color={quantity <= 1 ? "#CCC" : "#333"} />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={increaseQuantity}
            disabled={quantity >= product.stock}
          >
            <Feather name="plus" size={20} color={quantity >= product.stock ? "#CCC" : "#333"} />
          </TouchableOpacity>
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
            R$ {(product.price * quantity).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;