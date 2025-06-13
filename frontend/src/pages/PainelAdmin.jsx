import React, { useState, useEffect } from "react";
import "../App.css";

const PainelAdmin = () => {
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

  // Carregar cardápios do backend ao montar
  useEffect(() => {
    fetchCardapios();
  }, []);

  // Função para buscar cardápios do backend
  const fetchCardapios = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/cardapios");
      if (!response.ok) throw new Error("Erro ao buscar cardápios");
      const data = await response.json();
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
      const response = await fetch(`http://localhost:5000/api/cardapios/${cardapioId}/categorias`);
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
      const response = await fetch(`http://localhost:5000/api/categorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novaCategoria, cardapioId: cardapioSelecionado.id })
      });
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Erro ao criar categoria:", errorText); // <-- LOG ERRO DETALHADO
        throw new Error("Erro ao criar categoria: " + errorText);
      }
      await fetchCategorias(cardapioSelecionado.id);
      setNovaCategoria("");
    } catch (error) {
      console.error("Erro ao criar categoria (catch):", error); // <-- LOG ERRO DETALHADO
      alert("Erro ao criar categoria");
    }
  };

  // Remover categoria (API)
  const removerCategoria = async (id) => {
    if (!cardapioSelecionado) return;
    try {
      const response = await fetch(`http://localhost:5000/api/categorias/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erro ao remover categoria");
      await fetchCategorias(cardapioSelecionado.id);
    } catch (error) {
      alert("Erro ao remover categoria");
    }
  };

  // Editar categoria (API)
  const salvarEdicaoCategoria = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editCategoriaNome })
      });
      if (!response.ok) throw new Error("Erro ao editar categoria");
      await fetchCategorias(cardapioSelecionado.id);
      setEditandoCategoriaId(null);
      setEditCategoriaNome("");
    } catch (error) {
      alert("Erro ao editar categoria");
    }
  };

  // Adicionar cardápio com categorias selecionadas (API)
  const adicionarCardapio = async () => {
    if (novoNome.trim() === "") return;
    try {
      const usuarioId = 1; // ou outro id válido
      const response = await fetch("http://localhost:5000/api/cardapios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: novoNome, usuarioId })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      await fetchCardapios();
      setNovoNome("");
      setCategoriasSelecionadas([]);
      setShowAddCardapio(false);
    } catch (error) {
      alert("Erro ao criar cardápio: " + error.message);
    }
  };

  // Remover cardápio (API)
  const removerCardapio = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cardapios/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erro ao remover cardápio");
      await fetchCardapios();
    } catch (error) {
      alert("Erro ao remover cardápio");
    }
  };

  // Editar cardápio (API)
  const salvarEdicao = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cardapios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: editNome, categorias: categoriasSelecionadas })
      });
      if (!response.ok) throw new Error("Erro ao editar cardápio");
      await fetchCardapios();
      setEditandoId(null);
      setEditNome("");
      setCategoriasSelecionadas([]);
    } catch (error) {
      alert("Erro ao editar cardápio");
    }
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
      const response = await fetch(`http://localhost:5000/api/categorias/${categoriaId}/itens`);
      if (!response.ok) throw new Error("Erro ao buscar itens");
      const data = await response.json();
      setItens(data);
    } catch (error) {
      setItens([]);
    }
  };

  // Adicionar item (API)
  const adicionarItem = async () => {
    if (!novoItem.nome.trim() || !novoItem.valor || !categoriaSelecionada) return;
    try {
      const response = await fetch(`http://localhost:5000/api/itenscardapio`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoItem.nome,
          descricao: novoItem.descricao,
          preco: Number(novoItem.valor.toString().replace(',', '.')),
          categoriaId: categoriaSelecionada.id
        })
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
      alert("Erro ao criar item");
    }
  };

  // Remover item (API)
  const removerItem = async (id) => {
    if (!categoriaSelecionada) return;
    try {
      const response = await fetch(`http://localhost:5000/api/itenscardapio/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Erro ao remover item");
      await fetchItens(categoriaSelecionada.id);
    } catch (error) {
      alert("Erro ao remover item");
    }
  };

  // Editar item (API)
  const salvarEdicaoItem = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/itenscardapio/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editItem)
      });
      if (!response.ok) throw new Error("Erro ao editar item");
      await fetchItens(categoriaSelecionada.id);
      setEditandoItemId(null);
      setEditItem({ nome: '', descricao: '', valor: '' });
    } catch (error) {
      alert("Erro ao editar item");
    }
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

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white flex flex-col justify-between min-h-screen">
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
                      if (item.label === 'Cardápios') setAbaAtiva('cardapios');
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
              <input
                type="text"
                placeholder="Nome do cardápio"
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button className="btn-adicionar w-full" onClick={adicionarCardapio}>Criar Cardápio</button>
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
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 flex items-center gap-2 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200 text-gray-700 text-sm font-medium" onClick={() => selecionarCardapio(c)}>
                      <span>📂</span> Gerenciar Categorias
                    </button>
                    <button className="flex-1 flex items-center justify-center px-3 py-2 bg-red-100 rounded hover:bg-red-200 text-red-700" onClick={() => removerCardapio(c.id)}>
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
                    <li key={c.id} className="bg-gray-50 p-3 rounded border flex items-center justify-between gap-2">
                      {editandoCategoriaId === c.id ? (
                        <>
                          <input
                            type="text"
                            value={editCategoriaNome}
                            onChange={e => setEditCategoriaNome(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <button className="btn-adicionar" onClick={() => salvarEdicaoCategoria(c.id)}>Salvar</button>
                          <button className="px-3 py-1 rounded bg-gray-200 text-gray-700" onClick={() => setEditandoCategoriaId(null)}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <span className="font-medium flex-1 cursor-pointer" onClick={() => selecionarCategoria(c)}>{c.nome}</span>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded bg-gray-200 text-gray-700" onClick={() => iniciarEdicaoCategoria(c.id, c.nome)}>Editar</button>
                            <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={() => removerCategoria(c.id)}>Remover</button>
                          </div>
                        </>
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
                    <div key={c.id} className="bg-white rounded-lg shadow p-6 border">
                      <div className="font-semibold text-gray-900 mb-2 cursor-pointer" onClick={() => selecionarCategoria(c)}>{c.nome}</div>
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
                    <li key={i.id} className="bg-gray-50 p-3 rounded border flex items-center justify-between gap-2">
                      {editandoItemId === i.id ? (
                        <>
                          <input
                            type="text"
                            value={editItem.nome}
                            onChange={e => setEditItem({ ...editItem, nome: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <input
                            type="text"
                            value={editItem.descricao}
                            onChange={e => setEditItem({ ...editItem, descricao: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <input
                            type="number"
                            value={editItem.valor}
                            onChange={e => setEditItem({ ...editItem, valor: e.target.value })}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <button className="btn-adicionar" onClick={() => {
                            setItens(itens.map(it => it.id === i.id ? { ...it, ...editItem } : it));
                            setEditandoItemId(null);
                            setEditItem({ nome: '', descricao: '', valor: '' });
                          }}>Salvar</button>
                          <button className="px-3 py-1 rounded bg-gray-200 text-gray-700" onClick={() => setEditandoItemId(null)}>Cancelar</button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="font-medium">{i.nome}</div>
                            <div className="text-xs text-gray-500">{i.descricao}</div>
                            <div className="text-green-700 font-semibold">R$ {i.preco ? Number(i.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0,00'}</div>
                          </div>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded bg-gray-200 text-gray-700" onClick={() => { setEditandoItemId(i.id); setEditItem({ nome: i.nome, descricao: i.descricao, valor: i.valor }); }}>Editar</button>
                            <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={() => removerItem(i.id)}>Remover</button>
                          </div>
                        </>
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
    </div>
  );
};

export default PainelAdmin;
