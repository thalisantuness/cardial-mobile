import axios from "axios";

export const api = axios.create({ baseURL: "https://truckage-api-production.up.railway.app" });
//export const api = axios.create({ baseURL: "http://192.168.3.7:4000" });

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

