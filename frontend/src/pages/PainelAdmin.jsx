import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../config/api";
import usuarioDefault from "../assets/images/usuario.png";
import "../App.css";

// Helper function para converter base64 em data URL
const getImageDataUrl = (base64String, defaultImage) => {
  if (!base64String) return defaultImage;
  
  // Se já é uma data URL completa, retorna como está
  if (base64String.startsWith('data:')) return base64String;
  
  // Se é apenas a string base64, adiciona o prefixo
  // Assume JPEG por padrão, mas pode ser ajustado conforme necessário
  return `data:image/jpeg;base64,${base64String}`;
};

const PainelAdmin = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [abaAtiva, setAbaAtiva] = useState("cardapios");
  const [cardapios, setCardapios] = useState([]);
  const [novoNome, setNovoNome] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [editNome, setEditNome] = useState("");
  // Estado para categorias globais
  const [categorias, setCategorias] = useState([]);
  const [novaCategoria, setNovaCategoria] = useState("");
  const [editandoCategoriaId, setEditandoCategoriaId] = useState(null);
  const [editCategoriaNome, setEditCategoriaNome] = useState("");
  // Estado para seleção de categorias ao criar cardápio
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [showAddCardapio, setShowAddCardapio] = useState(false);
  // Estado para itens globais
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({ nome: '', descricao: '', valor: '' });
  const [editandoItemId, setEditandoItemId] = useState(null);
  const [editItem, setEditItem] = useState({ nome: '', descricao: '', valor: '' });
  const [categoriaBusca, setCategoriaBusca] = useState("");
  // Novo fluxo baseado no modelo do banco de dados
  // 1. Criação de Cardápio
  // 2. Criação de Categorias (relacionadas ao cardápio selecionado)
  // 3. Adição/remoção de categorias do cardápio
  // 4. Adição/remoção de itens por categoria (relacionados à categoria selecionada)
  const [etapa, setEtapa] = useState('cardapio'); // 'cardapio' | 'categorias'
  const [cardapioSelecionado, setCardapioSelecionado] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  // Estados para link público
  const [linkPublico, setLinkPublico] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  // Estados para edição das informações do restaurante
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUsuario, setEditUsuario] = useState({
    nome: '',
    email: '',
    cnpj: '',
    telefone: '',
    logoFile: null,
    bannerFile: null
  });
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);

  // Carregar cardápios do backend ao montar, mas apenas quando o usuário estiver disponível
  useEffect(() => {
    if (user?.id) {
      console.log('Dados completos do usuário no PainelAdmin:', user); // Debug detalhado
      console.log('LogoUrl:', user.logoUrl);
      console.log('BannerUrl:', user.bannerUrl);
      fetchCardapios();
    }
  }, [user]);

  // Função para buscar cardápios do backend
  const fetchCardapios = async () => {
    try {
      const usuarioId = user?.id;
      if (!usuarioId) {
        console.error("Usuário não identificado");
        return;
      }
      
      console.log("Buscando cardápios para usuário:", usuarioId);
      
      const response = await fetch(`${API_ENDPOINTS.cardapios}/usuario/${usuarioId}`);
      
      console.log("Status da busca de cardápios:", response.status);
      
      if (!response.ok) throw new Error("Erro ao buscar cardápios");
      const data = await response.json();
      
      console.log("Cardápios encontrados:", data);
      
      setCardapios(data);
    } catch (error) {
      console.error("Erro ao buscar cardápios:", error);
    }
  };

  // Carregar categorias do backend ao selecionar cardápio
  useEffect(() => {
    if (cardapioSelecionado) fetchCategorias(cardapioSelecionado.id);
  }, [cardapioSelecionado]);

  // Função para buscar categorias do backend
  const fetchCategorias = async (cardapioId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.cardapios}/${cardapioId}/categorias`);
      if (!response.ok) throw new Error("Erro ao buscar categorias");
      const data = await response.json();
      setCategorias(data);
    } catch (error) {
      setCategorias([]);
    }
  };

  // Adicionar categoria (API)
  const adicionarCategoria = async () => {
    if (novaCategoria.trim() === "" || !cardapioSelecionado) return;
    try {
      const novaCategoriaData = {
        nome: novaCategoria,
        cardapioId: cardapioSelecionado.id,
        ativo: true,
        ordem: 0 // Ordem padrão
      };

      console.log("Criando nova categoria:", novaCategoriaData);

      const response = await fetch(`${API_ENDPOINTS.categorias}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novaCategoriaData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao criar categoria:", errorText);
        throw new Error("Erro ao criar categoria: " + errorText);
      }
      await fetchCategorias(cardapioSelecionado.id);
      setNovaCategoria("");
    } catch (error) {
      console.error("Erro ao criar categoria (catch):", error);
      alert("Erro ao criar categoria: " + error.message);
    }
  };

  // Remover categoria (API)
  const removerCategoria = async (id) => {
    if (!cardapioSelecionado) return;
    try {
      const response = await fetch(`${API_ENDPOINTS.categorias}/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erro ao remover categoria");
      await fetchCategorias(cardapioSelecionado.id);
    } catch (error) {
      console.error("Erro ao remover categoria:", error);
      alert("Erro ao remover categoria");
    }
  };

  // Editar categoria (API)
  const salvarEdicaoCategoria = async (id) => {
    try {
      // Obter a categoria atual para manter valores que não foram alterados
      const categoriaAtual = categorias.find(c => c.id === id);
      if (!categoriaAtual) {
        throw new Error("Categoria não encontrada");
      }

      const categoriaToUpdate = {
        id: id,
        nome: editCategoriaNome,
        cardapioId: cardapioSelecionado.id,
        ativo: categoriaAtual.ativo !== undefined ? categoriaAtual.ativo : true,
        ordem: categoriaAtual.ordem || 0
      };

      console.log("Atualizando categoria:", categoriaToUpdate);

      const response = await fetch(`${API_ENDPOINTS.categorias}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoriaToUpdate)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro detalhado ao editar categoria:", errorText);
        throw new Error("Erro ao editar categoria: " + errorText);
      }
      
      await fetchCategorias(cardapioSelecionado.id);
      setEditandoCategoriaId(null);
      setEditCategoriaNome("");
    } catch (error) {
      console.error("Erro ao editar categoria:", error);
      alert("Erro ao editar categoria: " + error.message);
    }
  };

  // Função para iniciar edição de categoria
  const iniciarEdicaoCategoria = (id, nome) => {
    setEditandoCategoriaId(id);
    setEditCategoriaNome(nome);
  };

  // Função para gerar link público
  const gerarLinkPublico = (cardapioId) => {
    const link = `${window.location.origin}/cardapio/${cardapioId}`;
    setLinkPublico(link);
    setShowLinkModal(true);
  };

  // Função para copiar link
  const copiarLink = () => {
    navigator.clipboard.writeText(linkPublico);
    alert('Link copiado para a área de transferência!');
  };

  // Adicionar cardápio com categorias selecionadas (API)
  const adicionarCardapio = async () => {
    if (novoNome.trim() === "") return;
    try {
      const usuarioId = user?.id; // Usar o ID do usuário logado
      if (!usuarioId) {
        alert("Erro: usuário não identificado");
        return;
      }
      
      console.log("Enviando dados do cardápio:", { nome: novoNome, usuarioId });
      
      const response = await fetch(API_ENDPOINTS.cardapios, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoNome, usuarioId })
      });
      
      console.log("Status da resposta:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro da API:", errorText);
        throw new Error(errorText);
      }
      
      const resultado = await response.json();
      console.log("Cardápio criado com sucesso:", resultado);
      
      await fetchCardapios();
      setNovoNome("");
      setCategoriasSelecionadas([]);
      setShowAddCardapio(false);
      
      alert("Cardápio criado com sucesso!");
    } catch (error) {
      console.error("Erro completo:", error);
      alert("Erro ao criar cardápio: " + error.message);
    }
  };

  // Remover cardápio (API)
  const removerCardapio = async (id) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.cardapios}/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erro ao remover cardápio");
      await fetchCardapios();
    } catch (error) {
      console.error("Erro ao remover cardápio:", error);
      alert("Erro ao remover cardápio");
    }
  };

  // Editar cardápio (API)
  const salvarEdicao = async (id) => {
    try {
      // Obter o cardápio atual para manter valores que não foram alterados
      const cardapioAtual = cardapios.find(c => c.id === id);
      if (!cardapioAtual) {
        throw new Error("Cardápio não encontrado");
      }

      const cardapioToUpdate = {
        id: id,
        nome: editNome,
        usuarioId: user?.id,
        descricao: cardapioAtual.descricao || "", // Manter descrição existente
        ativo: cardapioAtual.ativo !== undefined ? cardapioAtual.ativo : true // Manter status ativo
      };

      console.log("Atualizando cardápio:", cardapioToUpdate);
      
      const response = await fetch(`${API_ENDPOINTS.cardapios}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cardapioToUpdate)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro detalhado ao editar cardápio:", errorText);
        throw new Error("Erro ao editar cardápio: " + errorText);
      }
      
      await fetchCardapios();
      setEditandoId(null);
      setEditNome("");
    } catch (error) {
      console.error("Erro ao editar cardápio:", error);
      alert("Erro ao editar cardápio: " + error.message);
    }
  };

  // Função para iniciar edição de cardápio
  const iniciarEdicaoCardapio = (id, nome) => {
    setEditandoId(id);
    setEditNome(nome);
  };

  // Seleção de categorias ao criar cardápio
  const toggleCategoriaSelecionada = (id) => {
    setCategoriasSelecionadas((prev) =>
      prev.includes(id)
        ? prev.filter((cid) => cid !== id)
        : [...prev, id]
    );
  };

  // Carregar itens do backend ao selecionar categoria
  useEffect(() => {
    if (categoriaSelecionada) fetchItens(categoriaSelecionada.id);
  }, [categoriaSelecionada]);

  // Função para buscar itens do backend
  const fetchItens = async (categoriaId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.categorias}/${categoriaId}/itens`);
      if (!response.ok) throw new Error("Erro ao buscar itens");
      const data = await response.json();
      setItens(data);
    } catch (error) {
      console.error("Erro ao buscar itens:", error);
      setItens([]);
    }
  };

  // Adicionar item (API)
  const adicionarItem = async () => {
    if (!novoItem.nome.trim() || !categoriaSelecionada) return;
    
    // Validar se o valor é um número
    const preco = novoItem.valor ? Number(novoItem.valor.toString().replace(',', '.')) : null;
    if (novoItem.valor && isNaN(preco)) {
      alert("Valor do item deve ser um número válido");
      return;
    }
    
    try {
      const novoItemData = {
        nome: novoItem.nome,
        descricao: novoItem.descricao || "",
        preco: preco,
        categoriaId: categoriaSelecionada.id,
        disponivel: true, // Por padrão, item disponível
        ordem: 0 // Ordem padrão
      };

      console.log("Criando novo item:", novoItemData);

      const response = await fetch(`${API_ENDPOINTS.itensCardapio}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoItemData)
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao criar item:", errorText);
        throw new Error("Erro ao criar item: " + errorText);
      }
      await fetchItens(categoriaSelecionada.id);
      setNovoItem({ nome: '', descricao: '', valor: '' });
    } catch (error) {
      console.error("Erro ao criar item (catch):", error);
      alert("Erro ao criar item: " + error.message);
    }
  };

  // Remover item (API)
  const removerItem = async (id) => {
    if (!categoriaSelecionada) return;
    try {
      const response = await fetch(`${API_ENDPOINTS.itensCardapio}/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erro ao remover item");
      await fetchItens(categoriaSelecionada.id);
    } catch (error) {
      console.error("Erro ao remover item:", error);
      alert("Erro ao remover item");
    }
  };

  // Editar item (API)
  const salvarEdicaoItem = async (id) => {
    try {
      // Validar se o valor é um número
      const preco = Number(editItem.valor.toString().replace(',', '.'));
      if (isNaN(preco)) {
        alert("Valor do item deve ser um número válido");
        return;
      }
      
      // Obter o item atual para manter valores que não foram alterados
      const itemAtual = itens.find(i => i.id === id);
      if (!itemAtual) {
        throw new Error("Item não encontrado");
      }

      const itemToUpdate = {
        id: id,
        nome: editItem.nome,
        descricao: editItem.descricao || "",
        preco: preco,
        categoriaId: categoriaSelecionada.id,
        disponivel: itemAtual.disponivel !== undefined ? itemAtual.disponivel : true,
        ordem: itemAtual.ordem || 0
      };

      console.log("Atualizando item:", itemToUpdate);

      const response = await fetch(`${API_ENDPOINTS.itensCardapio}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemToUpdate)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao editar item:", errorText);
        throw new Error("Erro ao editar item: " + errorText);
      }
      
      await fetchItens(categoriaSelecionada.id);
      setEditandoItemId(null);
      setEditItem({ nome: '', descricao: '', valor: '' });
    } catch (error) {
      console.error("Erro ao editar item:", error);
      alert("Erro ao editar item: " + error.message);
    }
  };

  // Funções para edição das informações do restaurante
  const abrirEditModal = () => {
    setEditUsuario({
      nome: user?.nome || '',
      email: user?.email || '',
      cnpj: user?.cnpj || '',
      telefone: user?.telefone || '',
      logoFile: null,
      bannerFile: null
    });
    setLogoPreview(user?.logoUrl ? getImageDataUrl(user.logoUrl) : null);
    setBannerPreview(user?.bannerUrl ? getImageDataUrl(user.bannerUrl) : null);
    setShowEditModal(true);
  };

  const fecharEditModal = () => {
    setShowEditModal(false);
    setEditUsuario({
      nome: '',
      email: '',
      cnpj: '',
      telefone: '',
      logoFile: null,
      bannerFile: null
    });
    setLogoPreview(null);
    setBannerPreview(null);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditUsuario({ ...editUsuario, logoFile: file });
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditUsuario({ ...editUsuario, bannerFile: file });
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const salvarEdicaoUsuario = async () => {
    try {
      const formData = new FormData();
      
      // Adicionar dados do usuário
      formData.append('nome', editUsuario.nome);
      formData.append('email', editUsuario.email);
      formData.append('cnpj', editUsuario.cnpj);
      formData.append('telefone', editUsuario.telefone);
      
      // Adicionar arquivos se selecionados
      if (editUsuario.logoFile) {
        formData.append('logoFile', editUsuario.logoFile);
      }
      if (editUsuario.bannerFile) {
        formData.append('bannerFile', editUsuario.bannerFile);
      }

      console.log('Atualizando usuário ID:', user.id);
      
      const response = await fetch(`${API_ENDPOINTS.usuarios}/${user.id}`, {
        method: 'PUT',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Erro ${response.status}: ${errorData}`);
      }

      const updatedUser = await response.json();
      console.log('Usuário atualizado:', updatedUser);
      
      // Atualizar contexto de autenticação se necessário
      // Você pode precisar implementar uma função updateUser no AuthContext
      
      fecharEditModal();
      alert('Informações atualizadas com sucesso!');
      
      // Recarregar a página para atualizar as informações do usuário
      window.location.reload();
      
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      alert('Erro ao atualizar informações: ' + error.message);
    }
  };

  // Função para fazer logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Sidebar navigation state (removido Dashboard e Perfil)
  const [sidebar, setSidebar] = useState([
    { label: 'Cardápios', icon: '📋', active: abaAtiva === 'cardapios' },
  ]);

  // Atualiza sidebar ao trocar de aba
  React.useEffect(() => {
    setSidebar(sidebar.map(item => ({ ...item, active: (item.label === 'Cardápios' && abaAtiva === 'cardapios') })));
  }, [abaAtiva]);

  const categoriasFiltradas = categorias.filter(cat => cat.nome.toLowerCase().includes((categoriaBusca || "").toLowerCase()));

  // Função para selecionar cardápio e ir para etapa de categorias
  const selecionarCardapio = (cardapio) => {
    setCardapioSelecionado(cardapio);
    setEtapa('categorias');
  };

  // Função para voltar para etapa de cardápio
  const voltarParaCardapio = () => {
    setCardapioSelecionado(null);
    setEtapa('cardapio');
  };

  // Função para selecionar categoria e gerenciar itens
  const selecionarCategoria = (categoria) => {
    setCategoriaSelecionada(categoria);
  };

  // Função para voltar para etapa de categorias
  const voltarParaCategorias = () => {
    setCategoriaSelecionada(null);
  };

  // Função para iniciar edição de item
  const iniciarEdicaoItem = (id, item) => {
    setEditandoItemId(id);
    setEditItem({
      nome: item.nome,
      descricao: item.descricao || '',
      valor: item.preco || 0
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com informações do usuário */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Logo do restaurante - clicável para editar */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <button
                  onClick={abrirEditModal}
                  className="p-0 border-0 bg-transparent cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img 
                    src={getImageDataUrl(user?.logoUrl, usuarioDefault)}
                    alt="Logo do restaurante - Clique para editar"
                    className="h-12 w-12 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                    onLoad={() => {
                      console.log('Logo carregada com sucesso:', user?.logoUrl ? 'Base64 image' : 'Default image');
                    }}
                    onError={(e) => {
                      console.log('Erro ao carregar logo Base64, usando imagem padrão');
                      e.target.src = usuarioDefault;
                    }}
                  />
                </button>
                {/* Ícone de edição */}
                <button 
                  className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={abrirEditModal}
                  title="Editar informações do restaurante"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
              <p className="text-sm text-gray-600">
                Bem-vindo, {user?.nome || 'Usuário'}
              </p>
              <button 
                onClick={abrirEditModal}
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
              >
                Editar informações
              </button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Sair
          </button>
        </div>
      </header>
      
      <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col justify-between min-h-screen"
        style={{ height: 'calc(100vh - 72px)' }}
      >
        <div>
          <div className="flex items-center gap-2 px-6 py-6 text-2xl font-bold text-gray-900 border-b" style={{ minHeight: '72px', borderBottom: '1.5px solid #e5e7eb' }}>
            <span style={{ marginRight: 'auto' }}>RestauranteAdmin</span>
            <span className="text-xl">☰</span>
          </div>
          <nav className="mt-6">
            <ul className="space-y-1">
              {sidebar.map((item, idx) => (
                <li key={item.label}>
                  <button
                    className={`w-full flex items-center gap-3 px-6 py-3 text-base rounded-l-full transition-colors ${item.active ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                    onClick={() => {
                      setAbaAtiva('cardapios');
                    }}
                  >
                    <span>{item.icon}</span> {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="px-6 py-4 text-xs text-gray-400 border-t">RestauranteAdmin v1.0</div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8 border-l" style={{ borderLeft: '1.5px solid #e5e7eb' }}>
        {etapa === 'cardapio' && (
          <section>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Cardápios</h1>
            <p className="text-gray-500 mb-6">Crie um cardápio para o seu restaurante</p>
            <div className="bg-white rounded-lg shadow p-6 border max-w-lg mb-8">
              {editandoId ? (
                <>
                  <h2 className="text-xl font-bold mb-4">Editar Cardápio</h2>
                  <input
                    type="text"
                    placeholder="Nome do cardápio"
                    value={editNome}
                    onChange={e => setEditNome(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => salvarEdicao(editandoId)}>Salvar</button>
                    <button className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={() => {
                      setEditandoId(null);
                      setEditNome("");
                    }}>Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold mb-4">Novo Cardápio</h2>
                  <input
                    type="text"
                    placeholder="Nome do cardápio"
                    value={novoNome}
                    onChange={e => setNovoNome(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <button className="btn-adicionar w-full" onClick={adicionarCardapio}>Criar Cardápio</button>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cardapios.length === 0 && (
                <div className="col-span-full text-gray-400 text-center">Nenhum cardápio cadastrado ainda.</div>
              )}
              {cardapios.map(c => (
                <div key={c.id} className="bg-white rounded-lg shadow p-6 flex flex-col gap-2 border relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-gray-900">{c.nome}</span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-900 text-white">Ativo</span>
                  </div>
                  <div className="text-sm text-gray-700">Categorias: <span className="font-bold">{c.categorias ? c.categorias.length : 0}</span></div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button className="flex-1 flex items-center gap-1 px-2 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 text-sm font-medium" onClick={() => selecionarCardapio(c)}>
                      <span>📂</span> Gerenciar
                    </button>
                    <button className="flex-1 flex items-center gap-1 px-2 py-2 bg-yellow-100 rounded hover:bg-yellow-200 text-yellow-700 text-sm font-medium" onClick={() => iniciarEdicaoCardapio(c.id, c.nome)}>
                      <span>✏️</span> Editar
                    </button>
                    <button className="flex-1 flex items-center gap-1 px-2 py-2 bg-green-100 rounded hover:bg-green-200 text-green-700 text-sm font-medium" onClick={() => gerarLinkPublico(c.id)}>
                      <span>🔗</span> Link
                    </button>
                    <button className="px-2 py-2 bg-red-100 rounded hover:bg-red-200 text-red-700" onClick={() => removerCardapio(c.id)}>
                      <span>🗑️</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        {etapa === 'categorias' && cardapioSelecionado && !categoriaSelecionada && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300" onClick={voltarParaCardapio}>← Voltar</button>
              <h1 className="text-2xl font-bold text-gray-900">Categorias do Cardápio: {cardapioSelecionado.nome}</h1>
            </div>
            <div className="flex gap-8">
              {/* Painel lateral de cadastro/edição de categorias */}
              <div className="w-full max-w-xs bg-white rounded-lg shadow p-6 border h-fit">
                <h2 className="text-xl font-bold mb-4">Nova Categoria</h2>
                <input
                  type="text"
                  placeholder="Nome da categoria"
                  value={novaCategoria}
                  onChange={e => setNovaCategoria(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button className="btn-adicionar w-full" onClick={adicionarCategoria}>Adicionar Categoria</button>
                <ul className="space-y-3 mt-4">
                  {categorias.filter(cat => cat.cardapioId === cardapioSelecionado.id).length === 0 && (
                    <li className="text-gray-400 text-center">Nenhuma categoria cadastrada ainda.</li>
                  )}
                  {categorias.filter(cat => cat.cardapioId === cardapioSelecionado.id).map(c => (
                    <li key={c.id} className="bg-gray-50 p-3 rounded border">
                      {editandoCategoriaId === c.id ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            value={editCategoriaNome}
                            onChange={e => setEditCategoriaNome(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="flex justify-between gap-2 mt-2">
                            <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => salvarEdicaoCategoria(c.id)}>Salvar</button>
                            <button className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={() => setEditandoCategoriaId(null)}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-medium cursor-pointer" onClick={() => selecionarCategoria(c)}>{c.nome}</span>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded bg-gray-200 text-gray-700" onClick={() => iniciarEdicaoCategoria(c.id, c.nome)}>Editar</button>
                            <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={() => removerCategoria(c.id)}>Remover</button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Painel principal: visualização das categorias do cardápio */}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-4">Categorias deste Cardápio</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categorias.filter(cat => cat.cardapioId === cardapioSelecionado.id).length === 0 && (
                    <div className="col-span-full text-gray-400 text-center">Nenhuma categoria cadastrada.</div>
                  )}
                  {categorias.filter(cat => cat.cardapioId === cardapioSelecionado.id).map(c => (
                    <div 
                      key={c.id} 
                      className="bg-white rounded-lg shadow p-6 border cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => selecionarCategoria(c)}
                    >
                      <div className="font-semibold text-gray-900 mb-2">{c.nome}</div>
                      <div className="text-xs text-gray-500">Clique para gerenciar itens desta categoria</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
        {etapa === 'categorias' && cardapioSelecionado && categoriaSelecionada && (
          <section>
            <div className="flex items-center gap-4 mb-6">
              <button className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300" onClick={voltarParaCategorias}>← Voltar</button>
              <h1 className="text-2xl font-bold text-gray-900">Itens da Categoria: {categoriaSelecionada.nome}</h1>
            </div>
            <div className="flex gap-8">
              {/* Painel lateral: adicionar novo item */}
              <div className="w-full max-w-xs bg-white rounded-lg shadow p-6 border h-fit">
                <h2 className="text-xl font-bold mb-4">Novo Item</h2>
                <input
                  type="text"
                  placeholder="Nome do item"
                  value={novoItem.nome}
                  onChange={e => setNovoItem({ ...novoItem, nome: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <input
                  type="text"
                  placeholder="Descrição"
                  value={novoItem.descricao}
                  onChange={e => setNovoItem({ ...novoItem, descricao: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <input
                  type="number"
                  placeholder="Valor (R$)"
                  value={novoItem.valor}
                  onChange={e => setNovoItem({ ...novoItem, valor: e.target.value })}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <button className="btn-adicionar w-full" onClick={adicionarItem}>Adicionar Item</button>
                <ul className="space-y-3 mt-4">
                  {itens.filter(i => i.categoriaId === categoriaSelecionada.id).length === 0 && (
                    <li className="text-gray-400 text-center">Nenhum item cadastrado ainda.</li>
                  )}
                  {itens.filter(i => i.categoriaId === categoriaSelecionada.id).map(i => (
                    <li key={i.id} className="bg-gray-50 p-3 rounded border">
                      {editandoItemId === i.id ? (
                        <div className="flex flex-col gap-2">
                          <input
                            type="text"
                            placeholder="Nome do item"
                            value={editItem.nome}
                            onChange={e => setEditItem({ ...editItem, nome: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <input
                            type="text"
                            placeholder="Descrição"
                            value={editItem.descricao}
                            onChange={e => setEditItem({ ...editItem, descricao: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <input
                            type="number"
                            placeholder="Valor (R$)"
                            value={editItem.valor}
                            onChange={e => setEditItem({ ...editItem, valor: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <div className="flex justify-between gap-2">
                            <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={() => salvarEdicaoItem(i.id)}>Salvar</button>
                            <button className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300" onClick={() => setEditandoItemId(null)}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{i.nome}</div>
                            <div className="text-xs text-gray-500">{i.descricao}</div>
                            <div className="text-green-700 font-semibold">R$ {i.preco ? Number(i.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded bg-gray-200 text-gray-700" onClick={() => iniciarEdicaoItem(i.id, i)}>Editar</button>
                            <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={() => removerItem(i.id)}>Remover</button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Painel principal: visualização dos itens da categoria */}
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-4">Itens desta Categoria</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {itens.filter(i => i.categoriaId === categoriaSelecionada.id).length === 0 && (
                    <div className="col-span-full text-gray-400 text-center">Nenhum item cadastrado.</div>
                  )}
                  {itens.filter(i => i.categoriaId === categoriaSelecionada.id).map(i => (
                    <div key={i.id} className="bg-white rounded-lg shadow p-6 border">
                      <div className="font-semibold text-gray-900 mb-2">{i.nome}</div>
                      <div className="text-xs text-gray-500 mb-1">{i.descricao}</div>
                      <div className="text-green-700 font-semibold">R$ {i.preco ? Number(i.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      
      {/* Modal para mostrar link público */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Link Público do Cardápio</h3>
            <div className="bg-gray-100 p-3 rounded mb-4 break-all text-sm">
              {linkPublico}
            </div>
            <div className="flex gap-2">
              <button 
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={copiarLink}
              >
                Copiar Link
              </button>
              <button 
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                onClick={() => setShowLinkModal(false)}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar informações do restaurante */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-6">Editar Informações do Restaurante</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações básicas */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Restaurante
                  </label>
                  <input
                    type="text"
                    value={editUsuario.nome}
                    onChange={(e) => setEditUsuario({ ...editUsuario, nome: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do restaurante"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editUsuario.email}
                    onChange={(e) => setEditUsuario({ ...editUsuario, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@restaurante.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ
                  </label>
                  <input
                    type="text"
                    value={editUsuario.cnpj}
                    onChange={(e) => setEditUsuario({ ...editUsuario, cnpj: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="00.000.000/0000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={editUsuario.telefone}
                    onChange={(e) => setEditUsuario({ ...editUsuario, telefone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              {/* Upload de imagens */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Logo do Restaurante
                  </label>
                  <div className="flex flex-col items-center gap-3">
                    {logoPreview && (
                      <img 
                        src={logoPreview} 
                        alt="Preview Logo" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner do Restaurante
                  </label>
                  <div className="flex flex-col items-center gap-3">
                    {bannerPreview && (
                      <img 
                        src={bannerPreview} 
                        alt="Preview Banner" 
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3 mt-8 pt-6 border-t">
              <button 
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                onClick={salvarEdicaoUsuario}
              >
                Salvar Alterações
              </button>
              <button 
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
                onClick={fecharEditModal}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default PainelAdmin;
