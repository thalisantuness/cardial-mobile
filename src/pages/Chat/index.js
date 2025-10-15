import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Alert, PanResponder, Animated, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSocket } from "../../context/SocketContext";
import { useContextProvider } from "../../context/AuthContext";
import { getMensagens, marcarMensagemComoLida, getDocumentosMotorista } from "../../services/api";
import styles from "./styles";
import { colors } from "../../colors";

export default function ChatScreen({ route, navigation }) {
  const { conversa_id, destinatario, frete_id } = route.params;
  const { socket } = useSocket();
  const { user, loading } = useContextProvider();
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [activeSwipeId, setActiveSwipeId] = useState(null);
  const swipeX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();

  // Função para parsear o endereço (string) em um objeto
  const parsearEndereco = (enderecoStr) => {
    if (!enderecoStr) return {};
    try {
      // Exemplo: "Treze de maio , 785, Prado , Biguaçu /SC, CEP: 97542170"
      const partes = enderecoStr.split(',').map(part => part.trim());
      const cepMatch = enderecoStr.match(/CEP: (\d{5}-\d{3})/);
      const estadoMatch = enderecoStr.match(/\/([A-Z]{2})/);
      const numeroMatch = partes.find(part => /^\d+$/.test(part.trim()));
      const logradouro = partes[0];
      const bairro = partes.find(part => !numeroMatch || part !== numeroMatch) || '';
      const cidade = enderecoStr.split('/')[0].split(',').pop().trim();

      return {
        cep: cepMatch ? cepMatch[1] : '',
        logradouro: logradouro || '',
        bairro: bairro || '',
        numero: numeroMatch || '',
        cidade: cidade || '',
        estado: estadoMatch ? estadoMatch[1] : '',
      };
    } catch (error) {
      console.error("Erro ao parsear endereço:", error);
      return {};
    }
  };

  // Função para enviar todas as informações do motorista
  const enviarDocumentos = async () => {
    if (!socket || !user || user.role !== "motorista") {
      Alert.alert("Erro", "Apenas motoristas podem enviar documentos.");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      // Buscar todos os dados do motorista
      const response = await getDocumentosMotorista(token);
      console.log("Resposta getDocumentosMotorista:", response);
      const motorista = response.dados || {};

      // Parsear o endereço
      const endereco = parsearEndereco(motorista.endereco);

      // Monta a mensagem com apenas os campos preenchidos
      let mensagemMotorista = 'Informações do Motorista:\n\n';

      // Dados Pessoais
      mensagemMotorista += '**Dados Pessoais**\n';
      if (motorista.nome_completo) mensagemMotorista += `- Nome: ${motorista.nome_completo.trim()}\n`;
      if (motorista.email) mensagemMotorista += `- Email: ${motorista.email}\n`;
      if (motorista.cpf) mensagemMotorista += `- CPF: ${motorista.cpf}\n`;
      if (motorista.celular) mensagemMotorista += `- Celular: ${motorista.celular}\n`;
      if (motorista.data_nascimento) {
        const dataNasc = new Date(motorista.data_nascimento).toLocaleDateString('pt-BR');
        mensagemMotorista += `- Data de Nascimento: ${dataNasc}\n`;
      }

      // Endereço
      if (Object.keys(endereco).length > 0) {
        mensagemMotorista += '\n**Endereço**\n';
        if (endereco.cep) mensagemMotorista += `- CEP: ${endereco.cep}\n`;
        if (endereco.logradouro) mensagemMotorista += `- Logradouro: ${endereco.logradouro}\n`;
        if (endereco.bairro) mensagemMotorista += `- Bairro: ${endereco.bairro}\n`;
        if (endereco.numero) mensagemMotorista += `- Número: ${endereco.numero}\n`;
        if (endereco.cidade) mensagemMotorista += `- Cidade: ${endereco.cidade}\n`;
        if (endereco.estado) mensagemMotorista += `- Estado: ${endereco.estado}\n`;
      }

      // Veículo
      if (motorista.numero_placas || motorista.placa_1 || motorista.placa_2 || motorista.placa_3) {
        mensagemMotorista += '\n**Veículo**\n';
        if (motorista.numero_placas) mensagemMotorista += `- Número de Placas: ${motorista.numero_placas}\n`;
        if (motorista.placa_1) mensagemMotorista += `- Placa 1: ${motorista.placa_1}\n`;
        if (motorista.placa_2) mensagemMotorista += `- Placa 2: ${motorista.placa_2}\n`;
        if (motorista.placa_3) mensagemMotorista += `- Placa 3: ${motorista.placa_3}\n`;
      }

      // Documentos
      if (motorista.imagem_perfil || motorista.antt || motorista.cnh || motorista.comprovante_residencia_motorista || motorista.documento_dono_caminhao || motorista.comprovante_residencia_dono_caminhao) {
        mensagemMotorista += '\n**Documentos**\n';
        if (motorista.imagem_perfil) mensagemMotorista += `- Imagem de Perfil: ${motorista.imagem_perfil}\n`;
        if (motorista.antt) mensagemMotorista += `- ANTT: ${motorista.antt}\n`;
        if (motorista.cnh) mensagemMotorista += `- CNH: ${motorista.cnh}\n`;
        if (motorista.comprovante_residencia_motorista) mensagemMotorista += `- Comprovante de Residência: ${motorista.comprovante_residencia_motorista}\n`;
        if (motorista.documento_dono_caminhao) mensagemMotorista += `- Documento do Dono do Caminhão: ${motorista.documento_dono_caminhao}\n`;
        if (motorista.comprovante_residencia_dono_caminhao) mensagemMotorista += `- Comprovante de Residência do Dono do Caminhão: ${motorista.comprovante_residencia_dono_caminhao}\n`;
      }

      // Referências Pessoais
      const referenciasPessoais = [
        { nome: motorista.nome_referencia_pessoal_1, numero: motorista.numero_referencia_pessoal_1 },
        { nome: motorista.nome_referencia_pessoal_2, numero: motorista.numero_referencia_pessoal_2 },
        { nome: motorista.nome_referencia_pessoal_3, numero: motorista.numero_referencia_pessoal_3 },
      ].filter(ref => ref.nome);
      if (referenciasPessoais.length > 0) {
        mensagemMotorista += '\n**Referências Pessoais**\n';
        referenciasPessoais.forEach((ref, index) => {
          mensagemMotorista += `- Referência ${index + 1}: ${ref.nome.trim()} (${ref.numero || "Sem telefone"})\n`;
        });
      }

      // Referências Comerciais
      const referenciasComerciais = [
        { nome: motorista.nome_referencia_comercial_1, numero: motorista.numero_referencia_comercial_1 },
        { nome: motorista.nome_referencia_comercial_2, numero: motorista.numero_referencia_comercial_2 },
        { nome: motorista.nome_referencia_comercial_3, numero: motorista.numero_referencia_comercial_3 },
      ].filter(ref => ref.nome);
      if (referenciasComerciais.length > 0) {
        mensagemMotorista += '\n**Referências Comerciais**\n';
        referenciasComerciais.forEach((ref, index) => {
          mensagemMotorista += `- Referência ${index + 1}: ${ref.nome.trim()} (${ref.numero || "Sem telefone"})\n`;
        });
      }

      // Referências de Transportadoras
      const referenciasTransportadoras = [
        { nome: motorista.nome_referencia_transportadora_1, numero: motorista.numero_referencia_transportadora_1 },
        { nome: motorista.nome_referencia_transportadora_2, numero: motorista.numero_referencia_transportadora_2 },
        { nome: motorista.nome_referencia_transportadora_3, numero: motorista.numero_referencia_transportadora_3 },
      ].filter(ref => ref.nome);
      if (referenciasTransportadoras.length > 0) {
        mensagemMotorista += '\n**Referências de Transportadoras**\n';
        referenciasTransportadoras.forEach((ref, index) => {
          mensagemMotorista += `- Referência ${index + 1}: ${ref.nome.trim()} (${ref.numero || "Sem telefone"})\n`;
        });
      }

      // Conta Bancária
      if (motorista.banco || motorista.agencia || motorista.numero_conta || motorista.tipo_conta || motorista.titular_conta || motorista.cpf_titular_conta) {
        mensagemMotorista += '\n**Conta Bancária**\n';
        if (motorista.banco) mensagemMotorista += `- Banco: ${motorista.banco.trim()}\n`;
        if (motorista.agencia) mensagemMotorista += `- Agência: ${motorista.agencia}\n`;
        if (motorista.numero_conta) mensagemMotorista += `- Número da Conta: ${motorista.numero_conta}\n`;
        if (motorista.tipo_conta) mensagemMotorista += `- Tipo de Conta: ${motorista.tipo_conta}\n`;
        if (motorista.titular_conta) mensagemMotorista += `- Titular: ${motorista.titular_conta.trim()}\n`;
        if (motorista.cpf_titular_conta) mensagemMotorista += `- CPF do Titular: ${motorista.cpf_titular_conta}\n`;
      }

      mensagemMotorista = mensagemMotorista.trim();

      if (!mensagemMotorista || mensagemMotorista === 'Informações do Motorista:') {
        Alert.alert("Erro", "Nenhuma informação disponível para envio.");
        return;
      }

      // Envia a mensagem via socket
      socket.emit("sendMessage", {
        destinatario_id: destinatario.usuario_id,
        conteudo: mensagemMotorista,
        frete_id,
      });

      Alert.alert("Sucesso", "Informações do motorista enviadas com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar informações do motorista:", error);
      Alert.alert("Erro", "Falha ao enviar informações do motorista.");
    }
  };

  useEffect(() => {
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
      navigation.navigate("Login");
      return;
    }

    const fetchMensagens = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const response = await getMensagens(conversa_id, token);

        const unreadMessages = response.filter(msg => !msg.lida && msg.remetente_id !== user.usuario_id);
        if (unreadMessages.length > 0) {
          const markAsReadPromises = unreadMessages.map(msg => marcarMensagemComoLida(msg.mensagem_id, token));
          await Promise.all(markAsReadPromises);
        }

        const messagesMarkedAsRead = response.map(msg => ({ ...msg, lida: true }));
        setMensagens(messagesMarkedAsRead);
      } catch (error) {
        console.error("Erro ao carregar mensagens:", error);
        Alert.alert("Erro", "Falha ao carregar mensagens.");
      }
    };

    fetchMensagens();

    if (socket) {
      socket.on("receivedMessage", (mensagem) => {
        if (mensagem.conversa_id === conversa_id) {
          if (mensagem.remetente_id !== user.usuario_id) {
            AsyncStorage.getItem("userToken").then(token => {
              marcarMensagemComoLida(mensagem.mensagem_id, token);
            });
            setMensagens((prev) => [...prev, { ...mensagem, lida: true }]);
          } else {
            setMensagens((prev) => [...prev, mensagem]);
          }
        }
      });

      return () => {
        socket.off("receivedMessage");
      };
    }
  }, [socket, conversa_id, user, navigation]);

  useEffect(() => {
    if (scrollViewRef.current && mensagens.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [mensagens]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !socket) return;

    socket.emit("sendMessage", {
      destinatario_id: destinatario.usuario_id,
      conteudo: novaMensagem,
      frete_id,
    });
    setNovaMensagem("");
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > 10) {
        swipeX.setValue(gestureState.dx);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (Math.abs(gestureState.dx) > 50) {
        Animated.timing(swipeX, {
          toValue: gestureState.dx > 0 ? 100 : -100,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          Animated.timing(swipeX, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        });
      } else {
        Animated.timing(swipeX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const renderMessageContent = (content, isCurrentUser) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <Text
            key={index}
            style={[
              styles.mensagemText,
              isCurrentUser ? styles.currentUserText : styles.otherUserText,
              styles.linkText
            ]}
            onPress={() => Linking.openURL(part).catch(err => Alert.alert("Erro", "Não foi possível abrir o link."))}
          >
            {part}
          </Text>
        );
      }
      return (
        <Text
          key={index}
          style={[
            styles.mensagemText,
            isCurrentUser ? styles.currentUserText : styles.otherUserText
          ]}
        >
          {part}
        </Text>
      );
    });
  };

  const renderMensagem = (item) => {
    const isCurrentUser = item.remetente_id === user?.usuario_id;

    return (
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.mensagemContainer,
          {
            alignSelf: isCurrentUser ? "flex-end" : "flex-start",
            transform: [{ translateX: activeSwipeId === item.mensagem_id ? swipeX : 0 }],
          },
        ]}
        onTouchStart={() => setActiveSwipeId(item.mensagem_id)}
        onTouchEnd={() => setActiveSwipeId(null)}
      >
        <View style={styles.overlay}>
          {!isCurrentUser && (
            <Image
              source={{ uri: destinatario.imagem_perfil || 'https://placehold.co/40x40/E0E0E0/FFFFFF?text=?' }}
              style={styles.profileImage}
            />
          )}

          <View style={[
            styles.mensagemBubble,
            isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
          ]}>
            {renderMessageContent(item.conteudo, isCurrentUser)}
            {activeSwipeId === item.mensagem_id && (
              <Text style={styles.mensagemTime}>
                {new Date(item.data_envio).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>

          {!isCurrentUser && !item.lida && (
            <Text style={styles.naoLida}>Não lida</Text>
          )}
        </View>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.laranjaPrincipal} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={25} color="white" />
          </TouchableOpacity>
          <Image
            source={{ uri: destinatario.imagem_perfil || 'https://placehold.co/40x40/E0E0E0/FFFFFF?text=?' }}
            style={styles.headerProfileImage}
          />
          <Text style={styles.headerTitle}>{destinatario.nome_completo || destinatario.email}</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView
          contentContainerStyle={styles.messagesContainer}
          ref={scrollViewRef}
        >
          {mensagens.map((item) => (
            <View key={item.mensagem_id.toString()}>
              {renderMensagem(item)}
            </View>
          ))}
        </ScrollView>

        <View style={styles.inputContainer}>
          {user?.role === "motorista" && (
            <TouchableOpacity
              style={styles.documentButton}
              onPress={enviarDocumentos}
            >
              <Feather name="paperclip" size={25} color={colors.laranjaPrincipal} />
            </TouchableOpacity>
          )}
          <TextInput
            style={[styles.input, user?.role === "motorista" ? { flex: 0.8 } : { flex: 1 }]}
            value={novaMensagem}
            onChangeText={setNovaMensagem}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={colors.cinza}
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={enviarMensagem}
            disabled={!novaMensagem.trim()}
          >
            <Feather
              name="send"
              size={25}
              color={novaMensagem.trim() ? colors.laranjaPrincipal : colors.cinza}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}