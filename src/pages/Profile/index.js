import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'; 
import { Ionicons, Feather } from '@expo/vector-icons';
import { useContextProvider } from "../../context/AuthContext";
import styles from "./styles";

export default function ProfileScreen({ navigation }) {
  const {
    userName,
    userEmail,
    userCreatedAt,
    userRole,
    user
  } = useContextProvider();

  // Formatar a data de criação
  const formattedDate = userCreatedAt ? new Date(userCreatedAt).toLocaleDateString('pt-BR') : 'Não disponível';

  // Traduzir o role
  const roleTranslations = {
    'motorista': 'Motorista',
    'empresa': 'Empresa',
    'admin': 'Administrador'
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {/* 2. Envolver o conteúdo em um ScrollView */}
      <ScrollView contentContainerStyle={styles.profileContent}>
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          {user?.imagem_perfil ? (
            <Image
              source={{ uri: user.imagem_perfil }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profileIcon}>
              <Ionicons name="person" size={60} color="#FF6D00" />
            </View>
          )}
        </View>

        {/* User Info */}
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={24} color="#FF6D00" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Nome completo</Text>
              <Text style={styles.infoValue}>{userName || 'Não informado'}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} color="#FF6D00" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userEmail}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoItem}>
            <Ionicons name="briefcase-outline" size={24} color="#FF6D00" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Tipo de conta</Text>
              <Text style={styles.infoValue}>{roleTranslations[userRole] || userRole}</Text>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={24} color="#FF6D00" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Membro desde</Text>
              <Text style={styles.infoValue}>{formattedDate}</Text>
            </View>
          </View>
        </View>

        {/* Edit Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Text style={styles.editButtonText}>Editar Perfil</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}