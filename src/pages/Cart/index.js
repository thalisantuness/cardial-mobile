import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";

const CartScreen = ({ route, navigation }) => {
  const { cart } = route.params || { cart: [] };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      // Em uma implementação real, você atualizaria o estado global do carrinho
      Alert.alert("Info", "Quantidade atualizada - implementar estado global");
    }
  };

  const removeFromCart = (productId) => {
    Alert.alert(
      "Remover produto",
      "Deseja remover este produto do carrinho?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive",
          onPress: () => {
            Alert.alert("Sucesso", "Produto removido do carrinho - implementar estado global");
          }
        }
      ]
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>R$ {item.price.toFixed(2)}</Text>
        
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
          R$ {(item.price * item.quantity).toFixed(2)}
        </Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Feather name="trash-2" size={16} color="#FF4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
            onPress={() => navigation.navigate("Orders")}
          >
            <Text style={styles.continueShoppingText}>Continuar Comprando</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id}
            renderItem={renderCartItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.cartList}
          />
          
          <View style={styles.footer}>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalPrice}>R$ {getTotalPrice().toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={() => navigation.navigate("Checkout", { cart, total: getTotalPrice() })}
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