import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import olhoAberto from "../assets/images/olho_aberto.ico";
import olhoFechado from "../assets/images/olho_fechado.ico";

export default function CadastroRestaurante() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cnpj: '',
    telefone: '',
    senha: '',
    logo: null,
    banner: null
    });    
    
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [showValidationErrors, setShowValidationErrors] = useState(false);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const handleKeyDown = (e) => setCapsLockOn(e.getModifierState("CapsLock"));
    const handleKeyUp = (e) => setCapsLockOn(e.getModifierState("CapsLock"));const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        
        // Limpa os erros quando o usuário começa a digitar
        if (showValidationErrors && errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
        
        setFormData((prev) => ({
            ...prev,
            [name]: type === "file" ? files[0] : value
        }));
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setShowValidationErrors(true);

      const newErrors = {};
      if (!formData.nome) newErrors.nome = "Nome é obrigatório.";
      if (!formData.email) newErrors.email = "Email é obrigatório.";
      if (!formData.cnpj) newErrors.cnpj = "CNPJ é obrigatório.";
      if (!formData.telefone) newErrors.telefone = "Telefone é obrigatório.";
      if (!formData.senha) newErrors.senha = "Senha é obrigatória.";

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      setShowValidationErrors(false);

      const data = new FormData();
      data.append("nome", formData.nome);
      data.append("email", formData.email);
      data.append("cnpj", formData.cnpj);
      data.append("telefone", formData.telefone);
      data.append("senha", formData.senha);

      if (formData.logo) data.append("logo", formData.logo);
      if (formData.banner) data.append("banner", formData.banner);

      try {
        const response = await fetch("http://localhost:5000/api/usuarios", {
          method: "POST",
          body: data,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro ao criar restaurante:", errorData);
          setErrors({ geral: errorData.message || "Erro ao criar restaurante" });
          return;
        }

        const result = await response.json();
        console.log("Restaurante criado com sucesso:", result);
        
        // Se o cadastro retornar um token, fazer login automaticamente
        if (result.token) {
          login(result.usuario || { nome: formData.nome, email: formData.email }, result.token);
          navigate("/painel");
        } else {
          // Caso contrário, redirecionar para login
          alert("Cadastro realizado com sucesso! Faça o login.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Erro ao enviar requisição:", error);
        setErrors({ geral: "Erro inesperado ao enviar o formulário." });
      }
    };


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Cadastro
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Preencha os dados abaixo para criar sua conta
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome do Restaurante
              </label>
              <div className="mt-1">                
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Digite o nome do restaurante"
                  onChange={handleChange}
                  autoComplete="off"
                />
                {showValidationErrors && errors.nome && <p className="text-sm text-red-500 mt-1">{errors.nome}</p>}
              </div>
            </div>            
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">                
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="seu@email.com"
                  onChange={handleChange}
                  autoComplete="nope"
                  data-lpignore="true"
                />
                {showValidationErrors && errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
              </div>
            </div>            
            
            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                CNPJ
              </label>
              <div className="mt-1">                
                <input
                  id="cnpj"
                  name="cnpj"
                  type="text"
                  value={formData.cnpj}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="00.000.000/0000-00"
                  onChange={handleChange}
                  autoComplete="off"
                />
                {showValidationErrors && errors.cnpj && <p className="text-sm text-red-500 mt-1">{errors.cnpj}</p>}
              </div>
            </div>            
            
            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1">                
                <input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  value={formData.telefone}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="(00) 00000-0000"
                  onChange={handleChange}
                  autoComplete="off"
                />
                {showValidationErrors && errors.telefone && <p className="text-sm text-red-500 mt-1">{errors.telefone}</p>}
              </div>
            </div>           
            
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <div className="relative">
                  <input
                    id="senha"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    data-lpignore="true"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                  >
                    <img 
                      src={showPassword ? olhoFechado : olhoAberto}
                      alt={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      className="h-5 w-5 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                    />
                  </button>
                </div>
                {capsLockOn && (
                  <p className="mt-1 text-xs text-red-500">Caps Lock está ativado</p>
                )}
                {showValidationErrors && errors.senha && <p className="text-sm text-red-500 mt-1">{errors.senha}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
                Logo do Restaurante
              </label>
              <div className="mt-1 flex items-center">
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="banner" className="block text-sm font-medium text-gray-700">
                Banner do Restaurante
              </label>
              <div className="mt-1 flex items-center">
                <input
                  id="banner"
                  name="banner"
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cadastrar
              </button>
            </div>

          </form>

          <div className="mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{" "}
                <Link 
                  to="/login" 
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Faça login aqui
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}