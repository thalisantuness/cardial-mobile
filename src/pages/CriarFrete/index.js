import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Modal, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContextProvider } from '../../context/AuthContext';
import { criarFrete, atualizarFrete } from '../../services/api';
import styles from './styles';
import { colors } from '../../colors';
import DateTimePicker from '@react-native-community/datetimepicker';

const veiculoTracaoOptions = ["Caminhonete", "3/4", "3/4 Trucado", "Toco", "Truck", "Bitruck", "Cavalo Simples", "Cavalo Trucado", "Trucado Eixo Aux."];
const tiposCarretaOptions = ["Graneleiro", "Aberta", "Basculante", "Baú", "Sider", "Refrigerado", "Tanque", "Prancha", "Boiadeiro", "Gaiola", "Porta Container", "Cegonha"];
const comprimentoCarretaOptions = ["12,40 mt.", "13,00 mt.", "13,50 mt.", "14,00 mt", "14,50 mt.", "15,00 mt.", "15,50 mt.", "Mais..."];
const numeroEixosOptions = ["2 eixos", "3 eixos", "4 eixos", "Vanderleia", "Canguru", "Mais de 4 eixos"];
const configModeloOptions = ["Bitrem", "Tritrem", "Rodotrem", "Especial"];

const SimNaoSelector = ({ title, value, onSelect }) => (
    <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.checkboxGroupRow}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => onSelect(true)}>
                <View style={[styles.checkbox, value === true && styles.checkboxChecked]}>
                    {value === true && <Feather name="check" size={14} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => onSelect(false)}>
                <View style={[styles.checkbox, value === false && styles.checkboxChecked]}>
                    {value === false && <Feather name="check" size={14} color="white" />}
                </View>
                <Text style={styles.checkboxLabel}>Não</Text>
            </TouchableOpacity>
        </View>
    </View>
);

// Componente reutilizável para checkboxes de seleção múltipla
const MultiCheckboxGroup = ({ title, options, selectedOptions, onSelect }) => (
    <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.checkboxGroup}>
            {options.map((option) => (
                <TouchableOpacity
                    key={option}
                    style={styles.checkboxContainer}
                    onPress={() => onSelect(option)}
                >
                    <View style={[styles.checkbox, selectedOptions[option] && styles.checkboxChecked]}>
                        {selectedOptions[option] && <Feather name="check" size={14} color="white" />}
                    </View>
                    <Text style={styles.checkboxLabel}>{option}</Text>
                </TouchableOpacity>
            ))}
        </View>
    </View>
);

// Função para formatar valor para Real brasileiro
const formatarParaReal = (valor) => {
  if (!valor) return '';
  
  // Converte para número e formata
  const numero = parseFloat(valor.toString().replace(/\D/g, '') || 0) / 100;
  
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

// Função para converter valor formatado de volta para número
const formatarParaNumero = (valorFormatado) => {
  // Remove todos os caracteres não numéricos, exceto vírgula e ponto
  const apenasNumeros = valorFormatado.replace(/[^\d,]/g, '');
  
  // Substitui vírgula por ponto para parseFloat
  const numeroString = apenasNumeros.replace(',', '.');
  
  // Converte para número
  const numero = parseFloat(numeroString) || 0;
  
  return numero.toString();
};

export default function CriarFreteScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { user } = useContextProvider();
    const freteParaEditar = route.params?.frete;

    const [loading, setLoading] = useState(false);

    // Função para inicializar o estado dos checkboxes a partir de uma string
    const initializeCheckboxState = (options, stringValue) => {
        const selected = stringValue ? stringValue.split(',').map(s => s.trim()) : [];
        return options.reduce((acc, option) => {
            acc[option] = selected.includes(option);
            return acc;
        }, {});
    };

    const [form, setForm] = useState({
        origem_estado: freteParaEditar?.origem_estado || '',
        origem_cidade: freteParaEditar?.origem_cidade || '',
        destino_estado: freteParaEditar?.destino_estado || '',
        destino_cidade: freteParaEditar?.destino_cidade || '',
        valor_frete: String(freteParaEditar?.valor_frete || ''),
        data_prevista_entrega: freteParaEditar ? new Date(freteParaEditar.data_prevista_entrega) : new Date(),
        precisa_lona: freteParaEditar?.precisa_lona ?? null,
        produto_quimico: freteParaEditar?.produto_quimico ?? null,
        observacoes_motorista: freteParaEditar?.observacoes_motorista || '',
        veiculo_tracao: initializeCheckboxState(veiculoTracaoOptions, freteParaEditar?.veiculo_tracao),
        tipos_carreta: initializeCheckboxState(tiposCarretaOptions, freteParaEditar?.tipos_carreta),
        comprimento_carreta: initializeCheckboxState(comprimentoCarretaOptions, freteParaEditar?.comprimento_carreta),
        numero_eixos: initializeCheckboxState(numeroEixosOptions, freteParaEditar?.numero_eixos),
        configuracao_modelo: initializeCheckboxState(configModeloOptions, freteParaEditar?.configuracao_modelo),
        tipo_carga: freteParaEditar?.tipo_carga || '',
        observacoes_carga: freteParaEditar?.observacoes_carga || ''
    });

    const [showDatePicker, setShowDatePicker] = useState(false);

    const [estados, setEstados] = useState([]);
    const [cidades, setCidades] = useState([]);
    const [loadingLocalidades, setLoadingLocalidades] = useState(false);
    const [modalLocalidade, setModalLocalidade] = useState({ visible: false, type: null });

    useEffect(() => {
        const fetchEstados = async () => {
            setLoadingLocalidades(true);
            try {
                const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
                const data = await response.json();
                setEstados(data);
            } catch (error) {
                console.error("Erro ao buscar estados:", error);
            } finally {
                setLoadingLocalidades(false);
            }
        };
        fetchEstados();
    }, []);

    const fetchCidades = async (uf) => {
        if (!uf) return;
        setLoadingLocalidades(true);
        setCidades([]);
        try {
            const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
            const data = await response.json();
            setCidades(data);
        } catch (error) {
            console.error("Erro ao buscar cidades:", error);
        } finally {
            setLoadingLocalidades(false);
        }
    };

    const handleSelectEstado = (uf, type) => {
        if (type === 'origem') {
            handleInputChange('origem_estado', uf);
            handleInputChange('origem_cidade', '');
            fetchCidades(uf);
        } else {
            handleInputChange('destino_estado', uf);
            handleInputChange('destino_cidade', '');
            fetchCidades(uf);
        }
        setModalLocalidade({ visible: false, type: null });
    }

    const handleSelectCidade = (cidade, type) => {
        if (type === 'origem') {
            handleInputChange('origem_cidade', cidade);
        } else {
            handleInputChange('destino_cidade', cidade);
        }
        setModalLocalidade({ visible: false, type: null });
    }

    const handleInputChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleCheckboxChange = (field, option) => {
        setForm(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [option]: !prev[field][option]
            }
        }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            handleInputChange('data_prevista_entrega', selectedDate);
        }
    };

    // Converte o objeto de checkboxes em uma string antes de enviar para a API
    const getCheckboxString = (optionsObject) => {
        return Object.keys(optionsObject).filter(key => optionsObject[key]).join(', ');
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const payload = {
                // Campos que já são strings ou booleanos
                origem_estado: form.origem_estado,
                origem_cidade: form.origem_cidade,
                destino_estado: form.destino_estado,
                destino_cidade: form.destino_cidade,
                data_prevista_entrega: form.data_prevista_entrega,
                precisa_lona: form.precisa_lona,
                produto_quimico: form.produto_quimico,
                observacoes_motorista: form.observacoes_motorista,
                observacoes_carga: form.observacoes_carga,
                tipo_carga: form.tipo_carga,
                // Campos que precisam de conversão
                empresa_id: user.usuario_id,
                valor_frete: parseFloat(form.valor_frete) || 0,
                // Converte os objetos de checkbox em strings
                veiculo_tracao: getCheckboxString(form.veiculo_tracao),
                tipos_carreta: getCheckboxString(form.tipos_carreta),
                comprimento_carreta: getCheckboxString(form.comprimento_carreta),
                numero_eixos: getCheckboxString(form.numero_eixos),
                configuracao_modelo: getCheckboxString(form.configuracao_modelo),
            };

            if (freteParaEditar) {
                await atualizarFrete(freteParaEditar.frete_id, payload, token);
                Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Frete atualizado com sucesso!' });
            } else {
                await criarFrete(payload, token);
                Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Frete criado com sucesso!' });
            }
            navigation.goBack();
        } catch (error) {
            console.error("Erro ao salvar frete:", error);
            Toast.show({ type: 'error', text1: 'Erro', text2: 'Não foi possível salvar o frete.' });
        } finally {
            setLoading(false);
        }
    };

    const renderLocalidadeModal = () => (
        <Modal
            transparent={true}
            visible={modalLocalidade.visible}
            onRequestClose={() => setModalLocalidade({ visible: false, type: null })}
        >
            <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalLocalidade({ visible: false, type: null })}>
                <View style={[styles.modalContent, { height: '80%' }]}>
                    {loadingLocalidades ? <ActivityIndicator size="large" color={colors.azulPrincipal} /> : (
                        <FlatList
                            data={modalLocalidade.type?.includes('Estado') ? estados : cidades}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalOption}
                                    onPress={() => {
                                        if (modalLocalidade.type?.includes('Estado')) {
                                            handleSelectEstado(item.sigla, modalLocalidade.type.includes('origem') ? 'origem' : 'destino');
                                        } else {
                                            handleSelectCidade(item.nome, modalLocalidade.type.includes('origem') ? 'origem' : 'destino');
                                        }
                                    }}
                                >
                                    <Text style={styles.modalOptionText}>{item.nome} {item.sigla ? `(${item.sigla})` : ''}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                </View>
            </TouchableOpacity>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{freteParaEditar ? 'Editar Frete' : 'Criar Novo Frete'}</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Embarque</Text>
                <TouchableOpacity style={styles.input} onPress={() => setModalLocalidade({ visible: true, type: 'origemEstado' })}>
                    <Text style={styles.pickerText}>{form.origem_estado || 'Selecione o Estado de Origem'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.input, !form.origem_estado && styles.inputDisabled]}
                    onPress={() => setModalLocalidade({ visible: true, type: 'origemCidade' })}
                    disabled={!form.origem_estado}
                >
                    <Text style={styles.pickerText}>{form.origem_cidade || 'Selecione a Cidade de Origem'}</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Entrega</Text>
                <TouchableOpacity style={styles.input} onPress={() => setModalLocalidade({ visible: true, type: 'destinoEstado' })}>
                    <Text style={styles.pickerText}>{form.destino_estado || 'Selecione o Estado de Destino'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.input, !form.destino_estado && styles.inputDisabled]}
                    onPress={() => setModalLocalidade({ visible: true, type: 'destinoCidade' })}
                    disabled={!form.destino_estado}
                >
                    <Text style={styles.pickerText}>{form.destino_cidade || 'Selecione a Cidade de Destino'}</Text>
                </TouchableOpacity>


                <Text style={styles.sectionTitle}>Detalhes Financeiros e Prazos</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Valor do Frete (Ex: R$ 10.000,00)" 
                  keyboardType="numeric" 
                  value={formatarParaReal(form.valor_frete)} 
                  onChangeText={(v) => handleInputChange('valor_frete', formatarParaNumero(v))} 
                />
                <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                    <Text>Previsão de Entrega: {form.data_prevista_entrega.toLocaleDateString('pt-BR')}</Text>
                    <Feather name="calendar" size={20} color={colors.cinza} />
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={form.data_prevista_entrega}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <Text style={styles.sectionTitle}>Requisitos</Text>
                <SimNaoSelector title="Precisa Lona?" value={form.precisa_lona} onSelect={(v) => handleInputChange('precisa_lona', v)} />
                <SimNaoSelector title="Produto Químico?" value={form.produto_quimico} onSelect={(v) => handleInputChange('produto_quimico', v)} />
                <TextInput style={styles.textArea} placeholder="Observações para o Motorista" multiline value={form.observacoes_motorista} onChangeText={(v) => handleInputChange('observacoes_motorista', v)} />


                <MultiCheckboxGroup title="Veículo de Tração" options={veiculoTracaoOptions} selectedOptions={form.veiculo_tracao} onSelect={(opt) => handleCheckboxChange('veiculo_tracao', opt)} />
                <MultiCheckboxGroup title="Tipos de Carreta" options={tiposCarretaOptions} selectedOptions={form.tipos_carreta} onSelect={(opt) => handleCheckboxChange('tipos_carreta', opt)} />
                <MultiCheckboxGroup title="Comprimento da Carreta" options={comprimentoCarretaOptions} selectedOptions={form.comprimento_carreta} onSelect={(opt) => handleCheckboxChange('comprimento_carreta', opt)} />
                <MultiCheckboxGroup title="Número de Eixos" options={numeroEixosOptions} selectedOptions={form.numero_eixos} onSelect={(opt) => handleCheckboxChange('numero_eixos', opt)} />
                <MultiCheckboxGroup title="Configuração do Modelo" options={configModeloOptions} selectedOptions={form.configuracao_modelo} onSelect={(opt) => handleCheckboxChange('configuracao_modelo', opt)} />

                <Text style={styles.sectionTitle}>Carga</Text>
                <TextInput style={styles.input} placeholder="Tipo de Carga (ex: Paletizada)" value={form.tipo_carga} onChangeText={(v) => handleInputChange('tipo_carga', v)} />
                <TextInput style={styles.textArea} placeholder="Observações sobre a Carga" multiline value={form.observacoes_carga} onChangeText={(v) => handleInputChange('observacoes_carga', v)} />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>{freteParaEditar ? 'Salvar Alterações' : 'Criar Frete'}</Text>}
                </TouchableOpacity>
            </ScrollView>
            {renderLocalidadeModal()}
            <Toast />
        </View>
    );
}