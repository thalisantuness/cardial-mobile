// src/pages/Cart/index.js (atualizado)
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import styles from "./styles";

const CartScreen = ({ navigation }) => {
  const { cart, updateQuantity, removeFromCart, getTotal } = useCart();

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
  };

  const renderCartItem = ({ item }) => {
    // Validar imagem do carrinho
    let cartImageUri = null;
    try {
      const rawUri = item.image || item.foto_principal;
      if (rawUri && 
          typeof rawUri === 'string' && 
          rawUri.trim() !== '' &&
          (rawUri.startsWith('http://') || rawUri.startsWith('https://'))) {
        cartImageUri = rawUri.trim();
      }
    } catch (e) {
      // Silenciosamente ignora erros de validação
    }
    
    return (
      <View style={styles.cartItem}>
        {cartImageUri ? (
          <Image 
            source={{ uri: cartImageUri }} 
            style={styles.productImage}
          />
        ) : (
          <View style={[styles.productImage, { backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }]}>
            <Feather name="package" size={24} color="#999" />
          </View>
        )}
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name || item.nome}</Text>
        <Text style={styles.productPrice}>R$ {(item.price || item.valor)?.toFixed(2)}</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Feather name="minus" size={16} color="#333" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Feather name="plus" size={16} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.itemActions}>
        <Text style={styles.itemTotal}>
          R$ {((item.price || item.valor) * item.quantity)?.toFixed(2)}
        </Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveFromCart(item.id)}
        >
          <Feather name="trash-2" size={16} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  const totalPrice = getTotal();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Carrinho</Text>
        <View style={styles.placeholder} />
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="shopping-cart" size={64} color="#CCC" />
          <Text style={styles.emptyTitle}>Carrinho vazio</Text>
          <Text style={styles.emptyText}>
            Adicione alguns produtos ao carrinho para continuar
          </Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cartList}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>R$ {totalPrice?.toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("Checkout", { cart, total: totalPrice })}
            >
              <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
              <Feather name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

export default CartScreen;