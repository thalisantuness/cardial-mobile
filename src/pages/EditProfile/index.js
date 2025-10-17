import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useContextProvider } from '../../context/AuthContext';
import { getUserById, updateUserProfile, changePassword, updateUserDocument } from '../../services/api';
import styles from './styles';
import { colors } from '../../colors';

// Componente reutilizável para cada campo de documento
const DocumentEditor = ({ label, docType, docUrl, onUpdate }) => {
    const [isUploading, setIsUploading] = useState(false);
    const { userId } = useContextProvider();

    const handleSelectImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Toast.show({ type: "error", text1: "Permissão negada" });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const mimeType = asset.mimeType || `image/${asset.uri.split(".").pop()}`;
            const base64String = `data:${mimeType};base64,${asset.base64}`;

            Alert.alert(
                "Confirmar Alteração",
                `Deseja substituir o documento "${label}"?`,
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Confirmar",
                        onPress: async () => {
                            try {
                                setIsUploading(true);
                                const token = await AsyncStorage.getItem('userToken');
                                const response = await updateUserDocument(userId, docType, base64String, token);
                                onUpdate(response.usuario); // Atualiza o estado principal
                                Toast.show({ type: 'success', text1: 'Sucesso', text2: `${label} atualizado!` });
                            } catch (error) {
                                console.error(`Erro ao atualizar ${docType}:`, error.response?.data || error);
                                Toast.show({ type: 'error', text1: 'Erro', text2: `Não foi possível atualizar o documento.` });
                            } finally {
                                setIsUploading(false);
                            }
                        }
                    }
                ]
            );
        }
    };

    return (
        <View style={styles.documentContainer}>
            <Text style={styles.documentLabel}>{label}</Text>
            <View style={styles.documentBox}>
                {docUrl ? (
                    <Image source={{ uri: docUrl }} style={styles.documentPreview} />
                ) : (
                    <View style={styles.documentPlaceholder}>
                        <Feather name="image" size={24} color={colors.cinza} />
                    </View>
                )}
                <TouchableOpacity style={styles.changeButton} onPress={handleSelectImage} disabled={isUploading}>
                    {isUploading ? <ActivityIndicator color="white" size="small" /> : <Text style={styles.changeButtonText}>Alterar</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
};


export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { userId, userRole, setUserName, setUserEmail, setUser, logout } = useContextProvider();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({});
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) return;
            try {
                setLoading(true);
                const token = await AsyncStorage.getItem('userToken');
                const userData = await getUserById(userId, token);
                setFormData(userData || {});
            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
                Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível carregar seus dados.' });
            } finally {
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const onDocumentUpdate = (updatedUser) => {
        setFormData(updatedUser);
        setUser(updatedUser);
        AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
    };

    const handleSaveChanges = async () => {
        Alert.alert(
            "Confirmar Alterações",
            "Deseja salvar as alterações de texto no seu perfil?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Salvar",
                    onPress: async () => {
                        try {
                            setSaving(true);
                            const token = await AsyncStorage.getItem('userToken');
                            const response = await updateUserProfile(userId, formData, token);

                            setUserName(response.usuario.nome_completo);
                            setUserEmail(response.usuario.email);
                            setUser(response.usuario);
                            await AsyncStorage.setItem("userData", JSON.stringify(response.usuario));

                            Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Informações atualizadas!' });
                            navigation.goBack();
                        } catch (error) {
                            console.error("Erro ao atualizar perfil:", error.response?.data || error);
                            Toast.show({ type: 'error', text1: 'Erro', text2: error.response?.data?.error || 'Não foi possível salvar as alterações.' });
                        } finally {
                            setSaving(false);
                        }
                    }
                }
            ]
        );
    };

    const handleChangePassword = () => {
        if (!senhaAtual || !novaSenha || !confirmarNovaSenha) {
            Toast.show({ type: 'error', text1: 'Atenção', text2: 'Preencha todos os campos de senha.' });
            return;
        }
        if (novaSenha !== confirmarNovaSenha) {
            Toast.show({ type: 'error', text1: 'Atenção', text2: 'As novas senhas não coincidem.' });
            return;
        }

        Alert.alert(
            "Alterar Senha",
            "Tem certeza que deseja alterar sua senha? Você precisará fazer login novamente.",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        try {
                            setSaving(true);
                            const token = await AsyncStorage.getItem('userToken');
                            await changePassword(userId, { senhaAtual, novaSenha }, token);

                            Toast.show({ type: 'success', text1: 'Sucesso!', text2: 'Senha alterada. Faça login novamente.' });
                            await logout();
                        } catch (error) {
                            console.error("Erro ao alterar senha:", error.response?.data || error);
                            Toast.show({ type: 'error', text1: 'Erro', text2: error.response?.data?.error || 'Não foi possível alterar a senha.' });
                        } finally {
                            setSaving(false);
                        }
                    }
                }
            ]
        )
    };

    const ReferenceInputGroup = ({ title, type, count }) => (
        <>
            <Text style={styles.sectionText}>{title}</Text>
            {[...Array(count)].map((_, index) => (
                <View key={`${type}-${index}`}>
                    <Text style={styles.subSectionText}>{`Referência ${index + 1}`}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome Completo"
                        value={formData[`nome_referencia_${type}_${index + 1}`] || ''}
                        onChangeText={(text) => handleInputChange(`nome_referencia_${type}_${index + 1}`, text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Telefone"
                        value={formData[`numero_referencia_${type}_${index + 1}`] || ''}
                        onChangeText={(text) => handleInputChange(`numero_referencia_${type}_${index + 1}`, text)}
                        keyboardType="phone-pad"
                    />
                </View>
            ))}
        </>
    );

    const renderMotoristaFields = () => (
        <>
            <Text style={styles.sectionText}>Documento</Text>
            <TextInput
                style={styles.input}
                placeholder="CPF"
                value={formData.cpf || ''}
                onChangeText={(text) => handleInputChange('cpf', text)}
                keyboardType="numeric"
                editable={true} 
            />
            <Text style={styles.sectionText}>Dados Pessoais</Text>
            <TextInput
                style={styles.input}
                placeholder="Data de Nascimento (AAAA-MM-DD)"
                value={(formData.data_nascimento || '').split('T')[0]}
                onChangeText={(text) => handleInputChange('data_nascimento', text)}
            />
            <ReferenceInputGroup title="Referências Pessoais" type="pessoal" count={3} />
            <ReferenceInputGroup title="Referências Comerciais" type="comercial" count={2} />
            <ReferenceInputGroup title="Referências de Transportadoras" type="transportadora" count={3} />
        </>
    );

    const renderEmpresaFields = () => (
        <>
            <Text style={styles.sectionText}>Documento</Text>
            <TextInput
                style={styles.input}
                placeholder="CNPJ"
                value={formData.cnpj || ''}
                onChangeText={(text) => handleInputChange('cnpj', text)}
                keyboardType="numeric"
                editable={true} 
            />
            <Text style={styles.sectionText}>Dados do Responsável</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do Responsável"
                value={formData.nome_responsavel_administrativo || ''}
                onChangeText={(text) => handleInputChange('nome_responsavel_administrativo', text)}
            />
            <TextInput
                style={styles.input}
                placeholder="Telefone do Responsável"
                value={formData.telefone_responsavel_administrativo || ''}
                onChangeText={(text) => handleInputChange('telefone_responsavel_administrativo', text)}
                keyboardType="phone-pad"
            />
            <ReferenceInputGroup title="Referências Pessoais" type="pessoal" count={2} />
            <ReferenceInputGroup title="Referências Comerciais" type="comercial" count={2} />
            <ReferenceInputGroup title="Referências de Motoristas" type="motorista" count={3} />
        </>
    );

    const renderBankingFields = () => (
        <>
            <Text style={styles.sectionText}>Dados Bancários</Text>
            <TextInput style={styles.input} placeholder="Banco" value={formData.banco || ''} onChangeText={(text) => handleInputChange('banco', text)} />
            <TextInput style={styles.input} placeholder="Agência" value={formData.agencia || ''} onChangeText={(text) => handleInputChange('agencia', text)} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Número da Conta" value={formData.numero_conta || ''} onChangeText={(text) => handleInputChange('numero_conta', text)} keyboardType="numeric" />
            <TextInput style={styles.input} placeholder="Tipo de Conta (Corrente ou Poupança)" value={formData.tipo_conta || ''} onChangeText={(text) => handleInputChange('tipo_conta', text)} />
            <TextInput style={styles.input} placeholder="Nome do Titular" value={formData.titular_conta || ''} onChangeText={(text) => handleInputChange('titular_conta', text)} />
            <TextInput style={styles.input} placeholder="CPF do Titular" value={formData.cpf_titular_conta || ''} onChangeText={(text) => handleInputChange('cpf_titular_conta', text)} keyboardType="numeric" />
        </>
    );

    const renderMotoristaDocs = () => (
        <>
            <DocumentEditor label="Imagem de Perfil" docType="imagem_perfil" docUrl={formData.imagem_perfil} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="ANTT" docType="antt" docUrl={formData.antt} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="CNH" docType="cnh" docUrl={formData.cnh} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="Comprovante de Residência" docType="comprovante_residencia_motorista" docUrl={formData.comprovante_residencia_motorista} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="CNH do Dono do Caminhão" docType="documento_dono_caminhao" docUrl={formData.documento_dono_caminhao} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="Residência do Dono do Caminhão" docType="comprovante_residencia_dono_caminhao" docUrl={formData.comprovante_residencia_dono_caminhao} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="Doc. Veículo de Tração" docType="placa_1" docUrl={formData.placa_1} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="Doc. Reboque 1" docType="placa_2" docUrl={formData.placa_2} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="Doc. Reboque 2" docType="placa_3" docUrl={formData.placa_3} onUpdate={onDocumentUpdate} />
        </>
    );

    const renderEmpresaDocs = () => (
        <>
            <DocumentEditor label="Imagem de Perfil" docType="imagem_perfil" docUrl={formData.imagem_perfil} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="Alvará de Funcionamento" docType="alvara" docUrl={formData.alvara} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="Comprovante de Endereço da Empresa" docType="comprovante_empresa" docUrl={formData.comprovante_empresa} onUpdate={onDocumentUpdate} />
            <DocumentEditor label="Documento da Empresa (Razão Social)" docType="documento_empresa" docUrl={formData.documento_empresa} onUpdate={onDocumentUpdate} />
        </>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.azulPrincipal} />
                <Text>Carregando seu perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionText}>Dados Principais</Text>
                <TextInput style={styles.input} placeholder="Nome completo ou Razão Social" value={formData.nome_completo || ''} onChangeText={(text) => handleInputChange('nome_completo', text)} />
                <TextInput style={styles.input} placeholder="Email" value={formData.email || ''} onChangeText={(text) => handleInputChange('email', text)} keyboardType="email-address" autoCapitalize="none" />
                <TextInput style={styles.input} placeholder="Celular" value={formData.celular || ''} onChangeText={(text) => handleInputChange('celular', text)} keyboardType="phone-pad" />
                <TextInput style={styles.input} placeholder="Endereço completo" value={formData.endereco || ''} onChangeText={(text) => handleInputChange('endereco', text)} multiline />

                {userRole === 'motorista' && renderMotoristaFields()}
                {userRole === 'empresa' && renderEmpresaFields()}

                {renderBankingFields()}

                <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges} disabled={saving}>
                    {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Salvar Informações</Text>}
                </TouchableOpacity>

                <Text style={styles.sectionText}>Documentos Fotográficos</Text>
                {userRole === 'motorista' && renderMotoristaDocs()}
                {userRole === 'empresa' && renderEmpresaDocs()}

                <Text style={styles.sectionText}>Alterar Senha</Text>
                <TextInput style={styles.input} placeholder="Senha Atual" value={senhaAtual} onChangeText={setSenhaAtual} secureTextEntry />
                <TextInput style={styles.input} placeholder="Nova Senha" value={novaSenha} onChangeText={setNovaSenha} secureTextEntry />
                <TextInput style={styles.input} placeholder="Confirmar Nova Senha" value={confirmarNovaSenha} onChangeText={setConfirmarNovaSenha} secureTextEntry />
                <TouchableOpacity style={[styles.saveButton, styles.passwordButton]} onPress={handleChangePassword} disabled={saving}>
                    {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveButtonText}>Alterar Senha</Text>}
                </TouchableOpacity>
            </ScrollView>
            <Toast />
        </View>
    );
}

