import React, { useState, useCallback, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image } from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContextProvider } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext"; // 1. IMPORTAR O HOOK DO SOCKET
import { getSolicitacoes, responderSolicitacao } from "../../services/api";
import styles from "./styles";
import Toast from "react-native-toast-message";
import { colors } from "../../colors";

export default function SolicitacoesScreen({ navigation }) {
    const { user, userRole } = useContextProvider();
    const { socket } = useSocket(); // 2. INICIAR O SOCKET
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSolicitacoes = async () => {
        try {
            !solicitacoes.length && setLoading(true);
            const token = await AsyncStorage.getItem("userToken");
            const response = await getSolicitacoes(token, userRole);
            setSolicitacoes(response);
        } catch (error) {
            console.error("Erro ao carregar solicitações:", error);
            Toast.show({
                type: "error",
                text1: "Erro",
                text2: "Falha ao carregar solicitações",
            });
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
      useCallback(() => {
        fetchSolicitacoes();
      }, [])
    );

    // --- CORREÇÃO APLICADA AQUI (OUVINTES DE EVENTOS) ---
    useEffect(() => {
        if (!socket) return;

        // Empresa ouve por novas solicitações
        if (userRole === 'empresa') {
            socket.on('nova_solicitacao_recebida', (novaSolicitacao) => {
                Toast.show({ type: 'info', text1: 'Nova Solicitação!', text2: `Você recebeu uma nova solicitação.` });
                // Adiciona a nova solicitação no topo da lista
                setSolicitacoes(prev => [novaSolicitacao, ...prev]);
            });
        }

        // Motorista ouve por atualizações nas suas solicitações
        if (userRole === 'motorista') {
            socket.on('solicitacao_atualizada', (solicitacaoAtualizada) => {
                Toast.show({ type: 'info', text1: 'Status Atualizado!', text2: `Sua solicitação foi ${solicitacaoAtualizada.status}.` });
                // Atualiza o item específico na lista
                setSolicitacoes(prev => prev.map(s => s.solicitacao_id === solicitacaoAtualizada.solicitacao_id ? solicitacaoAtualizada : s));
            });
        }

        // Limpeza dos listeners para evitar duplicações
        return () => {
            socket.off('nova_solicitacao_recebida');
            socket.off('solicitacao_atualizada');
        };
    }, [socket, userRole]);


    const handleResponder = async (solicitacaoItem, resposta) => {
        const acao = resposta === 'aceita' ? 'Aceitar' : 'Recusar';
        const statusToast = resposta === 'aceita' ? 'aceita' : 'rejeitada';

        Alert.alert(
            `Confirmar Ação`,
            `Tem certeza que deseja ${acao.toLowerCase()} esta solicitação?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        setLoading(true);
                        try {
                            const token = await AsyncStorage.getItem("userToken");
                            // É importante que a sua API retorne o objeto da solicitação atualizada
                            const solicitacaoAtualizada = await responderSolicitacao(solicitacaoItem.solicitacao_id, resposta, token);
                            
                            // --- CORREÇÃO APLICADA AQUI (EMISSÃO DE EVENTO) ---
                            if (socket && solicitacaoAtualizada) {
                                socket.emit('solicitacao_respondida', solicitacaoAtualizada);
                            }
                            
                            Toast.show({ type: 'success', text1: 'Sucesso!', text2: `Solicitação ${statusToast} com sucesso.` });
                            fetchSolicitacoes();
                        } catch (error) {
                            console.error("Erro ao responder solicitação:", error);
                            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível responder à solicitação.' });
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        
        const outraParte = userRole === 'empresa' ? item.Motorista : item.Empresa;

        return (
            <View style={styles.solicitacaoCard}>
                <View style={styles.cardHeader}>
                    <Text style={styles.motoristaNome}>{outraParte?.nome_completo || 'Usuário não encontrado'}</Text>
                    <Text style={[styles.status, styles[`status_${item.status}`]]}>{item.status}</Text>
                </View>
                <Text style={styles.freteInfo}>Frete ID: {item.Frete.frete_id}</Text>
                
                {userRole === 'empresa' && item.status === 'pendente' && (
                    <View style={styles.botoesContainer}>
                        <TouchableOpacity
                            style={[styles.botao, styles.botaoAceitar]}
                            onPress={() => handleResponder(item, 'aceita')}
                        >
                            <Feather name="check-circle" size={16} color="white" />
                            <Text style={styles.textoBotao}>Aceitar</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.botao, styles.botaoRecusar]}
                            onPress={() => handleResponder(item, 'rejeitada')}
                        >
                            <Feather name="x-circle" size={16} color="white" />
                            <Text style={styles.textoBotao}>Recusar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.firstContainer}>
                <Text style={styles.textheader}>Solicitações de Frete</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.laranjaPrincipal} style={{ flex: 1 }} />
            ) : (
                <FlatList
                    data={solicitacoes}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.solicitacao_id.toString()}
                    contentContainerStyle={styles.listContainer}
                    ListEmptyComponent={
                        <View style={{paddingTop: 50, alignItems: 'center'}}>
                           <Text style={styles.emptyText}>Nenhuma solicitação encontrada.</Text>
                        </View>
                    }
                />
            )}
            <Toast />
        </View>
    );
}
