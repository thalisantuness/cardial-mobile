// src/pages/Store/index.js (COM PROPAGANDA)
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, TextInput, Modal, FlatList, Text, Image, ActivityIndicator, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import styles from "./styles";
import { colors } from "../../colors";

// Componente de Banner Promocional
const PromoBanner = () => {
  const navigation = useNavigation();

  const promos = [
    {
      id: "1",
      title: "Frete Grátis",
      description: "Em compras acima de R$ 100",
      image: "https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=400",
      color: "#4CAF50",
      screen: "Orders"
    },
    {
      id: "2", 
      title: "Ofertas Especiais",
      description: "Até 50% off em eletrônicos",
      image: "https://images.unsplash.com/photo-1468436139062-f60a71c5c892?w=400",
      color: "#FF6B35",
      screen: "Orders"
    },
    {
      id: "3",
      title: "Novidades",
      description: "Lançamentos toda semana",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
      color: "#2196F3",
      screen: "Orders"
    }
  ];

  return (
    <View style={styles.promoContainer}>
      <Text style={styles.promoTitle}>Ofertas Especiais 🎉</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.promoScrollContent}
      >
        {promos.map((promo) => (
          <TouchableOpacity
            key={promo.id}
            style={[styles.promoCard, { backgroundColor: promo.color }]}
            onPress={() => navigation.navigate(promo.screen)}
          >
            <View style={styles.promoContent}>
              <View style={styles.promoTextContainer}>
                <Text style={styles.promoCardTitle}>{promo.title}</Text>
                <Text style={styles.promoCardDescription}>{promo.description}</Text>
                <View style={styles.promoButton}>
                  <Text style={styles.promoButtonText}>Ver Ofertas</Text>
                  <Feather name="arrow-right" size={16} color="white" />
                </View>
              </View>
              <Image
                source={{ uri: promo.image }}
                style={styles.promoImage}
              />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Componente CarrouselTopPlaces atualizado para produtos
const CarrouselTopPlaces = ({ produtos }) => {
  const navigation = useNavigation();
  const { addToCart } = useCart();

  const CardTopLocal = ({ item }) => {
    // Validar URL da imagem
    let imageUri = null;
    try {
      const rawUri = item.imageData || item.foto_principal;
      if (rawUri && 
          typeof rawUri === 'string' && 
          rawUri.trim() !== '' &&
          (rawUri.startsWith('http://') || rawUri.startsWith('https://'))) {
        imageUri = rawUri.trim();
      }
    } catch (e) {
      // Silenciosamente ignora erros de validação
    }

    const secondaryImages = item.photos ? item.photos.slice(0, 3) : [];

    return (
      <View style={styles.divPopularLocation}>
        <View style={styles.divImages}>
          {imageUri ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
              activeOpacity={0.8}
            >
              <Image
                style={styles.imageDecoration}
                source={{ uri: imageUri }}
              />
            </TouchableOpacity>
          ) : (
            <View style={[styles.imageDecoration, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>Sem Imagem</Text>
            </View>
          )}
          
          {/* Imagens secundárias */}
          {secondaryImages.length > 0 && (
            <View style={styles.divAlternativeImages}>
              {secondaryImages.map((image, index) => {
                // Validar cada imagem secundária
                const isValidSecondary = image && 
                                        typeof image === 'string' && 
                                        image.trim() !== '' &&
                                        (image.startsWith('http://') || image.startsWith('https://'));
                
                return isValidSecondary ? (
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
                    activeOpacity={0.7}
                  >
                    <Image
                      style={styles.smallImage}
                      source={{ uri: image.trim() }}
                    />
                  </TouchableOpacity>
                ) : null;
              })}
            </View>
          )}
        </View>

        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => navigation.navigate("ProductDetails", { productId: item.id })}
          activeOpacity={0.7}
        >
          <View style={styles.divInfoLocation}>
            <Text style={styles.textLocationTitle} numberOfLines={2}>{item.nome}</Text>
            <Text style={styles.textLocationPrice}>R$ {item.valor?.toFixed(2)}</Text>
          </View>
       
          <View style={styles.productInfo}>
            <View style={styles.stockInfo}>
              <Text style={styles.stockLabel}>Estoque:</Text>
              <Text style={[
                styles.stockQuantity,
                item.quantidade > 10 ? styles.inStock :
                item.quantidade > 0 ? styles.lowStock : styles.outOfStock
              ]}>
                {item.quantidade} un
              </Text>
            </View>
            <Text style={styles.productCategory}>{item.tipo_produto}</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divToLease}>
          <View style={styles.divQuantityToLease}>
            <Text style={styles.textQuantityNumber}>{item.tipo_comercializacao}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.buttonToLease,
              item.quantidade === 0 && styles.disabledButton
            ]}
            onPress={() => {
              if (item.quantidade > 0) {
                addToCart(item, 1);
                alert(`${item.nome} adicionado ao carrinho!`);
              }
            }}
            disabled={item.quantidade === 0}
          >
            <Text style={styles.buttonTextToLease}>
              {item.quantidade === 0 ? "Esgotado" : "Adicionar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (!produtos || produtos.length === 0) {
    return (
      <View style={styles.carouselContainer}>
        <Text style={styles.noProductsText}>Nenhum produto encontrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <Text style={styles.carouselTitle}>Produtos em Destaque</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id?.toString() || item.produto_id?.toString()}
        renderItem={({ item }) => <CardTopLocal item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContentContainer}
        snapToInterval={310}
        decelerationRate="fast"
      />
    </View>
  );
};

// Componente CardHistoric atualizado para histórico de compras
const CardHistoric = () => {
  return (
    <View style={styles.cardHistoricContainer}>
      <Text style={styles.titleHistoricCard}>Últimas Compras</Text>
      <View style={styles.cardHistoric}>
        <View style={[styles.freightImage, styles.placeholderImage]}>
          <Text style={styles.placeholderText}>Produto</Text>
        </View>
        <View style={styles.infoHistoric}>
          <Text style={styles.titlePlaceHistoric}>Smartphone Samsung Galaxy</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.titlePrice}>Valor</Text>
            <Text style={styles.valuePrice}>R$ 1.299,00</Text>
          </View>
          <View style={styles.purchaseInfo}>
            <Text style={styles.purchaseDate}>Comprado em: 15/12/2024</Text>
            <Text style={styles.purchaseStatus}>Entregue</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const DATA = [{ id: '1' }];

export default function Store() {
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { cart } = useCart();

  // Buscar produtos da API
  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://back-pdv-production.up.railway.app/produtos");
     
      if (Array.isArray(response.data)) {
        const produtosData = response.data.map(produto => ({
          id: produto.produto_id,
          nome: produto.nome,
          valor: produto.valor,
          valor_custo: produto.valor_custo,
          quantidade: produto.quantidade,
          tipo_comercializacao: produto.tipo_comercializacao,
          tipo_produto: produto.tipo_produto,
          foto_principal: produto.foto_principal,
          imageData: produto.imageData,
          photos: produto.photos || [],
          data_cadastro: produto.data_cadastro,
          data_update: produto.data_update
        }));
        setProdutos(produtosData);
        setFilteredProdutos(produtosData);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar produtos pela pesquisa
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProdutos(produtos);
    } else {
      const filtered = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.tipo_produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.id.toString().includes(searchTerm)
      );
      setFilteredProdutos(filtered);
    }
  }, [searchTerm, produtos]);

  function renderModal() {
    return (
      <Modal visible={openModal} animationType="slide" transparent={true}>
        <View style={styles.viewModal}>
          <View style={styles.viewContentModal}>
            <View style={styles.headerModal}>
              <Text style={styles.titleModal}>Buscar Produtos</Text>
              <TouchableOpacity onPress={() => setOpenModal(false)}>
                <Feather name="x" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
  
            <View style={styles.modalLabelForm}>
              <Feather name="search" size={20} color={colors.azulPrincipal} style={styles.modalIconForm} />
              <TextInput
                style={styles.inputModal}
                placeholder="Nome do produto, categoria ou código..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                autoFocus
              />
            </View>
            <View style={styles.searchResults}>
              <Text style={styles.resultsTitle}>
                {filteredProdutos.length} produtos encontrados
              </Text>
              <FlatList
                data={filteredProdutos.slice(0, 5)} // Mostrar apenas 5 resultados no modal
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  // Validar imagem do modal
                  let modalImageUri = null;
                  try {
                    const rawUri = item.imageData || item.foto_principal;
                    if (rawUri && 
                        typeof rawUri === 'string' && 
                        rawUri.trim() !== '' &&
                        (rawUri.startsWith('http://') || rawUri.startsWith('https://'))) {
                      modalImageUri = rawUri.trim();
                    }
                  } catch (e) {
                    // Silenciosamente ignora erros de validação
                  }
                  
                  return (
                    <TouchableOpacity
                      style={styles.searchResultItem}
                      onPress={() => {
                        setOpenModal(false);
                        navigation.navigate("ProductDetails", { productId: item.id });
                      }}
                    >
                      {modalImageUri ? (
                        <Image
                          source={{ uri: modalImageUri }}
                          style={styles.resultImage}
                        />
                      ) : (
                        <View style={[styles.resultImage, styles.placeholderImage]}>
                          <Text style={styles.placeholderText}>Sem Imagem</Text>
                        </View>
                      )}
                      <View style={styles.resultInfo}>
                        <Text style={styles.resultName} numberOfLines={1}>{item.nome}</Text>
                        <Text style={styles.resultPrice}>R$ {item.valor?.toFixed(2)}</Text>
                        <Text style={styles.resultCategory}>{item.tipo_produto}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                showsVerticalScrollIndicator={false}
              />
            </View>
            <TouchableOpacity
              style={styles.buttonSearchPlace}
              onPress={() => setOpenModal(false)}
            >
              <Text style={styles.buttonTextSearchPlace}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const renderItem = () => (
    <View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.azulPrincipal} />
          <Text style={styles.loadingText}>Carregando produtos...</Text>
        </View>
      ) : (
        <>
          <PromoBanner />
          <CarrouselTopPlaces produtos={filteredProdutos} />
          {/* <CardHistoric /> */}
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.divSearchNotify}>
        <TouchableOpacity onPress={() => setOpenModal(true)} style={styles.buttonInputSearchLocation}>
          <TextInput
            placeholder="Buscar produtos..."
            style={styles.inputSearchPlaceholder}
            editable={false}
            value={searchTerm}
          />
          <Feather name="search" size={24} color={colors.azulPrincipal} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Carrinho")}
        >
          <Feather name="shopping-cart" size={24} color={colors.azulPrincipal} />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.reduce((sum, item) => sum + item.quantity, 0)}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={null}
      />
      {renderModal()}
    </View>
  );
}