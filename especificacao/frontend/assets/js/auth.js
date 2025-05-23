document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('token');
      alert('Você saiu com sucesso!');
      window.location.href = '../pages/login.html';
    });
  }

  const userOnlyPages = ['pedidos.html', 'upload.html'];
  const pathname = window.location.pathname;
  if (userOnlyPages.some(p => pathname.endsWith(p)) && !localStorage.getItem('token')) {
    alert('Você precisa estar logado para acessar esta página.');
    window.location.href = './login.html';
  }
});
