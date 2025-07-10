import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import CadastroRestaurante from './pages/CadastroRestaurante'
import Login from './pages/Login'
import PainelAdmin from './pages/PainelAdmin'
import CardapioPublico from './pages/CardapioPublico'


// Componente para redirecionar baseado na autenticação
function AuthRedirect() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated() ? <Navigate to="/painel" replace /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastroRestaurante />} />
          <Route path="/cardapio/:id" element={<CardapioPublico />} />
          <Route 
            path="/painel" 
            element={
              <ProtectedRoute>
                <PainelAdmin />
              </ProtectedRoute>
            } 
          />
          {/* Rota para capturar URLs não encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
