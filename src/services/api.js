import axios from "axios";

// API do sistema POS (Serviços, Produtos, Agendamentos, Login, etc)
export const apiPOS = axios.create({ baseURL: "https://back-pdv-production.up.railway.app" });

// Alias para compatibilidade com código existente
export const api = apiPOS;

export async function login(data) {
  const response = await api.post("/login", { email: data.email, senha: data.senha });
  return response.data;
}

export async function register(data) {
  const response = await api.post("/cadastrar", data);
  return response.data;
}

export async function getConversas(token) {
  const response = await api.get("/conversas", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getMensagens(conversa_id, token) {
  const response = await api.get(`/conversas/${conversa_id}/mensagens`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function marcarMensagemComoLida(mensagem_id, token) {
  const response = await api.put(`/mensagens/${mensagem_id}/lida`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getContatos(role, token) {
  const response = await api.get("/usuarios", {
    headers: { Authorization: `Bearer ${token}` },
    params: { role },
  });
  return response.data;
}

export async function getFretes(token, filtros = {}) {
  // Limpa filtros vazios para não enviar query params desnecessários
  const activeFilters = Object.fromEntries(
    Object.entries(filtros).filter(([_, v]) => v != null && v !== '')
  );

  const response = await api.get("/fretes", {
    headers: { Authorization: `Bearer ${token}` },
    params: activeFilters,
  });
  return response.data;
}

export async function criarConversa(frete_id, destinatario_id, token) {
  const response = await api.post(
    "/conversas",
    { frete_id, destinatario_id },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function criarFrete(payload, token) {
  const response = await api.post("/fretes", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function solicitarFrete(frete_id, token) {
  const response = await api.post(
    "/solicitacoes",
    { frete_id },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

// Função para buscar as solicitações com base no perfil do usuário
export async function getSolicitacoes(token, userRole) {
  // O endpoint muda dependendo se o usuário é 'empresa' ou 'motorista'
  const endpoint = userRole === 'empresa' ? '/solicitacoes/empresa' : '/solicitacoes/motorista';
  const response = await api.get(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function responderSolicitacao(solicitacaoId, resposta, token) {
  const response = await api.put(
    `/solicitacoes/${solicitacaoId}/responder`,
    { status: resposta },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}

export async function atualizarFrete(frete_id, payload, token) {
  const response = await api.put(`/fretes/${frete_id}`,
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
}

export async function deletarFrete(frete_id, token) {
  const response = await api.delete(`/fretes/${frete_id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
}

export async function getDocumentosMotorista(token) {
  const response = await api.get("/documentos/motorista", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function getUserById(id, token) {
  const response = await api.get(`/usuarios/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateUserProfile(id, data, token) {
  const response = await api.patch(`/usuarios/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

// NOVA FUNÇÃO PARA ALTERAR SENHA
export async function changePassword(id, data, token) {
  const response = await api.patch(`/usuarios/${id}/alterar-senha`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function updateUserDocument(id, docType, imageBase64, token) {
  const response = await api.patch(`/usuarios/${id}/documento`,
    { docType, imageBase64 },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
}


// Função para buscar serviços prestados
export async function getServicos() {
  const response = await apiPOS.get("/servicos");
  return response.data;
}

// ============= FUNÇÕES DE AGENDAMENTOS =============

// Buscar todos os agendamentos
export async function getAgendamentos() {
  const response = await apiPOS.get("/agendamentos");
  return response.data;
}

// Buscar agendamento por ID
export async function getAgendamentoById(agendamento_id) {
  const response = await apiPOS.get(`/agendamentos/${agendamento_id}`);
  return response.data;
}

// Criar novo agendamento
export async function criarAgendamento(data) {
  const response = await apiPOS.post("/agendamentos", data);
  return response.data;
}

// Atualizar agendamento
export async function atualizarAgendamento(agendamento_id, data) {
  const response = await apiPOS.put(`/agendamentos/${agendamento_id}`, data);
  return response.data;
}

// Cancelar agendamento
export async function cancelarAgendamento(agendamento_id) {
  const response = await apiPOS.patch(`/agendamentos/${agendamento_id}/cancelar`);
  return response.data;
}

// Atualizar status do agendamento
export async function atualizarStatusAgendamento(agendamento_id, status) {
  const response = await apiPOS.patch(`/agendamentos/${agendamento_id}/status`, { status });
  return response.data;
}

// ============= FUNÇÕES DE PRODUTOS =============

// Buscar todos os produtos
export async function getProdutos() {
  const response = await apiPOS.get("/produtos");
  return response.data;
}

// Buscar produto por ID
export async function getProdutoById(produto_id) {
  const response = await apiPOS.get(`/produtos/${produto_id}`);
  return response.data;
}

// ============= FUNÇÕES DE PEDIDOS =============

// Buscar produtos disponíveis para pedidos
export async function getProdutosPedido() {
  const response = await apiPOS.get("/produtos-pedido");
  return response.data;
}

// Buscar todos os pedidos
export async function getPedidos() {
  const response = await apiPOS.get("/pedidos");
  return response.data;
}

// Buscar pedido por ID
export async function getPedidoById(pedido_id) {
  const response = await apiPOS.get(`/pedidos/${pedido_id}`);
  return response.data;
}

// Criar novo pedido
export async function criarPedido(data) {
  const response = await apiPOS.post("/pedidos", data);
  return response.data;
}

// Atualizar pedido
export async function atualizarPedido(pedido_id, data) {
  const response = await apiPOS.put(`/pedidos/${pedido_id}`, data);
  return response.data;
}

// Deletar pedido
export async function deletarPedido(pedido_id) {
  const response = await apiPOS.delete(`/pedidos/${pedido_id}`);
  return response.data;
}

