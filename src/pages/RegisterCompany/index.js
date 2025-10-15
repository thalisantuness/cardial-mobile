import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { register } from "../../services/api";
import Toast from "react-native-toast-message";
import { colors } from "../../colors";

export default function RegisterCompany() {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [modalEstadoVisivel, setModalEstadoVisivel] = useState(false);
  const [modalCidadeVisivel, setModalCidadeVisivel] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [celular, setCelular] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    numero: "",
    cidade: "",
    estado: "",
  });
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [telefoneResponsavel, setTelefoneResponsavel] = useState("");
  const [contaBancaria, setContaBancaria] = useState({
    banco: "",
    agencia: "",
    numero_conta: "",
    tipo_conta: "Selecione",
    titular: "",
    cpf_titular: "",
  });
  const [documentos, setDocumentos] = useState({
    alvara: null,
    comprovante_empresa: null,
    documento_empresa: null,
  });
  const [references, setReferences] = useState({
    personal: [{ name: "", phone: "" }, { name: "", phone: "" }],
    commercial: [{ name: "", phone: "" }, { name: "", phone: "" }],
    driver: [{ name: "", phone: "" }, { name: "", phone: "" }],
  });
  const [modalVisivel, setModalVisivel] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchEstados = async () => {
      setLoadingEstados(true);
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
        const data = await response.json();
        setEstados(data);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
        Toast.show({ type: 'error', text1: 'Erro de Rede', text2: 'Não foi possível carregar os estados.' });
      } finally {
        setLoadingEstados(false);
      }
    };
    fetchEstados();
  }, []);

  useEffect(() => {
    if (endereco.estado) {
      const fetchCidades = async () => {
        setLoadingCidades(true);
        setCidades([]);
        try {
          const response = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${endereco.estado}/municipios`);
          const data = await response.json();
          setCidades(data);
        } catch (error) {
          console.error("Erro ao buscar cidades:", error);
          Toast.show({ type: 'error', text1: 'Erro de Rede', text2: 'Não foi possível carregar as cidades.' });
        } finally {
          setLoadingCidades(false);
        }
      };
      fetchCidades();
    }
  }, [endereco.estado]);

  const refs = {
    nome: useRef(null),
    email: useRef(null),
    senha: useRef(null),
    celular: useRef(null),
    cnpj: useRef(null),
    cep: useRef(null),
    logradouro: useRef(null),
    bairro: useRef(null),
    numero: useRef(null),
    cidade: useRef(null),
    estado: useRef(null),
    nomeResponsavel: useRef(null),
    telefoneResponsavel: useRef(null),
    banco: useRef(null),
    agencia: useRef(null),
    numero_conta: useRef(null),
    tipo_conta: useRef(null),
    titular: useRef(null),
    cpf_titular: useRef(null),
    alvara: useRef(null),
    comprovante_empresa: useRef(null),
    documento_empresa: useRef(null),
    refPersonal_0_name: useRef(null),
    refPersonal_0_phone: useRef(null),
    refPersonal_1_name: useRef(null),
    refPersonal_1_phone: useRef(null),
    refCommercial_0_name: useRef(null),
    refCommercial_0_phone: useRef(null),
    refCommercial_1_name: useRef(null),
    refCommercial_1_phone: useRef(null),
    refDriver_0_name: useRef(null),
    refDriver_0_phone: useRef(null),
    refDriver_1_name: useRef(null),
    refDriver_1_phone: useRef(null),
  };

  // Funções de validação
  const isValidName = (value) => value.trim().length > 0;
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidSenha = (value) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
  const isValidCelular = (value) => /^\d{10,11}$/.test(value.replace(/[^0-9]/g, ""));
  const isValidCnpj = (value) => /^\d{14}$/.test(value.replace(/[^0-9]/g, ""));
  const isValidCpf = (value) => /^\d{11}$/.test(value.replace(/[^0-9]/g, ""));
  const isValidTipoConta = (value) => ["Corrente", "Poupança"].includes(value);

  // Manipuladores de eventos
  const onChangeNomeHandler = (value) => {
    setNome(value);
    setErrors((prev) => ({
      ...prev,
      nome: isValidName(value) ? "" : "Nome da empresa é obrigatório",
    }));
  };
  const onChangeEmailHandler = (value) => {
    setEmail(value);
    setErrors((prev) => ({
      ...prev,
      email: isValidEmail(value) ? "" : "Email inválido",
    }));
  };
  const onChangeSenhaHandler = (value) => {
    setSenha(value);
    setErrors((prev) => ({
      ...prev,
      senha: isValidSenha(value)
        ? ""
        : "Senha deve ter 8+ caracteres, com letras, números e especiais",
    }));
  };
  const onChangeCelularHandler = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setCelular(cleanValue);
    setErrors((prev) => ({
      ...prev,
      celular: isValidCelular(cleanValue) ? "" : "Celular deve ter 10 ou 11 dígitos",
    }));
  };
  const onChangeCnpjHandler = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setCnpj(cleanValue);
    setErrors((prev) => ({
      ...prev,
      cnpj: isValidCnpj(cleanValue) ? "" : "CNPJ deve ter 14 dígitos",
    }));
  };
  const onChangeCepHandler = (value) => {
    setEndereco((prev) => ({ ...prev, cep: value }));
    setErrors((prev) => ({
      ...prev,
      cep: value.trim().length > 0 ? "" : "CEP é obrigatório",
    }));
  };
  const onChangeLogradouroHandler = (value) => {
    setEndereco((prev) => ({ ...prev, logradouro: value }));
    setErrors((prev) => ({
      ...prev,
      logradouro: value.trim().length > 0 ? "" : "Logradouro é obrigatório",
    }));
  };
  const onChangeBairroHandler = (value) => {
    setEndereco((prev) => ({ ...prev, bairro: value }));
    setErrors((prev) => ({
      ...prev,
      bairro: value.trim().length > 0 ? "" : "Bairro é obrigatório",
    }));
  };
  const onChangeNumeroHandler = (value) => {
    setEndereco((prev) => ({ ...prev, numero: value }));
    setErrors((prev) => ({
      ...prev,
      numero: value.trim().length > 0 ? "" : "Número é obrigatório",
    }));
  };
  const handleEstadoSelect = (estado) => {
    setEndereco(prev => ({ ...prev, estado: estado.sigla, cidade: '' }));
    setErrors(prev => ({ ...prev, estado: '', cidade: 'Selecione uma cidade' }));
    setModalEstadoVisivel(false);
  };
  const handleCidadeSelect = (cidade) => {
    setEndereco(prev => ({ ...prev, cidade: cidade.nome }));
    setErrors(prev => ({ ...prev, cidade: '' }));
    setModalCidadeVisivel(false);
  };
  const onChangeNomeResponsavelHandler = (value) => {
    setNomeResponsavel(value);
    setErrors((prev) => ({
      ...prev,
      nomeResponsavel: isValidName(value) ? "" : "Nome do responsável é obrigatório",
    }));
  };
  const onChangeTelefoneResponsavelHandler = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setTelefoneResponsavel(cleanValue);
    setErrors((prev) => ({
      ...prev,
      telefoneResponsavel: isValidCelular(cleanValue)
        ? ""
        : "Telefone do responsável deve ter 10 ou 11 dígitos",
    }));
  };
  const onChangeContaBancariaHandler = (field, value) => {
    setContaBancaria((prev) => ({ ...prev, [field]: value }));
  };
  const onChangeReferenceHandler = (type, index, field, value) => {
    const cleanValue = field === "phone" ? value.replace(/[^0-9]/g, "") : value;
    setReferences((prev) => {
      const updated = { ...prev };
      updated[type][index][field] = cleanValue;
      return updated;
    });
    setErrors((prev) => ({
      ...prev,
      [`ref${type}_${index}_${field}`]:
        field === "name" && (cleanValue || references[type][index].phone)
          ? isValidName(cleanValue)
            ? ""
            : `Nome da referência ${type === "personal" ? "pessoal" : type === "commercial" ? "comercial" : "motorista"} ${index + 1} é obrigatório`
          : field === "phone" && (cleanValue || references[type][index].name)
          ? isValidCelular(cleanValue)
            ? ""
            : `Telefone da referência ${type === "personal" ? "pessoal" : type === "commercial" ? "comercial" : "motorista"} ${index + 1} deve ter 10 ou 11 dígitos`
          : "",
    }));
  };

  // Seleção de imagens da galeria
  const handleSelecaoArquivo = async (docType) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permissão negada",
          text2: "É necessário permitir o acesso à galeria para selecionar documentos.",
        });
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        if (asset.mimeType === "image/jpeg" || asset.mimeType === "image/png") {
          const base64String = `data:${asset.mimeType};base64,${asset.base64}`;
          setDocumentos((prev) => ({
            ...prev,
            [docType]: { name: asset.fileName || `documento_${docType}.jpg`, type: asset.mimeType, base64: base64String },
          }));
          setErrors((prev) => ({ ...prev, [docType]: "" }));
          Toast.show({
            type: "success",
            text1: "Arquivo selecionado",
            text2: `${
              docType === "alvara"
                ? "Alvará de funcionamento"
                : docType === "comprovante_empresa"
                ? "Comprovante de endereço"
                : "Razão social"
            } carregado com sucesso.`,
          });
        } else {
          Toast.show({
            type: "error",
            text1: "Formato inválido",
            text2: "Por favor, selecione uma imagem JPEG ou PNG.",
          });
        }
      }
    } catch (err) {
      console.error("Erro ao selecionar arquivo:", err);
      Toast.show({
        type: "error",
        text1: "Erro",
        text2: "Falha ao selecionar o arquivo.",
      });
    }
  };

  // Validação do formulário
  const validateForm = () => {
    const newErrors = {};
    let firstErrorField = null;

    // Validação dos campos na ordem de cima para baixo
    if (!isValidName(nome)) {
      newErrors.nome = "Nome da empresa é obrigatório";
      firstErrorField = firstErrorField || "nome";
    }
    if (!isValidEmail(email)) {
      newErrors.email = "Email inválido";
      firstErrorField = firstErrorField || "email";
    }
    if (!isValidSenha(senha)) {
      newErrors.senha = "Senha deve ter 8+ caracteres, com letras, números e especiais";
      firstErrorField = firstErrorField || "senha";
    }
    if (!isValidCelular(celular)) {
      newErrors.celular = "Celular deve ter 10 ou 11 dígitos";
      firstErrorField = firstErrorField || "celular";
    }
    if (!isValidCnpj(cnpj)) {
      newErrors.cnpj = "CNPJ deve ter 14 dígitos";
      firstErrorField = firstErrorField || "cnpj";
    }
    if (!endereco.cep) {
      newErrors.cep = "CEP é obrigatório";
      firstErrorField = firstErrorField || "cep";
    }
    if (!endereco.logradouro) {
      newErrors.logradouro = "Logradouro é obrigatório";
      firstErrorField = firstErrorField || "logradouro";
    }
    if (!endereco.bairro) {
      newErrors.bairro = "Bairro é obrigatório";
      firstErrorField = firstErrorField || "bairro";
    }
    if (!endereco.numero) {
      newErrors.numero = "Número é obrigatório";
      firstErrorField = firstErrorField || "numero";
    }
    if (!endereco.cidade) {
      newErrors.cidade = "Selecione uma cidade";
      firstErrorField = firstErrorField || "cidade";
    }
    if (!endereco.estado) {
        newErrors.estado = "Selecione um estado";
      firstErrorField = firstErrorField || "estado";
    }
    if (!isValidName(nomeResponsavel)) {
      newErrors.nomeResponsavel = "Nome do responsável é obrigatório";
      firstErrorField = firstErrorField || "nomeResponsavel";
    }
    if (!isValidCelular(telefoneResponsavel)) {
      newErrors.telefoneResponsavel = "Telefone do responsável deve ter 10 ou 11 dígitos";
      firstErrorField = firstErrorField || "telefoneResponsavel";
    }
    
    // --- VALIDAÇÃO CONDICIONAL DOS DADOS BANCÁRIOS ---
    const isBankingInfoProvided =
      contaBancaria.banco ||
      contaBancaria.agencia ||
      contaBancaria.numero_conta ||
      contaBancaria.titular ||
      contaBancaria.cpf_titular ||
      contaBancaria.tipo_conta !== "Selecione";

    if (isBankingInfoProvided) {
      if (!contaBancaria.banco) {
        newErrors.banco = "Banco é obrigatório";
        firstErrorField = firstErrorField || "banco";
      }
      if (!contaBancaria.agencia) {
        newErrors.agencia = "Agência é obrigatória";
        firstErrorField = firstErrorField || "agencia";
      }
      if (!contaBancaria.numero_conta) {
        newErrors.numero_conta = "Número da conta é obrigatório";
        firstErrorField = firstErrorField || "numero_conta";
      }
      if (contaBancaria.tipo_conta === "Selecione") {
        newErrors.tipo_conta = "Selecione 'Corrente' ou 'Poupança'";
        firstErrorField = firstErrorField || "tipo_conta";
      }
      if (!contaBancaria.titular) {
        newErrors.titular = "Titular é obrigatório";
        firstErrorField = firstErrorField || "titular";
      }
      if (!isValidCpf(contaBancaria.cpf_titular)) {
        newErrors.cpf_titular = "CPF do titular deve ter 11 dígitos";
        firstErrorField = firstErrorField || "cpf_titular";
      }
    }
    // --- FIM DA VALIDAÇÃO CONDICIONAL ---

    // Validação dos documentos obrigatórios
    const documentosObrigatorios = ["alvara", "comprovante_empresa", "documento_empresa"];
    documentosObrigatorios.forEach((doc) => {
      if (!documentos[doc]) {
        newErrors[doc] = `Documento ${doc.replace(/_/g, " ")} é obrigatório`;
        firstErrorField = firstErrorField || doc;
      }
    });

    // Validação das referências (opcional, mas se preenchido, deve ser válido)
    references.personal.forEach((ref, index) => {
      if (ref.name || ref.phone) {
        if (!isValidName(ref.name)) {
          newErrors[`refPersonal_${index}_name`] = `Nome da referência pessoal ${index + 1} é obrigatório`;
          firstErrorField = firstErrorField || `refPersonal_${index}_name`;
        }
        if (!isValidCelular(ref.phone)) {
          newErrors[`refPersonal_${index}_phone`] = `Telefone da referência pessoal ${index + 1} deve ter 10 ou 11 dígitos`;
          firstErrorField = firstErrorField || `refPersonal_${index}_phone`;
        }
      }
    });

    references.commercial.forEach((ref, index) => {
      if (ref.name || ref.phone) {
        if (!isValidName(ref.name)) {
          newErrors[`refCommercial_${index}_name`] = `Nome da referência comercial ${index + 1} é obrigatório`;
          firstErrorField = firstErrorField || `refCommercial_${index}_name`;
        }
        if (!isValidCelular(ref.phone)) {
          newErrors[`refCommercial_${index}_phone`] = `Telefone da referência comercial ${index + 1} deve ter 10 ou 11 dígitos`;
          firstErrorField = firstErrorField || `refCommercial_${index}_phone`;
        }
      }
    });

    references.driver.forEach((ref, index) => {
      if (ref.name || ref.phone) {
        if (!isValidName(ref.name)) {
          newErrors[`refDriver_${index}_name`] = `Nome da referência de motorista ${index + 1} é obrigatório`;
          firstErrorField = firstErrorField || `refDriver_${index}_name`;
        }
        if (!isValidCelular(ref.phone)) {
          newErrors[`refDriver_${index}_phone`] = `Telefone da referência de motorista ${index + 1} deve ter 10 ou 11 dígitos`;
          firstErrorField = firstErrorField || `refDriver_${index}_phone`;
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      if (refs[firstErrorField]?.current) {
        refs[firstErrorField].current.measure((x, y, width, height, pageX, pageY) => {
          scrollViewRef.current.scrollTo({ y: pageY - 100, animated: true });
        });
      }
      Toast.show({
        type: "error",
        text1: "Atenção",
        text2: newErrors[firstErrorField],
      });
      return false;
    }
    return true;
  };

  const handleRegisterPress = async () => {
    if (!validateForm()) return;

    const enderecoCompleto = `${endereco.logradouro}, ${endereco.numero}, ${endereco.bairro}, ${endereco.cidade}/${endereco.estado}, CEP: ${endereco.cep}`;
    const payload = {
      role: "empresa",
      nome_completo: nome,
      email,
      senha,
      celular: celular.replace(/[^0-9]/g, ""),
      cnpj: cnpj.replace(/[^0-9]/g, ""),
      endereco: enderecoCompleto,
      nome_responsavel_administrativo: nomeResponsavel,
      telefone_responsavel_administrativo: telefoneResponsavel.replace(/[^0-9]/g, ""),
      banco: contaBancaria.banco,
      agencia: contaBancaria.agencia,
      numero_conta: contaBancaria.numero_conta,
      tipo_conta: contaBancaria.tipo_conta,
      titular_conta: contaBancaria.titular,
      cpf_titular_conta: contaBancaria.cpf_titular || null,
      alvara: documentos.alvara?.base64 || null,
      comprovante_empresa: documentos.comprovante_empresa?.base64 || null,
      documento_empresa: documentos.documento_empresa?.base64 || null,
      nome_referencia_pessoal_1: references.personal[0].name || null,
      numero_referencia_pessoal_1: references.personal[0].phone || null,
      nome_referencia_pessoal_2: references.personal[1].name || null,
      numero_referencia_pessoal_2: references.personal[1].phone || null,
      nome_referencia_pessoal_3: null,
      numero_referencia_pessoal_3: null,
      nome_referencia_comercial_1: references.commercial[0].name || null,
      numero_referencia_comercial_1: references.commercial[0].phone || null,
      nome_referencia_comercial_2: references.commercial[1].name || null,
      numero_referencia_comercial_2: references.commercial[1].phone || null,
      nome_referencia_comercial_3: null,
      numero_referencia_comercial_3: null,
      nome_referencia_motorista_1: references.driver[0].name || null,
      numero_referencia_motorista_1: references.driver[0].phone || null,
      nome_referencia_motorista_2: references.driver[1].name || null,
      numero_referencia_motorista_2: references.driver[1].phone || null,
      nome_referencia_motorista_3: null,
      numero_referencia_motorista_3: null,
      nome_referencia_transportadora_1: null,
      numero_referencia_transportadora_1: null,
      nome_referencia_transportadora_2: null,
      numero_referencia_transportadora_2: null,
      nome_referencia_transportadora_3: null,
      numero_referencia_transportadora_3: null,
      nome_referencia_transportadora_4: null,
      numero_referencia_transportadora_4: null,
      nome_referencia_transportadora_5: null,
      numero_referencia_transportadora_5: null,
      cpf: null,
      data_nascimento: null,
      antt: null,
      cnh: null,
      comprovante_residencia_motorista: null,
      documento_dono_caminhao: null,
      comprovante_residencia_dono_caminhao: null,
      numero_placas: null,
      placa_1: null,
      placa_2: null,
      placa_3: null,
      imagem_perfil: null,
    };

    Toast.show({
      type: "info",
      text1: "Carregando",
      text2: "Aguarde enquanto fazemos seu cadastro...",
    });

    try {
      await register(payload);
      Toast.show({
        type: "success",
        text1: "Cadastro realizado com sucesso!",
        text2: "Seja bem-vindo!",
      });
      navigation.navigate("Login");
    } catch (err) {
      console.error("Erro no cadastro:", err);
      Toast.show({
        type: "error",
        text1: "Cadastro falhou",
        text2: err.response?.data?.error || "Entre em contato com o suporte.",
      });
    }
  };

  const renderDocumentInput = (label, docType) => (
    <View key={docType} style={{ width: "90%", marginBottom: 15 }}>
      <View style={styles.iconContainer}>
        <Feather name="camera" size={25} color="orange" />
        <Text style={styles.sectionTextSub}>{label}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity
          style={[styles.threeButtons, errors[docType] && styles.inputError]}
          onPress={() => handleSelecaoArquivo(docType)}
          ref={refs[docType]}
        >
          <Feather name="camera" size={25} color="white" />
          <Text style={styles.buttonText}>
            {documentos[docType] ? documentos[docType].name : `Selecionar`}
          </Text>
        </TouchableOpacity>
        {documentos[docType] && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setDocumentos((prev) => ({ ...prev, [docType]: null }))}
          >
            <Text style={styles.buttonText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>
      {errors[docType] && <Text style={styles.errorText}>{errors[docType]}</Text>}
    </View>
  );

  const tipoContaOptions = ["Selecione", "Corrente", "Poupança"];

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        style={styles.scrollViewStyle}
        ref={scrollViewRef}
      >
        <Text style={styles.welcomeText}>Olá! Registre-se como empresa</Text>

        <Text style={styles.sectionText}>Dados da Empresa</Text>
        <TextInput
          style={[styles.input, errors.nome && styles.inputError]}
          placeholder="Nome da Empresa"
          value={nome}
          onChangeText={onChangeNomeHandler}
          ref={refs.nome}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          value={email}
          onChangeText={onChangeEmailHandler}
          keyboardType="email-address"
          ref={refs.email}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        <TextInput
          style={[styles.input, errors.senha && styles.inputError]}
          placeholder="Senha (mín. 8 caracteres, com letras, números e especiais)"
          value={senha}
          onChangeText={onChangeSenhaHandler}
          secureTextEntry
          ref={refs.senha}
        />
        {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
        <TextInput
          style={[styles.input, errors.celular && styles.inputError]}
          placeholder="Celular (10 ou 11 dígitos)"
          value={celular}
          onChangeText={onChangeCelularHandler}
          keyboardType="phone-pad"
          ref={refs.celular}
        />
        {errors.celular && <Text style={styles.errorText}>{errors.celular}</Text>}
        <TextInput
          style={[styles.input, errors.cnpj && styles.inputError]}
          placeholder="CNPJ (14 dígitos)"
          value={cnpj}
          onChangeText={onChangeCnpjHandler}
          keyboardType="numeric"
          ref={refs.cnpj}
        />
        {errors.cnpj && <Text style={styles.errorText}>{errors.cnpj}</Text>}

        <Text style={styles.sectionText}>Endereço</Text>
        <TextInput
          style={[styles.input, errors.cep && styles.inputError]}
          placeholder="CEP"
          value={endereco.cep}
          onChangeText={onChangeCepHandler}
          keyboardType="numeric"
          ref={refs.cep}
        />
        {errors.cep && <Text style={styles.errorText}>{errors.cep}</Text>}
        <TextInput
          style={[styles.input, errors.logradouro && styles.inputError]}
          placeholder="Logradouro"
          value={endereco.logradouro}
          onChangeText={onChangeLogradouroHandler}
          ref={refs.logradouro}
        />
        {errors.logradouro && <Text style={styles.errorText}>{errors.logradouro}</Text>}
        <TextInput
          style={[styles.input, errors.bairro && styles.inputError]}
          placeholder="Bairro"
          value={endereco.bairro}
          onChangeText={onChangeBairroHandler}
          ref={refs.bairro}
        />
        {errors.bairro && <Text style={styles.errorText}>{errors.bairro}</Text>}
        <TextInput
          style={[styles.input, errors.numero && styles.inputError]}
          placeholder="Número"
          value={endereco.numero}
          onChangeText={onChangeNumeroHandler}
          ref={refs.numero}
        />
        {errors.numero && <Text style={styles.errorText}>{errors.numero}</Text>}

        <View style={{ width: "90%", marginBottom: 15 }}>
          <TouchableOpacity
            style={[styles.pickerContainer, errors.estado && styles.inputError]}
            onPress={() => setModalEstadoVisivel(true)}
            ref={refs.estado}
          >
            <Text style={styles.pickerText}>{endereco.estado ? estados.find(e => e.sigla === endereco.estado)?.nome : 'Selecione o Estado'}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          {errors.estado && <Text style={styles.errorText}>{errors.estado}</Text>}
        </View>

        <View style={{ width: "90%", marginBottom: 15 }}>
          <TouchableOpacity
            style={[styles.pickerContainer, errors.cidade && styles.inputError, !endereco.estado && styles.pickerDisabled]}
            onPress={() => setModalCidadeVisivel(true)}
            disabled={!endereco.estado || loadingCidades}
            ref={refs.cidade}
          >
            <Text style={styles.pickerText}>{endereco.cidade || 'Selecione a Cidade'}</Text>
            {loadingCidades ? <ActivityIndicator size="small" color={colors.laranjaPrincipal} /> : <Text style={styles.pickerArrow}>▼</Text>}
          </TouchableOpacity>
          {errors.cidade && <Text style={styles.errorText}>{errors.cidade}</Text>}
        </View>
        
        <Text style={styles.sectionText}>Responsável Administrativo</Text>
        <TextInput
          style={[styles.input, errors.nomeResponsavel && styles.inputError]}
          placeholder="Nome do Responsável"
          value={nomeResponsavel}
          onChangeText={onChangeNomeResponsavelHandler}
          ref={refs.nomeResponsavel}
        />
        {errors.nomeResponsavel && <Text style={styles.errorText}>{errors.nomeResponsavel}</Text>}
        <TextInput
          style={[styles.input, errors.telefoneResponsavel && styles.inputError]}
          placeholder="Telefone do Responsável (10 ou 11 dígitos)"
          value={telefoneResponsavel}
          onChangeText={onChangeTelefoneResponsavelHandler}
          keyboardType="phone-pad"
          ref={refs.telefoneResponsavel}
        />
        {errors.telefoneResponsavel && <Text style={styles.errorText}>{errors.telefoneResponsavel}</Text>}

        {/* <Text style={styles.sectionText}>Dados Bancários (Opcional)</Text>
        <TextInput
          style={[styles.input, errors.banco && styles.inputError]}
          placeholder="Banco"
          value={contaBancaria.banco}
          onChangeText={(text) => onChangeContaBancariaHandler("banco", text)}
          ref={refs.banco}
        />
        {errors.banco && <Text style={styles.errorText}>{errors.banco}</Text>}
        <TextInput
          style={[styles.input, errors.agencia && styles.inputError]}
          placeholder="Agência"
          value={contaBancaria.agencia}
          onChangeText={(text) => onChangeContaBancariaHandler("agencia", text)}
          keyboardType="numeric"
          ref={refs.agencia}
        />
        {errors.agencia && <Text style={styles.errorText}>{errors.agencia}</Text>}
        <TextInput
          style={[styles.input, errors.numero_conta && styles.inputError]}
          placeholder="Número da conta"
          value={contaBancaria.numero_conta}
          onChangeText={(text) => onChangeContaBancariaHandler("numero_conta", text)}
          keyboardType="numeric"
          ref={refs.numero_conta}
        />
        {errors.numero_conta && <Text style={styles.errorText}>{errors.numero_conta}</Text>}
        <View style={{ width: "90%", marginBottom: 15 }}>
          <View style={styles.iconContainer}>
            <Feather name="credit-card" size={25} color="orange" />
            <Text style={styles.sectionTextSub}>Tipo de Conta</Text>
          </View>
          <TouchableOpacity
            style={[styles.pickerContainer, errors.tipo_conta && styles.inputError]}
            onPress={() => setModalVisivel(true)}
            ref={refs.tipo_conta}
          >
            <Text style={styles.pickerText}>{contaBancaria.tipo_conta}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          {errors.tipo_conta && <Text style={styles.errorText}>{errors.tipo_conta}</Text>}
        </View>
        <Modal
          transparent={true}
          visible={modalVisivel}
          onRequestClose={() => setModalVisivel(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setModalVisivel(false)}
          >
            <View style={styles.modalContent}>
              {tipoContaOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    onChangeContaBancariaHandler("tipo_conta", option);
                    setModalVisivel(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
        <TextInput
          style={[styles.input, errors.titular && styles.inputError]}
          placeholder="Titular da conta"
          value={contaBancaria.titular}
          onChangeText={(text) => onChangeContaBancariaHandler("titular", text)}
          ref={refs.titular}
        />
        {errors.titular && <Text style={styles.errorText}>{errors.titular}</Text>}
        <TextInput
          style={[styles.input, errors.cpf_titular && styles.inputError]}
          placeholder="CPF do titular (11 dígitos)"
          value={contaBancaria.cpf_titular}
          onChangeText={(text) => onChangeContaBancariaHandler("cpf_titular", text)}
          keyboardType="numeric"
          ref={refs.cpf_titular}
        />
        {errors.cpf_titular && <Text style={styles.errorText}>{errors.cpf_titular}</Text>} */}

        <Text style={styles.sectionText}>Referências Pessoais</Text>
        <Text style={styles.descriptionText}>Forneça até duas referências pessoais (opcional):</Text>
        {references.personal.map((ref, index) => (
          <View key={`personal-${index}`}>
            <View style={styles.iconContainer}>
              <Feather name="user" size={25} color="orange" />
              <Text style={styles.sectionTextSub}>Referência Pessoal {index + 1}</Text>
            </View>
            <TextInput
              style={[styles.input, errors[`refPersonal_${index}_name`] && styles.inputError]}
              placeholder="Nome Completo"
              value={ref.name}
              onChangeText={(text) => onChangeReferenceHandler("personal", index, "name", text)}
              ref={refs[`refPersonal_${index}_name`]}
            />
            {errors[`refPersonal_${index}_name`] && (
              <Text style={styles.errorText}>{errors[`refPersonal_${index}_name`]}</Text>
            )}
            <TextInput
              style={[styles.input, errors[`refPersonal_${index}_phone`] && styles.inputError]}
              placeholder="Telefone/Celular (10 ou 11 dígitos)"
              value={ref.phone}
              onChangeText={(text) => onChangeReferenceHandler("personal", index, "phone", text)}
              keyboardType="phone-pad"
              ref={refs[`refPersonal_${index}_phone`]}
            />
            {errors[`refPersonal_${index}_phone`] && (
              <Text style={styles.errorText}>{errors[`refPersonal_${index}_phone`]}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionText}>Referências Comerciais/Fornecedores</Text>
        <Text style={styles.descriptionText}>Forneça até duas referências comerciais (opcional):</Text>
        {references.commercial.map((ref, index) => (
          <View key={`commercial-${index}`}>
            <View style={styles.iconContainer}>
              <Feather name="briefcase" size={25} color="orange" />
              <Text style={styles.sectionTextSub}>Referência Comercial {index + 1}</Text>
            </View>
            <TextInput
              style={[styles.input, errors[`refCommercial_${index}_name`] && styles.inputError]}
              placeholder="Nome da Empresa"
              value={ref.name}
              onChangeText={(text) => onChangeReferenceHandler("commercial", index, "name", text)}
              ref={refs[`refCommercial_${index}_name`]}
            />
            {errors[`refCommercial_${index}_name`] && (
              <Text style={styles.errorText}>{errors[`refCommercial_${index}_name`]}</Text>
            )}
            <TextInput
              style={[styles.input, errors[`refCommercial_${index}_phone`] && styles.inputError]}
              placeholder="Telefone/Celular (10 ou 11 dígitos)"
              value={ref.phone}
              onChangeText={(text) => onChangeReferenceHandler("commercial", index, "phone", text)}
              keyboardType="phone-pad"
              ref={refs[`refCommercial_${index}_phone`]}
            />
            {errors[`refCommercial_${index}_phone`] && (
              <Text style={styles.errorText}>{errors[`refCommercial_${index}_phone`]}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionText}>Referências de Motoristas</Text>
        <Text style={styles.descriptionText}>Forneça até duas referências de motoristas (opcional):</Text>
        {references.driver.map((ref, index) => (
          <View key={`driver-${index}`}>
            <View style={styles.iconContainer}>
              <Feather name="truck" size={25} color="orange" />
              <Text style={styles.sectionTextSub}>Referência Motorista {index + 1}</Text>
            </View>
            <TextInput
              style={[styles.input, errors[`refDriver_${index}_name`] && styles.inputError]}
              placeholder="Nome Completo"
              value={ref.name}
              onChangeText={(text) => onChangeReferenceHandler("driver", index, "name", text)}
              ref={refs[`refDriver_${index}_name`]}
            />
            {errors[`refDriver_${index}_name`] && (
              <Text style={styles.errorText}>{errors[`refDriver_${index}_name`]}</Text>
            )}
            <TextInput
              style={[styles.input, errors[`refDriver_${index}_phone`] && styles.inputError]}
              placeholder="Telefone/Celular (10 ou 11 dígitos)"
              value={ref.phone}
              onChangeText={(text) => onChangeReferenceHandler("driver", index, "phone", text)}
              keyboardType="phone-pad"
              ref={refs[`refDriver_${index}_phone`]}
            />
            {errors[`refDriver_${index}_phone`] && (
              <Text style={styles.errorText}>{errors[`refDriver_${index}_phone`]}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionText}>Documentos Fotográficos</Text>
        <Text style={styles.descriptionText}>Selecione os documentos (JPEG ou PNG, obrigatório):</Text>
        {[
          { label: "Alvará de funcionamento", key: "alvara" },
          { label: "Comprovante de endereço", key: "comprovante_empresa" },
          { label: "Razão social", key: "documento_empresa" },
        ].map(({ label, key }) => renderDocumentInput(label, key))}

        <TouchableOpacity
          onPress={handleRegisterPress}
          style={styles.registerButton}
        >
          <Text style={styles.buttonText}>REGISTRAR-SE</Text>
        </TouchableOpacity>
      </ScrollView>
      
      {/* --- MODAIS DE SELEÇÃO DE ESTADO E CIDADE --- */}
      <Modal transparent={true} visible={modalEstadoVisivel} onRequestClose={() => setModalEstadoVisivel(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalEstadoVisivel(false)}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            {loadingEstados ? <ActivityIndicator size="large" color={colors.laranjaPrincipal} /> : (
              <FlatList
                data={estados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalOption} onPress={() => handleEstadoSelect(item)}>
                    <Text style={styles.modalOptionText}>{item.nome} ({item.sigla})</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent={true} visible={modalCidadeVisivel} onRequestClose={() => setModalCidadeVisivel(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalCidadeVisivel(false)}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            {loadingCidades ? <ActivityIndicator size="large" color={colors.laranjaPrincipal} /> : (
              <FlatList
                data={cidades}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.modalOption} onPress={() => handleCidadeSelect(item)}>
                    <Text style={styles.modalOptionText}>{item.nome}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      <Toast />
    </>
  );
}
