import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';
import usuarioDefault from '../assets/images/usuario.png';
import '../App.css';

// Helper function para converter base64 em data URL
const getImageDataUrl = (base64String, defaultImage = null) => {
  if (!base64String) return defaultImage;
  
  // Se já é uma data URL completa, retorna como está
  if (base64String.startsWith('data:')) return base64String;
  
  // Se é apenas a string base64, adiciona o prefixo
  // Assume JPEG por padrão, mas pode ser ajustado conforme necessário
  return `data:image/jpeg;base64,${base64String}`;
};

const CardapioPublico = () => {
  const { id } = useParams();
  const [cardapio, setCardapio] = useState(null);
  const [usuario, setUsuario] = useState(null);
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
      
      // Buscar dados do usuário/restaurante
      if (data.usuarioId) {
        await fetchUsuario(data.usuarioId);
      }
    } catch (error) {
      console.error('Erro ao buscar cardápio:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuario = async (usuarioId) => {
    try {
      console.log('Buscando dados do usuário ID:', usuarioId); // Debug
      const response = await fetch(`${API_ENDPOINTS.usuarios}/${usuarioId}`);
      console.log('Status da resposta do usuário:', response.status);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('Dados completos do usuário encontrados:', userData);
        console.log('LogoUrl do usuário:', userData.logoUrl);
        console.log('BannerUrl do usuário:', userData.bannerUrl);
        setUsuario(userData);
      } else {
        console.log('Usuário não encontrado ou erro na requisição:', response.status);
        console.log('Response text:', await response.text());
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      // Não precisa tratar como erro crítico, apenas não mostra logo/banner
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
      {/* Header com banner de fundo */}
      <header 
        className="bg-white shadow-sm border-b relative min-h-[180px] sm:min-h-[200px] flex items-center"
        style={{
          backgroundImage: usuario?.bannerUrl ? `url(${getImageDataUrl(usuario.bannerUrl)})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '100%',
          backgroundAttachment: 'scroll' // Para melhor performance em mobile
        }}
      >
        
        
        {/* Overlay para melhor legibilidade do texto quando há banner */}
        {usuario && usuario.bannerUrl && (
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        )}
        
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 relative z-10 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Logo do restaurante - sempre mostrar, usando padrão se não tiver */}
            <div className="flex-shrink-0">
              <img 
                src={getImageDataUrl(usuario?.logoUrl, usuarioDefault)}
                alt="Logo do restaurante"
                className="h-14 w-14 sm:h-16 sm:w-16 rounded-full object-cover border-4 border-white shadow-lg"
                onLoad={() => {
                  console.log('Logo do usuário carregada com sucesso no cardápio público');
                }}
                onError={(e) => {
                  console.log('Erro ao carregar logo Base64 do usuário no cardápio público');
                  console.log('Usando imagem padrão');
                  e.target.src = usuarioDefault;
                }}
              />
            </div>
            
            <div className="text-center">
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold ${usuario && usuario.bannerUrl ? 'text-white' : 'text-gray-900'}`}>
                {cardapio.nome}
              </h1>
              <p className={`mt-2 text-sm sm:text-base ${usuario && usuario.bannerUrl ? 'text-gray-200' : 'text-gray-600'}`}>
                Cardápio Digital
              </p>
            </div>
          </div>
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
          {usuario?.nome && (
            <p className="mb-2">
              {usuario.nome}
              {usuario.telefone && (
                <span className="ml-2">• Tel: {usuario.telefone}</span>
              )}
            </p>
          )}
          <p>Cardápio Digital - Powered by RestauranteAdmin</p>
        </div>
      </footer>
    </div>
  );
};

export default CardapioPublico;
