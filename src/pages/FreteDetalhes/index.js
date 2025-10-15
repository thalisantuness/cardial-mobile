import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { getFretes, solicitarFrete, deletarFrete } from '../../services/api';
import { useContextProvider } from '../../context/AuthContext';
import styles from './styles';
import { colors } from '../../colors';

export default function FreteDetalhesScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { frete_id } = route.params;
    const { user, userRole } = useContextProvider();

    const [frete, setFrete] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchFrete = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const fretes = await getFretes(token);
            const freteDetalhe = fretes.find(f => f.frete_id === frete_id);
            setFrete(freteDetalhe);
        } catch (error) {
            console.error("Erro ao buscar detalhes do frete:", error);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar os detalhes do frete.' });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFrete();
        }, [frete_id])
    );

    const handleSolicitar = async () => {
        Alert.alert(
            "Confirmar Solicitação",
            "Tem certeza que deseja solicitar este frete?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const token = await AsyncStorage.getItem('userToken');
                            await solicitarFrete(frete.frete_id, token);
                            Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Solicitação enviada!' });
                            navigation.goBack();
                        } catch (error) {
                            console.error("Erro ao solicitar frete:", error);
                            Toast.show({ type: 'error', text1: 'Erro', text2: error.response?.data?.error || 'Não foi possível solicitar o frete.' });
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    const handleEditar = () => {
        navigation.navigate('CriarFrete', { frete });
    };

    const handleExcluir = async () => {
        Alert.alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir este frete? Esta ação não pode ser desfeita.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            const token = await AsyncStorage.getItem('userToken');
                            await deletarFrete(frete.frete_id, token);
                            Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Frete excluído com sucesso.' });
                            navigation.goBack();
                        } catch (error) {
                            console.error("Erro ao excluir frete:", error);
                            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível excluir o frete.' });
                        } finally {
                            setLoading(false);
                        }
                    },
                },
            ]
        );
    };

    if (loading) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} size="large" color={colors.laranjaPrincipal} />;
    }

    if (!frete) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Feather name="arrow-left" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Detalhes do Frete</Text>
                    <View style={styles.headerRightPlaceholder} />
                </View>
                <Text style={styles.infoText}>Frete não encontrado.</Text>
            </View>
        );
    }

    const DetailRow = ({ label, value }) => (
        value ? (
            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{label}:</Text>
                <Text style={styles.detailValue}>{String(value)}</Text>
            </View>
        ) : null
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Detalhes do Frete #{frete.frete_id}</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <DetailRow label="Origem" value={`${frete.origem_cidade} - ${frete.origem_estado}`} />
                <DetailRow label="Destino" value={`${frete.destino_cidade} - ${frete.destino_estado}`} />
                <DetailRow label="Valor" value={`R$ ${parseFloat(frete.valor_frete).toFixed(2)}`} />
                <DetailRow label="Previsão de Entrega" value={new Date(frete.data_prevista_entrega).toLocaleDateString('pt-BR')} />
                <DetailRow label="Precisa Lona" value={frete.precisa_lona ? 'Sim' : 'Não'} />
                <DetailRow label="Produto Químico" value={frete.produto_quimico ? 'Sim' : 'Não'} />
                <DetailRow label="Veículo de Tração" value={frete.veiculo_tracao} />
                <DetailRow label="Tipos de Carreta" value={frete.tipos_carreta} />
                <DetailRow label="Comprimento" value={frete.comprimento_carreta} />
                <DetailRow label="Nº de Eixos" value={frete.numero_eixos} />
                <DetailRow label="Configuração" value={frete.configuracao_modelo} />
                <DetailRow label="Tipo de Carga" value={frete.tipo_carga} />
                <DetailRow label="Observações Motorista" value={frete.observacoes_motorista} />
                <DetailRow label="Observações Carga" value={frete.observacoes_carga} />
            </ScrollView>
            {userRole === 'motorista' && frete.status === 'anunciado' && (
                <TouchableOpacity style={styles.actionButton} onPress={handleSolicitar}>
                    <Text style={styles.actionButtonText}>Solicitar Frete</Text>
                </TouchableOpacity>
            )}
            {userRole === 'empresa' && frete.empresa_id === user.usuario_id && (
                <View style={styles.empresaActions}>
                    <TouchableOpacity style={[styles.actionButton, styles.editButton]} onPress={handleEditar}>
                        <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={handleExcluir}>
                        <Text style={styles.actionButtonText}>Excluir</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}
