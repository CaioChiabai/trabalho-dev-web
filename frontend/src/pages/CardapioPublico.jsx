import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import '../App.css';

const CardapioPublico = () => {
  const { id } = useParams();
  const [cardapio, setCardapio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCardapio();
  }, [id]);

  const fetchCardapio = async () => {
    try {
      const url = `${API_ENDPOINTS.cardapios}/publico/${id}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Cardápio não encontrado (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Estrutura do cardápio:', JSON.stringify(data, null, 2));
      setCardapio(data);
    } catch (error) {
      console.error('Erro ao buscar cardápio:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando cardápio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Cardápio não encontrado</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">
            {cardapio.nome}
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Cardápio Digital
          </p>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {cardapio.categorias && cardapio.categorias.length > 0 ? (
          <div className="space-y-8">
            {cardapio.categorias.map(categoria => (
              <section key={categoria.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-indigo-600 px-6 py-4">
                  <h2 className="text-xl font-semibold text-white">
                    {categoria.nome}
                  </h2>
                </div>
                
                <div className="p-6">
                  {categoria.itensCardapio && categoria.itensCardapio.length > 0 ? (
                    <div className="grid gap-4">
                      {categoria.itensCardapio.map(item => (
                        <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 text-lg">
                                {item.nome}
                              </h3>
                              {item.descricao && (
                                <p className="text-gray-600 mt-1">
                                  {item.descricao}
                                </p>
                              )}
                            </div>
                            <div className="ml-4 text-right">
                              <span className="text-xl font-bold text-green-600">
                                R$ {Number(item.preco).toLocaleString('pt-BR', { 
                                  minimumFractionDigits: 2, 
                                  maximumFractionDigits: 2 
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      Nenhum item nesta categoria
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Este cardápio ainda não possui categorias</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          Cardápio Digital - Powered by RestauranteAdmin
        </div>
      </footer>
    </div>
  );
};

export default CardapioPublico;
