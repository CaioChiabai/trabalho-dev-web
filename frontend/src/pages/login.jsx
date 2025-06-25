import { useState } from "react";
import olhoAberto from "../assets/images/olho_aberto.ico";
import olhoFechado from "../assets/images/olho_fechado.ico";

export default function Login() {
  const [formData, setFormData] = useState({
    nome: "",
    senha: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleKeyDown = (e) => setCapsLockOn(e.getModifierState("CapsLock"));
  const handleKeyUp = (e) => setCapsLockOn(e.getModifierState("CapsLock"));

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limpa os erros quando o usuário começa a digitar
    if (showValidationErrors && errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowValidationErrors(true);
    const newErrors = {};

    if (!formData.nome) newErrors.nome = "Nome é obrigatório.";
    if (!formData.senha) newErrors.senha = "Senha é obrigatória.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setShowValidationErrors(false);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.token) {
        // Aqui você pode salvar o token no localStorage e redirecionar o usuário
        // localStorage.setItem("token", data.token);
        // window.location.href = "/"; // redireciona para a home
        alert("Login realizado!"); // Remova este alert se quiser
      } else {
        setErrors({ geral: "Nome ou senha inválidos." });
      }
    } catch (error) {
      setErrors({ geral: "Erro ao conectar com o servidor." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Login
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Entre com seu nome e senha para acessar sua conta
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit} autoComplete="off">
            {errors.geral && (
              <div className="text-red-500 text-center text-sm mb-2">{errors.geral}</div>
            )}
            <div>
              <label htmlFor="nome-login" className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <div className="mt-1">
                <input
                  id="nome-login"
                  name="nome"
                  type="text"
                  value={formData.nome}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Digite seu nome"
                  onChange={handleChange}
                  autoComplete="off"
                />
                {showValidationErrors && errors.nome && (
                  <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="senha-login" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <div className="relative">
                  <input
                    id="senha-login"
                    name="senha"
                    type={showPassword ? "text" : "password"}
                    value={formData.senha}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    data-lpignore="true"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={togglePasswordVisibility}
                    tabIndex={-1}
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
                {showValidationErrors && errors.senha && (
                  <p className="text-sm text-red-500 mt-1">{errors.senha}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}