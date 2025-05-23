document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const pedidos = await apiGet('pedidos?populate=pedido_items', token);
  const container = document.getElementById('pedidos');

  if (!pedidos.data || pedidos.data.length === 0) {
    container.innerHTML = '<p>Você ainda não fez nenhum pedido.</p>';
    return;
  }

  pedidos.data.forEach(ped => {
    const el = document.createElement('div');
    el.className = 'mb-3 p-3 border rounded';
    el.innerHTML = `<strong>Pedido ID:</strong> ${ped.id} - <strong>Data:</strong> ${ped.attributes.createdAt}`;
    container.appendChild(el);
  });
});
