document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('produtos');
  const data = await apiGet('produtos?populate=*');

  const categorias = Array.from(
    new Set(data.data.map(p => p.categoria?.nome).filter(Boolean))
  );

  const filtroContainer = document.getElementById('filtro-container');
  if (filtroContainer) {
    categorias.forEach(cat => {
      const wrapper = document.createElement('div');
      wrapper.className = 'form-check mb-2';

      wrapper.innerHTML = `
        <input class="form-check-input filtro-categoria" type="checkbox" value="${cat}" id="cat-${cat}">
        <label class="form-check-label" for="cat-${cat}">${cat}</label>
      `;
      filtroContainer.appendChild(wrapper);
    });
  }

  const formatarPreco = (valor) =>
    `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;

  const gerarEstrelas = (nota = 0) => {
    const inteira = Math.floor(nota);
    const meia = nota % 1 >= 0.5 ? 1 : 0;
    const vazias = 5 - inteira - meia;
    return '★'.repeat(inteira) + (meia ? '½' : '') + '☆'.repeat(vazias);
  };

  const render = () => {
    container.innerHTML = '';

    const categoriasSelecionadas = Array.from(
      document.querySelectorAll('.filtro-categoria:checked')
    ).map(cb => cb.value);

    data.data?.forEach(prod => {
      const nome = prod.nome ?? 'Produto sem nome';
      const categoria = prod.categoria?.nome ?? 'Sem categoria';
      const preco = prod.preco ?? 0;
      const avaliacao = prod.avaliacao ?? 0;
      const imagem = prod.imagem?.[0]
        ? `http://localhost:1337${prod.imagem[0].formats.thumbnail.url}`
        : 'https://via.placeholder.com/200x150?text=Sem+Imagem';

      const deveExibir = categoriasSelecionadas.length === 0 || categoriasSelecionadas.includes(categoria);

      if (deveExibir) {
        const el = document.createElement('div');
        el.className = 'col-md-4';

        el.innerHTML = `
          <div class="card border-0 shadow-sm h-100">
            <img src="${imagem}" class="card-img-top p-3" alt="${nome}" style="height: 160px; object-fit: contain;">
            <div class="card-body">
              <h5 class="card-title text-dark">${nome}</h5>
              <p class="text-muted small">Categoria: ${categoria}</p>
              <div class="mb-2">
                <span class="text-warning">${gerarEstrelas(avaliacao)}</span>
                <span class="text-muted small">(${avaliacao.toFixed(1)})</span>
              </div>
              <h4 class="text-primary mb-1">${formatarPreco(preco)}</h4>
              <p class="text-muted mb-1">em até 10x de ${formatarPreco(preco / 10)} sem juros</p>
              <button class="btn btn-warning w-100 text-dark fw-bold btn-add-carrinho" data-id="${prod.id}">Adicionar ao carrinho</button>
            </div>
          </div>
        `;
        container.appendChild(el);
      }
    });

    document.querySelectorAll('.btn-add-carrinho').forEach(btn => {
      btn.addEventListener('click', async () => {
        const produtoId = btn.getAttribute('data-id');
        const token = localStorage.getItem('token');

        if (!token) {
          alert('Você precisa estar logado para adicionar ao carrinho.');
          window.location.href = 'pages/login.html';
          return;
        }

        try {
          const carrinhoRes = await fetch('http://localhost:1337/api/meucarrinho', {
            headers: { Authorization: `Bearer ${token}` }
          });

          const carrinhoData = await carrinhoRes.json();
          const carrinhoId = carrinhoData?.data?.id;

          if (!carrinhoId) {
            alert('Carrinho do usuário não encontrado.');
            return;
          }

          const produto = data.data.find(p => p.id == produtoId);
          const preco_unit = produto?.preco ?? 0;

          const res = await fetch('http://localhost:1337/api/cart-items', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              data: {
                produto: parseInt(produtoId),
                carrinho: carrinhoId,
                quantidade: 1,
                preco_unit
              }
            })
          });

          if (res.ok) {
            alert('Produto adicionado ao carrinho com sucesso!');
          } else {
            const error = await res.json();
            alert('Erro ao adicionar: ' + (error?.error?.message || res.statusText));
          }
        } catch (err) {
          console.error(err);
          alert('Erro ao se comunicar com o servidor.');
        }
      });
    });
  };

  document.addEventListener('change', (e) => {
    if (e.target.classList.contains('filtro-categoria')) {
      render();
    }
  });

  render();
});
