// src/pages/Store/index.js
import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Modal, FlatList, Text, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import { colors } from "../../colors";
// import SectionFilterTypes from "../../components/SectionFilterTypes"; // Temporariamente comentado para renderizar; crie o componente depois

// Componente placeholder para SectionFilterTypes (simples, para renderizar)


// Componente CarrouselTopPlaces inline
const CarrouselTopPlaces = () => {
  const offices = [
    { id: 1, title: "Frete Rápido SP", value: 500, image: require("../../../assets/trucker.png"), numberLocations: 5 },
     { id: 1, title: "Frete Rápido SP", value: 500, image: require("../../../assets/trucker.png"), numberLocations: 5 },
      { id: 1, title: "Frete Rápido SP", value: 500, image: require("../../../assets/trucker.png"), numberLocations: 5 },
    // Adicione mais itens conforme necessário
  ];

  const CardTopLocal = ({ item }) => {
    const navigation = useNavigation();
    return (
      <View style={styles.divPopularLocation}>
        <View style={styles.divImages}>
          <Image style={styles.imageDecoration} source={item.image} />
          <View style={styles.divAlternativeImages} />
        </View>
        <View style={styles.divInfoLocation}>
          <Text style={styles.textLocationTitle}>{item.title}</Text>
          <Text style={styles.textLocationPrice}>R$ {item.value}</Text>
        </View>
        <View style={styles.divToLease}>
          <View style={styles.divQuantityToLease}>
            <Text style={styles.textQuantityNumber}>{item.numberLocations}</Text>
            <Text style={styles.textLocation}>Fretes</Text>
          </View>
          <TouchableOpacity
            style={styles.buttonToLease}
            onPress={() => navigation.navigate("Fretes")}
          >
            <Text style={styles.buttonTextToLease}>Solicitar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={offices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CardTopLocal item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        contentContainerStyle={styles.carouselContentContainer}
      />
    </View>
  );
};

// Componente CardHistoric inline
const CardHistoric = () => {
  return (
    <View style={styles.cardHistoricContainer}>
      <Text style={styles.titleHistoricCard}>Histórico de Fretes</Text>
      <View style={styles.cardHistoric}>
        <Image source={require("../../../assets/trucker.png")} style={styles.freightImage} />
        <View style={styles.infoHistoric}>
          <Text style={styles.titlePlaceHistoric}>Frete para Porto Alegre</Text>
          <View>
            <Text style={styles.titlePrice}>Custo</Text>
            <Text style={styles.valuePrice}>R$ 150,00</Text>
          </View>
          <View>
            <View style={styles.infoUser}>
              <Image style={styles.avatarUser} source={require("../../../assets/trucker.png")} />
              <View style={styles.infoUserDetails}>
                <Text style={styles.userName}>João Truck</Text>
                <Text style={styles.userHandle}>@joaotruck</Text>
              </View>
              <TouchableOpacity style={styles.buttonDetails}>
                <Text style={styles.textDetails}>Detalhes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const DATA = [{ id: '1' }]; // Placeholder

export default function Store() {
  const [openModal, setOpenModal] = useState(false);
  const navigation = useNavigation();

  function renderModal() {
    return (
      <Modal visible={openModal} animationType="slide" transparent={true}>
        <View style={styles.viewModal}>
          <View style={styles.viewContentModal}>
            <View style={styles.headerModal}>
              <Text style={styles.titleModal}>Encontre seu frete</Text>
              <TouchableOpacity onPress={() => setOpenModal(false)}>
                <Feather name="x-square" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
   
            <View style={styles.modalLabelForm}>
              <Feather name="map-pin" size={15} color={colors.cinza} style={styles.modalIconForm} />
              <TextInput style={styles.inputModal} placeholder="Destino" />
            </View>
            <View style={styles.modalLabelForm}>
              <Feather name="calendar" size={15} color={colors.cinza} style={styles.modalIconForm} />
              <TextInput style={styles.inputModal} placeholder="Data de partida" />
            </View>
            <View style={styles.modalLabelForm}>
              <Feather name="calendar" size={15} color={colors.cinza} style={styles.modalIconForm} />
              <TextInput style={styles.inputModal} placeholder="Data de chegada" />
            </View>
            <TouchableOpacity style={styles.buttonSearchPlace}>
              <Text style={styles.buttonTextSearchPlace}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  const renderItem = () => (
    <View>
      <CarrouselTopPlaces />
      <CardHistoric />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.divSearchNotify}>
        <TouchableOpacity onPress={() => setOpenModal(true)} style={styles.buttonInputSearchLocation}>
          <TextInput placeholder="Para onde?" style={styles.inputSearchPlaceholder} editable={false} />
          <Feather name="search" size={30} color={colors.laranjaPrincipal} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      {renderModal()}
    </View>
  );
}