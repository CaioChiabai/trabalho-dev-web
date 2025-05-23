document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');

  // Criar container para alertas, se não existir
  let alertContainer = document.createElement('div');
  alertContainer.id = 'alert-container';
  form.prepend(alertContainer);

  const showAlert = (message, type = 'danger') => {
    alertContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
      </div>
    `;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      showAlert('Por favor, preencha todos os campos.', 'warning');
      return;
    }

    try {
      const res = await fetch('http://localhost:1337/api/auth/local', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 400 && data?.error?.message === 'Invalid identifier or password') {
          showAlert('Email ou senha inválidos. Tente novamente.');
        } else {
          showAlert(`Erro: ${data?.error?.message || 'Ocorreu um erro desconhecido.'}`);
        }
        return;
      }

      if (data.jwt) {
        localStorage.setItem('token', data.jwt);
        showAlert('Login realizado com sucesso!', 'success');
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1000);
      }
    } catch (err) {
      console.error('Erro durante o login:', err);
      showAlert('Erro de conexão com o servidor. Tente novamente mais tarde.');
    }
  });
});
