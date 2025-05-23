document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastro-form');

  const alertContainer = document.getElementById('alert-container');
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

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
      showAlert('Por favor, preencha todos os campos.', 'warning');
      return;
    }

    try {
      const res = await fetch('http://localhost:1337/api/auth/local/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.error?.message || 'Erro ao cadastrar.';
        showAlert(`Erro: ${msg}`);
        return;
      }

      if (data.jwt) {
        localStorage.setItem('token', data.jwt);
        showAlert('Cadastro realizado com sucesso!', 'success');
        setTimeout(() => {
          window.location.href = '../index.html';
        }, 1000);
      } else {
        showAlert('Não foi possível concluir o cadastro.');
      }
    } catch (error) {
      console.error(error);
      showAlert('Erro na conexão com o servidor.');
    }
  });
});
