import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const GiftsScreen = ({ navigation }) => {
  const { user, logout } = useContextProvider();
  const [userPoints, setUserPoints] = useState(1500); // Pontos mockados
  const [totalIndications, setTotalIndications] = useState(12); // Indicações mockadas

  const features = [
    {
      id: "1",
      title: "Indicar Amigos",
      description: "Indique amigos e ganhe pontos",
      icon: "users",
      screen: "IndicateFriend",
      color: "#4CAF50"
    },
    {
      id: "2",
      title: "Minhas Indicações",
      description: "Veja suas indicações realizadas",
      icon: "list",
      screen: "MyIndications",
      color: "#2196F3"
    },
    {
      id: "3",
      title: "Recompensas",
      description: "Resgate seus pontos por prêmios",
      icon: "gift",
      screen: "Rewards",
      color: "#FF9800"
    },
    {
      id: "4",
      title: "Histórico",
      description: "Seu histórico de resgates",
      icon: "clock",
      screen: "RewardsHistory",
      color: "#9C27B0"
    }
  ];

  const rewards = [
    {
      id: "1",
      name: "Vale Presente R$ 50",
      points: 1000,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200",
    },
    {
      id: "2",
      name: "Frete Grátis",
      points: 500,
      image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200",
    },
    {
      id: "3",
      name: "Desconto 20%",
      points: 300,
      image: "https://images.unsplash.com/photo-1563013546-7e5c7d0e6c8f?w=200",
    }
  ];

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da aplicação?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: logout }
      ]
    );
  };

  const handleQuickAction = (screen) => {
    navigation.navigate(screen);
  };

  const handleRedeemReward = (reward) => {
    if (userPoints >= reward.points) {
      Alert.alert(
        "Resgatar Recompensa",
        `Deseja resgatar ${reward.name} por ${reward.points} pontos?`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Resgatar", 
            onPress: () => {
              setUserPoints(userPoints - reward.points);
              Alert.alert("Sucesso!", `Você resgatou: ${reward.name}`);
            }
          }
        ]
      );
    } else {
      Alert.alert(
        "Pontos Insuficientes",
        `Você precisa de ${reward.points} pontos para resgatar esta recompensa.`
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.firstContainer}>
        <Text style={styles.textheader}>TRUCKAGE APP</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={25} color="white" />
        </TouchableOpacity>
      </View>

      {/* Welcome Section */}
      <View style={styles.secondContainer}>
        <Text style={styles.title}>Bem-vindo {user?.name || "Usuário"}</Text>
        <Text style={styles.subtitle}>O que você gostaria de fazer hoje?</Text>
      </View>

      {/* Hero Section */}
      <View style={styles.viewWelcome}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeTitle}>Indique e Ganhe!</Text>
          <Text style={styles.welcomeSubtitle}>
            Cada indicação vale pontos. Acumule e troque por recompensas especiais!
          </Text>
        </View>

        <Image
          source={{ uri: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=150" }}
          style={styles.imageTrucker}
          resizeMode="contain"
        /> 
      </View>

      {/* Stats Cards */}
      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Feather name="award" size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>{userPoints}</Text>
            <Text style={styles.statLabel}>Pontos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Feather name="users" size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>{totalIndications}</Text>
            <Text style={styles.statLabel}>Indicações</Text>
          </View>
          
          <View style={styles.statCard}>
            <Feather name="gift" size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Resgates</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            {features.map((feature) => (
              <TouchableOpacity
                key={feature.id}
                style={styles.actionCard}
                onPress={() => handleQuickAction(feature.screen)}
              >
                <View style={[styles.actionIcon, { backgroundColor: feature.color }]}>
                  <Feather name={feature.icon} size={24} color="white" />
                </View>
                <Text style={styles.actionTitle}>{feature.title}</Text>
                <Text style={styles.actionDescription}>{feature.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Available Rewards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recompensas Disponíveis</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Rewards")}>
              <Text style={styles.seeAllText}>Ver todas</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.rewardsScroll}
          >
            {rewards.map((reward) => (
              <TouchableOpacity
                key={reward.id}
                style={styles.rewardCard}
                onPress={() => handleRedeemReward(reward)}
              >
                <Image
                  source={{ uri: reward.image }}
                  style={styles.rewardImage}
                />
                <View style={styles.rewardInfo}>
                  <Text style={styles.rewardName}>{reward.name}</Text>
                  <View style={styles.pointsContainer}>
                    <Feather name="award" size={16} color="#FF6B35" />
                    <Text style={styles.pointsText}>{reward.points} pontos</Text>
                  </View>
                  <TouchableOpacity 
                    style={[
                      styles.redeemButton,
                      userPoints < reward.points && styles.redeemButtonDisabled
                    ]}
                    disabled={userPoints < reward.points}
                  >
                    <Text style={styles.redeemButtonText}>
                      {userPoints >= reward.points ? "Resgatar" : "Pontos insuficientes"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* How it Works */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como Funciona</Text>
          <View style={styles.howItWorks}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.stepText}>Indique amigos usando seu código</Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.stepText}>Ganhe pontos quando eles se cadastrarem</Text>
            </View>
            
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <Text style={styles.stepText}>Resgate seus pontos por recompensas</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GiftsScreen;