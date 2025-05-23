const API_BASE = 'http://localhost:1337';

const formatarPreco = (valor) => `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;

document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Você precisa estar logado para visualizar o carrinho.');
    window.location.href = 'login.html';
    return;
  }

  let totalPedido = 0;

  try {
    const res = await fetch(`${API_BASE}/api/cart-items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await res.json();
    const data = Array.isArray(json) ? json : json.data;

    const carrinhoContainer = document.getElementById('carrinho-items');
    carrinhoContainer.innerHTML = '';

    if (!Array.isArray(data) || data.length === 0) {
      carrinhoContainer.innerHTML = '<p class="text-muted">Seu carrinho está vazio.</p>';
      document.getElementById('valor-total').textContent = '';
      return;
    }

    const agrupado = {};

    data.forEach(item => {
      const produto = Array.isArray(item.produto) ? item.produto[0] : item.produto;
      if (!produto) return;

      const id = produto.id;
      if (!agrupado[id]) {
        agrupado[id] = {
          produto,
          quantidade: 0,
          preco_unit: item.preco_unit,
          subtotal: 0
        };
      }

      agrupado[id].quantidade += item.quantidade;
      agrupado[id].subtotal += item.quantidade * item.preco_unit;
      totalPedido += item.quantidade * item.preco_unit;
    });

    Object.values(agrupado).forEach(entry => {
      const { produto, quantidade, preco_unit, subtotal } = entry;
      const nome = produto.nome ?? 'Produto';
      const imagem = produto.imagem?.[0]?.formats?.thumbnail?.url ?? 'https://via.placeholder.com/200x150?text=Sem+Imagem';

      const card = document.createElement('div');
      card.className = 'col-md-6';

      card.innerHTML = `
        <div class="card shadow-sm">
          <div class="row g-0">
            <div class="col-4">
              <img src="${API_BASE}${imagem}" class="img-fluid rounded-start" alt="${nome}" style="height: 100%; object-fit: cover;">
            </div>
            <div class="col-8">
              <div class="card-body">
                <h5 class="card-title">${nome}</h5>
                <p class="card-text">Qtd total: ${quantidade}</p>
                <p class="card-text">Preço unitário: ${formatarPreco(preco_unit)}</p>
                <p class="card-text fw-bold">Subtotal: ${formatarPreco(subtotal)}</p>
              </div>
            </div>
          </div>
        </div>
      `;

      carrinhoContainer.appendChild(card);
    });

    document.getElementById('valor-total').textContent = `Total do Pedido: ${formatarPreco(totalPedido)}`;

    // Finalizar pedido
    document.getElementById('finalizar').addEventListener('click', async () => {
      try {
        const res = await fetch(`${API_BASE}/api/finalizarpedido`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (res.ok) {
          const result = await res.json();
          alert('Pedido finalizado com sucesso!');
          location.reload();
        } else {
          const erro = await res.json();
          alert('Erro ao finalizar pedido: ' + (erro?.error?.message || res.statusText));
        }
      } catch (err) {
        console.error(err);
        alert('Erro na requisição.');
      }
    });

  } catch (error) {
    console.error(error);
    alert('Erro ao carregar o carrinho.');
  }
});