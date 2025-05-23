document.addEventListener('DOMContentLoaded', () => {
  const navbarPlaceholder = document.getElementById('navbar-placeholder');
  if (navbarPlaceholder) {
    navbarPlaceholder.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid px-4">
          <a class="navbar-brand" href="../index.html">🛍️ Minha Loja</a>
          <div class="d-flex">
            <a href="./pages/carrinho.html" class="nav-link text-white me-3">
              <i class="bi bi-cart3 fs-5"></i>
            </a>
            <a href="./pages/login.html" class="nav-link text-white">
              <i class="bi bi-person-circle fs-5"></i>
            </a>
          </div>
        </div>
      </nav>
    `;
  }
});
