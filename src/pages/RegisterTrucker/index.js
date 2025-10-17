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
import { Feather, Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { register } from "../../services/api";
import Toast from "react-native-toast-message";
import { colors } from "../../colors";

export default function RegisterTrucker() {
  const navigation = useNavigation();
  const scrollViewRef = useRef(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(true); 
  const [nCpf, setNCpf] = useState("");
  const [dtNascimento, setDtNascimento] = useState("");
  const [displayDtNascimento, setDisplayDtNascimento] = useState(""); 
  const [celular, setCelular] = useState("");
  const [tipoVeiculo, setTipoVeiculo] = useState("Selecione");
  const [modalVisivel, setModalVisivel] = useState(false);
  const [modalTipoContaVisivel, setModalTipoContaVisivel] = useState(false);
  const [endereco, setEndereco] = useState({
    cep: "",
    logradouro: "",
    bairro: "",
    numero: "",
    cidade: "",
    estado: "",
  });
  const [placas, setPlacas] = useState({
    placa_1: null,
    placa_2: null,
    placa_3: null,
  });
  const [documentos, setDocumentos] = useState({
    imagem_perfil: null,
    antt: null,
    cnh: null,
    comprovante_residencia_motorista: null,
    documento_dono_caminhao: null,
    comprovante_residencia_dono_caminhao: null,
  });
  const [refPessoais, setRefPessoais] = useState([
    { name: "", phone: "" },
    { name: "", phone: "" },
    { name: "", phone: "" },
  ]);
  const [refComerciais, setRefComerciais] = useState([
    { name: "", phone: "" },
    { name: "", phone: "" },
  ]);
  const [refTransportadoras, setRefTransportadoras] = useState([
    { name: "", phone: "" },
    { name: "", phone: "" },
    { name: "", phone: "" },
  ]);
  const [contaBancaria, setContaBancaria] = useState({
    banco: "",
    agencia: "",
    numero_conta: "",
    tipo_conta: "Selecione",
    titular: "",
    cpf_titular: "",
  });
  const [errors, setErrors] = useState({});

  const [estados, setEstados] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const [modalEstadoVisivel, setModalEstadoVisivel] = useState(false);
  const [modalCidadeVisivel, setModalCidadeVisivel] = useState(false);

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
    nCpf: useRef(null),
    dtNascimento: useRef(null),
    celular: useRef(null),
    cep: useRef(null),
    logradouro: useRef(null),
    bairro: useRef(null),
    numero: useRef(null),
    cidade: useRef(null),
    estado: useRef(null),
    tipoVeiculo: useRef(null),
    imagem_perfil: useRef(null),
    antt: useRef(null),
    cnh: useRef(null),
    comprovante_residencia_motorista: useRef(null),
    documento_dono_caminhao: useRef(null),
    comprovante_residencia_dono_caminhao: useRef(null),
    refPessoal_0_name: useRef(null),
    refPessoal_0_phone: useRef(null),
    refPessoal_1_name: useRef(null),
    refPessoal_1_phone: useRef(null),
    refPessoal_2_name: useRef(null),
    refPessoal_2_phone: useRef(null),
    refComercial_0_name: useRef(null),
    refComercial_0_phone: useRef(null),
    refComercial_1_name: useRef(null),
    refComercial_1_phone: useRef(null),
    refTransportadora_0_name: useRef(null),
    refTransportadora_0_phone: useRef(null),
    refTransportadora_1_name: useRef(null),
    refTransportadora_1_phone: useRef(null),
    refTransportadora_2_name: useRef(null),
    refTransportadora_2_phone: useRef(null),
    banco: useRef(null),
    agencia: useRef(null),
    numero_conta: useRef(null),
    tipo_conta: useRef(null),
    titular: useRef(null),
    cpf_titular: useRef(null),
  };

  // Funções de validação
  const isValidName = (value) => value.trim().length > 0;
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isValidSenha = (value) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
  const isValidCpf = (value) => /^\d{11}$/.test(value.replace(/[^0-9]/g, ""));
  const isValidCelular = (value) => /^\d{10,11}$/.test(value.replace(/[^0-9]/g, ""));
  const isValidDate = (value) => {
    // Valida se a data está no formato DD-MM-AAAA
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (!regex.test(value)) return false;
    const [day, month, year] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date instanceof Date &&
      !isNaN(date) &&
      date.getFullYear() === year &&
      date.getMonth() + 1 === month &&
      date.getDate() === day &&
      year >= 1900 &&
      year <= new Date().getFullYear()
    );
  };
  const isValidTelefoneFixo = (value) => /^\d{10,11}$/.test(value.replace(/[^0-9]/g, ""));
  const isValidTipoVeiculo = (value) => value !== "Selecione";
  const isValidTipoConta = (value) => ["Corrente", "Poupança"].includes(value);

  // Manipuladores de eventos
  const onChangeNomeHandler = (value) => {
    setNome(value);
    setErrors((prev) => ({
      ...prev,
      nome: isValidName(value) ? "" : "Nome completo é obrigatório",
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
  const onChangeCpfHandler = (value) => {
    const cleanValue = value.replace(/[^0-9]/g, "");
    setNCpf(cleanValue);
    setErrors((prev) => ({
      ...prev,
      nCpf: isValidCpf(cleanValue) ? "" : "CPF deve ter 11 dígitos",
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
  const onChangeDtNascimentoHandler = (value) => {
    // Remove qualquer caractere que não seja número
    let cleanValue = value.replace(/[^0-9]/g, "");

    // Aplica a máscara DD-MM-AAAA
    let displayValue = "";
    if (cleanValue.length >= 1) {
      displayValue = cleanValue.slice(0, 2); // DD
    }
    if (cleanValue.length >= 3) {
      displayValue = cleanValue.slice(0, 2) + "-" + cleanValue.slice(2, 4); // DD-MM
    }
    if (cleanValue.length >= 5) {
      displayValue = cleanValue.slice(0, 2) + "-" + cleanValue.slice(2, 4) + "-" + cleanValue.slice(4, 8); // DD-MM-AAAA
    }

    // Limita a entrada a 10 caracteres (DD-MM-AAAA)
    displayValue = displayValue.slice(0, 10);

    // Atualiza o estado de exibição
    setDisplayDtNascimento(displayValue);

    // Define dtNascimento apenas se a entrada for completa (10 caracteres, formato DD-MM-AAAA)
    let formattedValue = "";
    if (displayValue.length === 10 && /^\d{2}-\d{2}-\d{4}$/.test(displayValue)) {
      formattedValue = displayValue;
    }

    // Atualiza o estado dtNascimento
    setDtNascimento(formattedValue);

    // Validação da data
    setErrors((prev) => ({
      ...prev,
      dtNascimento: formattedValue && isValidDate(formattedValue)
        ? ""
        : "Data inválida (use DD-MM-AAAA, ex: 14-12-1998)",
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
      logradouro: value.trim().length > 0 ? "" : "Rua/Avenida/Travessa é obrigatório",
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
  const onChangeTipoVeiculoHandler = (value) => {
    setTipoVeiculo(value);
    setErrors((prev) => ({
      ...prev,
      tipoVeiculo: isValidTipoVeiculo(value) ? "" : "Selecione o número de placas",
    }));
  };
  const onChangeContaBancariaHandler = (field, value) => {
    setContaBancaria((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({
      ...prev,
      [field]:
        field === "tipo_conta"
          ? isValidTipoConta(value)
            ? ""
            : "Selecione 'Corrente' ou 'Poupança'"
          : value.trim().length > 0
          ? field === "cpf_titular"
            ? isValidCpf(value)
              ? ""
              : "CPF do titular deve ter 11 dígitos"
            : ""
          : field === "banco"
          ? "Banco é obrigatório"
          : field === "agencia"
          ? "Agência é obrigatória"
          : field === "numero_conta"
          ? "Número da conta é obrigatório"
          : field === "titular"
          ? "Titular é obrigatório"
          : field === "cpf_titular"
          ? "CPF do titular é obrigatório"
          : "",
    }));
  };
  const onChangeRefPessoalHandler = (index, field, value) => {
    const cleanValue = field === "phone" ? value.replace(/[^0-9]/g, "") : value;
    const updated = [...refPessoais];
    updated[index][field] = cleanValue;
    setRefPessoais(updated);
    setErrors((prev) => ({
      ...prev,
      [`refPessoal_${index}_${field}`]:
        field === "name" && (cleanValue || refPessoais[index].phone)
          ? isValidName(cleanValue)
            ? ""
            : `Nome da referência pessoal ${index + 1} é obrigatório`
          : field === "phone" && (cleanValue || refPessoais[index].name)
          ? isValidTelefoneFixo(cleanValue)
            ? ""
            : `Telefone da referência pessoal ${index + 1} deve ter 10 ou 11 dígitos`
          : "",
    }));
  };
  const onChangeRefComercialHandler = (index, field, value) => {
    const cleanValue = field === "phone" ? value.replace(/[^0-9]/g, "") : value;
    const updated = [...refComerciais];
    updated[index][field] = cleanValue;
    setRefComerciais(updated);
    setErrors((prev) => ({
      ...prev,
      [`refComercial_${index}_${field}`]:
        field === "name" && (cleanValue || refComerciais[index].phone)
          ? isValidName(cleanValue)
            ? ""
            : `Nome da referência comercial ${index + 1} é obrigatório`
          : field === "phone" && (cleanValue || refComerciais[index].name)
          ? isValidTelefoneFixo(cleanValue)
            ? ""
            : `Telefone da referência comercial ${index + 1} deve ter 10 ou 11 dígitos`
          : "",
    }));
  };
  const onChangeRefTransportadoraHandler = (index, field, value) => {
    const cleanValue = field === "phone" ? value.replace(/[^0-9]/g, "") : value;
    const updated = [...refTransportadoras];
    updated[index][field] = cleanValue;
    setRefTransportadoras(updated);
    setErrors((prev) => ({
      ...prev,
      [`refTransportadora_${index}_${field}`]:
        field === "name" && (cleanValue || refTransportadoras[index].phone)
          ? isValidName(cleanValue)
            ? ""
            : `Nome da referência transportadora ${index + 1} é obrigatório`
          : field === "phone" && (cleanValue || refTransportadoras[index].name)
          ? isValidTelefoneFixo(cleanValue)
            ? ""
            : `Telefone da referência transportadora ${index + 1} deve ter 10 ou 11 dígitos`
          : "",
    }));
  };

  // Função de seleção de arquivos usando expo-image-picker
  const handleSelecaoArquivo = async (tipoDocumento) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Permissão negada",
          text2: "É necessário permitir o acesso à galeria para selecionar imagens.",
        });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        const mimeType = asset.mimeType || `image/${asset.uri.split(".").pop()}`;
        if (mimeType === "image/jpeg" || mimeType === "image/png") {
          const base64String = `data:${mimeType};base64,${asset.base64}`;
          const fileName = asset.fileName || `image_${tipoDocumento}.${mimeType.split("/")[1]}`;

          if (tipoDocumento.startsWith("placa_")) {
            setPlacas((prev) => ({
              ...prev,
              [tipoDocumento]: {
                name: fileName,
                type: mimeType,
                base64: base64String,
              },
            }));
            setErrors((prev) => ({ ...prev, [tipoDocumento]: "" }));
          } else {
            setDocumentos((prev) => ({
              ...prev,
              [tipoDocumento]: {
                name: fileName,
                type: mimeType,
                base64: base64String,
              },
            }));
            setErrors((prev) => ({ ...prev, [tipoDocumento]: "" }));
          }
          
          const friendlyDocNames = {
            imagem_perfil: "Imagem de Perfil",
            antt: "ANTT",
            cnh: "CNH",
            comprovante_residencia_motorista: "Comprovante de Residência",
            documento_dono_caminhao: "CNH dono do caminhão",
            comprovante_residencia_dono_caminhao: "Comprovante de Residência do Dono do Caminhão",
            placa_1: "Documento veículo de tração",
            placa_2: "Documento reboque 1",
            placa_3: "Documento reboque 2",
          };

          Toast.show({
            type: "success",
            text1: "Arquivo selecionado",
            text2: `${friendlyDocNames[tipoDocumento] || 'Documento'} carregado com sucesso.`,
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

    if (!isValidName(nome)) newErrors.nome = "Nome completo é obrigatório";
    if (!isValidEmail(email)) newErrors.email = "Email inválido";
    if (!isValidSenha(senha))
      newErrors.senha =
        "Senha deve ter 8+ caracteres, com letras, números e especiais";
    if (!isValidCpf(nCpf)) newErrors.nCpf = "CPF deve ter 11 dígitos";
    if (!isValidCelular(celular))
      newErrors.celular = "Celular deve ter 10 ou 11 dígitos";
    if (!isValidDate(dtNascimento))
      newErrors.dtNascimento = "Data inválida (use DD-MM-AAAA, ex: 14-12-1998)";
    if (!endereco.cep) newErrors.cep = "CEP é obrigatório";
    if (!endereco.logradouro) newErrors.logradouro = "Rua/Avenida/Travessa é obrigatório";
    if (!endereco.bairro) newErrors.bairro = "Bairro é obrigatório";
    if (!endereco.numero) newErrors.numero = "Número é obrigatório";
    if (!endereco.cidade) newErrors.cidade = "Selecione uma cidade";
    if (!endereco.estado) newErrors.estado = "Selecione um estado";
    if (!isValidTipoVeiculo(tipoVeiculo))
      newErrors.tipoVeiculo = "Selecione o número de placas";

    const numPlaca = parseInt(tipoVeiculo) || 0;
    const placaLabels = {
        placa_1: "Documento veículo de tração",
        placa_2: "Documento reboque 1",
        placa_3: "Documento reboque 2"
    };
    for (let i = 1; i <= numPlaca; i++) {
      const placaKey = `placa_${i}`;
      if (!placas[placaKey]) newErrors[placaKey] = `${placaLabels[placaKey]} é obrigatório`;
    }

    const documentosObrigatorios = [
      "antt",
      "cnh",
      "comprovante_residencia_motorista",
      "documento_dono_caminhao",
      "comprovante_residencia_dono_caminhao",
    ];
    documentosObrigatorios.forEach((doc) => {
      if (!documentos[doc])
        newErrors[doc] = `Documento ${doc.replace(/_/g, " ")} é obrigatório`;
    });

    refPessoais.forEach((ref, index) => {
      if (ref.name || ref.phone) {
        if (!isValidName(ref.name))
          newErrors[`refPessoal_${index}_name`] = `Nome da referência pessoal ${index + 1} é obrigatório`;
        if (!isValidTelefoneFixo(ref.phone))
          newErrors[`refPessoal_${index}_phone`] = `Telefone da referência pessoal ${index + 1} deve ter 10 ou 11 dígitos`;
      }
    });

    refComerciais.forEach((ref, index) => {
      if (ref.name || ref.phone) {
        if (!isValidName(ref.name))
          newErrors[`refComercial_${index}_name`] = `Nome da referência comercial ${index + 1} é obrigatório`;
        if (!isValidTelefoneFixo(ref.phone))
          newErrors[`refComercial_${index}_phone`] = `Telefone da referência comercial ${index + 1} deve ter 10 ou 11 dígitos`;
      }
    });

    refTransportadoras.forEach((ref, index) => {
      if (ref.name || ref.phone) {
        if (!isValidName(ref.name))
          newErrors[`refTransportadora_${index}_name`] = `Nome da referência transportadora ${index + 1} é obrigatório`;
        if (!isValidTelefoneFixo(ref.phone))
          newErrors[`refTransportadora_${index}_phone`] = `Telefone da referência transportadora ${index + 1} deve ter 10 ou 11 dígitos`;
      }
    });

    if (!contaBancaria.banco) newErrors.banco = "Banco é obrigatório";
    if (!contaBancaria.agencia) newErrors.agencia = "Agência é obrigatória";
    if (!contaBancaria.numero_conta)
      newErrors.numero_conta = "Número da conta é obrigatório";
    if (!isValidTipoConta(contaBancaria.tipo_conta))
      newErrors.tipo_conta = "Selecione 'Corrente' ou 'Poupança'";
    if (!contaBancaria.titular) newErrors.titular = "Titular é obrigatório";
    if (!isValidCpf(contaBancaria.cpf_titular))
      newErrors.cpf_titular = "CPF do titular deve ter 11 dígitos";

    setErrors(newErrors);

    const errorKeys = Object.keys(newErrors);
    if (errorKeys.length > 0) {
      firstErrorField = errorKeys[0];
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
      role: "motorista",
      email,
      senha,
      nome_completo: nome,
      celular: celular.replace(/[^0-9]/g, ""),
      cpf: nCpf,
      data_nascimento: dtNascimento,
      endereco: enderecoCompleto,
      numero_placas: parseInt(tipoVeiculo) || 0,
      placa_1: placas.placa_1?.base64 || null,
      placa_2: placas.placa_2?.base64 || null,
      placa_3: placas.placa_3?.base64 || null,
      antt: documentos.antt?.base64 || null,
      cnh: documentos.cnh?.base64 || null,
      comprovante_residencia_motorista: documentos.comprovante_residencia_motorista?.base64 || null,
      documento_dono_caminhao: documentos.documento_dono_caminhao?.base64 || null,
      comprovante_residencia_dono_caminhao: documentos.comprovante_residencia_dono_caminhao?.base64 || null,
      nome_referencia_pessoal_1: refPessoais[0].name || null,
      numero_referencia_pessoal_1: refPessoais[0].phone || null,
      nome_referencia_pessoal_2: refPessoais[1].name || null,
      numero_referencia_pessoal_2: refPessoais[1].phone || null,
      nome_referencia_pessoal_3: refPessoais[2].name || null,
      numero_referencia_pessoal_3: refPessoais[2].phone || null,
      nome_referencia_comercial_1: refComerciais[0].name || null,
      numero_referencia_comercial_1: refComerciais[0].phone || null,
      nome_referencia_comercial_2: refComerciais[1].name || null,
      numero_referencia_comercial_2: refComerciais[1].phone || null,
      nome_referencia_comercial_3: null,
      numero_referencia_comercial_3: null,
      nome_referencia_transportadora_1: refTransportadoras[0].name || null,
      numero_referencia_transportadora_1: refTransportadoras[0].phone || null,
      nome_referencia_transportadora_2: refTransportadoras[1].name || null,
      numero_referencia_transportadora_2: refTransportadoras[1].phone || null,
      nome_referencia_transportadora_3: refTransportadoras[2].name || null,
      numero_referencia_transportadora_3: refTransportadoras[2].phone || null,
      nome_referencia_transportadora_4: null,
      numero_referencia_transportadora_4: null,
      nome_referencia_transportadora_5: null,
      numero_referencia_transportadora_5: null,
      banco: contaBancaria.banco,
      agencia: contaBancaria.agencia,
      numero_conta: contaBancaria.numero_conta,
      tipo_conta: contaBancaria.tipo_conta,
      titular_conta: contaBancaria.titular,
      cpf_titular_conta: contaBancaria.cpf_titular || null,
      cnpj: null,
      nome_responsavel_administrativo: null,
      telefone_responsavel_administrativo: null,
      alvara: null,
      comprovante_empresa: null,
      documento_empresa: null,
      nome_referencia_motorista_1: null,
      numero_referencia_motorista_1: null,
      nome_referencia_motorista_2: null,
      numero_referencia_motorista_2: null,
      nome_referencia_motorista_3: null,
      numero_referencia_motorista_3: null,
      imagem_perfil: documentos.imagem_perfil?.base64 || null,
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

  const renderDocumentInput = (label, tipoDocumento) => (
    <View key={tipoDocumento} style={{ width: "90%", marginBottom: 15 }}>
      <View style={styles.iconContainer}>
        <Feather name="camera" size={25} color="orange" />
        <Text style={styles.sectionTextSub}>{label}</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity
          style={[styles.threeButtons, errors[tipoDocumento] && styles.inputError]}
          onPress={() => handleSelecaoArquivo(tipoDocumento)}
          ref={refs[tipoDocumento]}
        >
          <Feather name="camera" size={25} color="white" />
          <Text style={styles.buttonText}>
            {documentos[tipoDocumento] || placas[tipoDocumento]
              ? (documentos[tipoDocumento]?.name || placas[tipoDocumento]?.name)
              : `Selecionar`}
          </Text>
        </TouchableOpacity>
        {(documentos[tipoDocumento] || placas[tipoDocumento]) && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() =>
              tipoDocumento.startsWith("placa_")
                ? setPlacas((prev) => ({ ...prev, [tipoDocumento]: null }))
                : setDocumentos((prev) => ({ ...prev, [tipoDocumento]: null }))
            }
          >
            <Text style={styles.buttonText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>
      {errors[tipoDocumento] && (
        <Text style={styles.errorText}>{errors[tipoDocumento]}</Text>
      )}
    </View>
  );

  const options = ["Selecione", "1", "2", "3"];
  const tipoContaOptions = ["Selecione", "Corrente", "Poupança"];

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.scrollViewContainer}
        style={styles.scrollViewStyle}
        ref={scrollViewRef}
      >
        <Text style={styles.welcomeText}>Olá! Registre-se como caminhoneiro</Text>

        <Text style={styles.sectionText}>Dados Pessoais</Text>
        <TextInput
          style={[styles.input, errors.nome && styles.inputError]}
          placeholder="Nome completo"
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
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginTop: 0 }]}
            placeholder="Senha (mín. 8 caracteres, com letras, números e especiais)"
            secureTextEntry={showPassword}
            value={senha}
            onChangeText={onChangeSenhaHandler}
            ref={refs.senha}
          />
          <TouchableOpacity
            style={styles.passwordIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color={colors.cinza} />
          </TouchableOpacity>
        </View>
        {errors.senha && <Text style={styles.errorText}>{errors.senha}</Text>}
        <TextInput
          style={[styles.input, errors.nCpf && styles.inputError]}
          placeholder="CPF (11 dígitos)"
          value={nCpf}
          onChangeText={onChangeCpfHandler}
          keyboardType="numeric"
          ref={refs.nCpf}
        />
        {errors.nCpf && <Text style={styles.errorText}>{errors.nCpf}</Text>}
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
          style={[styles.input, errors.dtNascimento && styles.inputError]}
          placeholder="Data de nascimento (DD-MM-AAAA)"
          value={displayDtNascimento}
          onChangeText={onChangeDtNascimentoHandler}
          keyboardType="numeric"
          maxLength={10}
          ref={refs.dtNascimento}
        />
        {errors.dtNascimento && <Text style={styles.errorText}>{errors.dtNascimento}</Text>}

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
          placeholder="Rua/Avenida/Travessa"
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
            {loadingCidades ? <ActivityIndicator size="small" color={colors.azulPrincipal} /> : <Text style={styles.pickerArrow}>▼</Text>}
          </TouchableOpacity>
          {errors.cidade && <Text style={styles.errorText}>{errors.cidade}</Text>}
        </View>

        <Text style={styles.sectionText}>Documentos e Placas</Text>
        <Text style={styles.descriptionText}>
          Selecione os documentos (JPEG ou PNG, obrigatório):
        </Text>
        {[
          { label: "Imagem de Perfil", key: "imagem_perfil" },
          { label: "ANTT", key: "antt" },
          { label: "CNH", key: "cnh" },
          { label: "Comprovante de Residência", key: "comprovante_residencia_motorista" },
          { label: "CNH dono do caminhão", key: "documento_dono_caminhao" },
          {
            label: "Comprovante Residência Dono Caminhão",
            key: "comprovante_residencia_dono_caminhao",
          },
        ].map(({ label, key }) => renderDocumentInput(label, key))}
        <View style={{ width: "90%", marginBottom: 15 }}>
          <View style={styles.iconContainer}>
            <Feather name="truck" size={25} color="orange" />
            <Text style={styles.sectionTextSub}>Número de Placas</Text>
          </View>
          <TouchableOpacity
            style={[styles.pickerContainer, errors.tipoVeiculo && styles.inputError]}
            onPress={() => setModalVisivel(true)}
            ref={refs.tipoVeiculo}
          >
            <Text style={styles.pickerText}>{tipoVeiculo}</Text>
            <Text style={styles.pickerArrow}>▼</Text>
          </TouchableOpacity>
          {errors.tipoVeiculo && <Text style={styles.errorText}>{errors.tipoVeiculo}</Text>}
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
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    onChangeTipoVeiculoHandler(option);
                    setModalVisivel(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
        
        {tipoVeiculo === "1" && (
          <>
            {renderDocumentInput("Documento veículo de tração", "placa_1")}
          </>
        )}
        {tipoVeiculo === "2" && (
          <>
            {renderDocumentInput("Documento veículo de tração", "placa_1")}
            {renderDocumentInput("Documento reboque 1", "placa_2")}
          </>
        )}
        {tipoVeiculo === "3" && (
          <>
            {renderDocumentInput("Documento veículo de tração", "placa_1")}
            {renderDocumentInput("Documento reboque 1", "placa_2")}
            {renderDocumentInput("Documento reboque 2", "placa_3")}
          </>
        )}

        <Text style={styles.sectionText}>Referências Pessoais</Text>
        <Text style={styles.descriptionText}>
          Forneça até três referências pessoais (opcional):
        </Text>
        {refPessoais.map((ref, index) => (
          <View key={`pessoal-${index}`}>
            <View style={styles.iconContainer}>
              <Feather name="user" size={25} color="orange" />
              <Text style={styles.sectionTextSub}>Referência Pessoal {index + 1}</Text>
            </View>
            <TextInput
              style={[styles.input, errors[`refPessoal_${index}_name`] && styles.inputError]}
              placeholder="Nome Completo"
              value={ref.name}
              onChangeText={(text) => onChangeRefPessoalHandler(index, "name", text)}
              ref={refs[`refPessoal_${index}_name`]}
            />
            {errors[`refPessoal_${index}_name`] && (
              <Text style={styles.errorText}>{errors[`refPessoal_${index}_name`]}</Text>
            )}
            <TextInput
              style={[styles.input, errors[`refPessoal_${index}_phone`] && styles.inputError]}
              placeholder="Telefone/Celular (10 ou 11 dígitos)"
              value={ref.phone}
              onChangeText={(text) => onChangeRefPessoalHandler(index, "phone", text)}
              keyboardType="phone-pad"
              ref={refs[`refPessoal_${index}_phone`]}
            />
            {errors[`refPessoal_${index}_phone`] && (
              <Text style={styles.errorText}>{errors[`refPessoal_${index}_phone`]}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionText}>Referências Comerciais</Text>
        <Text style={styles.descriptionText}>
          Forneça até duas referências comerciais (opcional):
        </Text>
        {refComerciais.map((ref, index) => (
          <View key={`comercial-${index}`}>
            <View style={styles.iconContainer}>
              <Feather name="briefcase" size={25} color="orange" />
              <Text style={styles.sectionTextSub}>Referência Comercial {index + 1}</Text>
            </View>
            <TextInput
              style={[styles.input, errors[`refComercial_${index}_name`] && styles.inputError]}
              placeholder="Nome da Empresa"
              value={ref.name}
              onChangeText={(text) => onChangeRefComercialHandler(index, "name", text)}
              ref={refs[`refComercial_${index}_name`]}
            />
            {errors[`refComercial_${index}_name`] && (
              <Text style={styles.errorText}>{errors[`refComercial_${index}_name`]}</Text>
            )}
            <TextInput
              style={[styles.input, errors[`refComercial_${index}_phone`] && styles.inputError]}
              placeholder="Telefone/Celular (10 ou 11 dígitos)"
              value={ref.phone}
              onChangeText={(text) => onChangeRefComercialHandler(index, "phone", text)}
              keyboardType="phone-pad"
              ref={refs[`refComercial_${index}_phone`]}
            />
            {errors[`refComercial_${index}_phone`] && (
              <Text style={styles.errorText}>{errors[`refComercial_${index}_phone`]}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionText}>Referências de Transportadoras</Text>
        <Text style={styles.descriptionText}>
          Forneça até três referências de transportadoras (opcional):
        </Text>
        {refTransportadoras.map((ref, index) => (
          <View key={`transp-${index}`}>
            <View style={styles.iconContainer}>
              <Feather name="truck" size={25} color="orange" />
              <Text style={styles.sectionTextSub}>Transportadora {index + 1}</Text>
            </View>
            <TextInput
              style={[styles.input, errors[`refTransportadora_${index}_name`] && styles.inputError]}
              placeholder="Nome da Transportadora"
              value={ref.name}
              onChangeText={(text) => onChangeRefTransportadoraHandler(index, "name", text)}
              ref={refs[`refTransportadora_${index}_name`]}
            />
            {errors[`refTransportadora_${index}_name`] && (
              <Text style={styles.errorText}>{errors[`refTransportadora_${index}_name`]}</Text>
            )}
            <TextInput
              style={[styles.input, errors[`refTransportadora_${index}_phone`] && styles.inputError]}
              placeholder="Telefone/Celular (10 ou 11 dígitos)"
              value={ref.phone}
              onChangeText={(text) => onChangeRefTransportadoraHandler(index, "phone", text)}
              keyboardType="phone-pad"
              ref={refs[`refTransportadora_${index}_phone`]}
            />
            {errors[`refTransportadora_${index}_phone`] && (
              <Text style={styles.errorText}>{errors[`refTransportadora_${index}_phone`]}</Text>
            )}
          </View>
        ))}

        <Text style={styles.sectionText}>Conta Bancária</Text>
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
          keyboardType="numeric"
          value={contaBancaria.numero_conta}
          onChangeText={(text) => onChangeContaBancariaHandler("numero_conta", text)}
          ref={refs.numero_conta}
        />
        {errors.numero_conta && <Text style={styles.errorText}>{errors.numero_conta}</Text>}
        <TouchableOpacity
          style={[styles.pickerContainer, errors.tipo_conta && styles.inputError]}
          onPress={() => setModalTipoContaVisivel(true)}
          ref={refs.tipo_conta}
        >
          <Text style={styles.pickerText}>{contaBancaria.tipo_conta}</Text>
          <Text style={styles.pickerArrow}>▼</Text>
        </TouchableOpacity>
        {errors.tipo_conta && <Text style={styles.errorText}>{errors.tipo_conta}</Text>}
        <Modal
          transparent={true}
          visible={modalTipoContaVisivel}
          onRequestClose={() => setModalTipoContaVisivel(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setModalTipoContaVisivel(false)}
          >
            <View style={styles.modalContent}>
              {tipoContaOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalOption}
                  onPress={() => {
                    onChangeContaBancariaHandler("tipo_conta", option);
                    setModalTipoContaVisivel(false);
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
        {errors.cpf_titular && <Text style={styles.errorText}>{errors.cpf_titular}</Text>}

        <TouchableOpacity
          onPress={handleRegisterPress}
          style={styles.registerButton}
        >
          <Text style={styles.buttonText}>REGISTRAR-SE</Text>
        </TouchableOpacity>
      </ScrollView>
      
      <Modal transparent={true} visible={modalEstadoVisivel} onRequestClose={() => setModalEstadoVisivel(false)}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalEstadoVisivel(false)}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            {loadingEstados ? <ActivityIndicator size="large" color={colors.azulPrincipal} /> : (
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
            {loadingCidades ? <ActivityIndicator size="large" color={colors.azulPrincipal} /> : (
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